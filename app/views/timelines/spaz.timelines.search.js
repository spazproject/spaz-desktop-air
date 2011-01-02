
/**
 * Search timeline def 
 */
var SearchTimeline = function(args) {

	var thisST    = this,
	    $timeline = $('#timeline-search'),
	    $timelineWrapper = $timeline.parent();
	
	this.query = null;
	this.lastquery = null;
	
	this.twit = new SpazTwit();
	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_search_timeline_data',
		'failure_event':'error_search_timeline_data',
		
		'event_target' :document,
		
		
		'refresh_time':1000*60*15, // 15 minutes
		'max_items': 300,

		'request_data': function() {
			var $searchInput = jQuery('#search-for');
			var count = Spaz.Prefs.get('timeline-search-pager-count');

			if ($searchInput.val().length > 0) {
				thisST.query = $searchInput.val();

				// Give UI feedback immediately
				$timelineWrapper.children('.intro, .empty').hide();
				$timelineWrapper.children('.loading').show();
				Spaz.UI.statusBar("Searching for '" + thisST.query + "'&hellip;");
				Spaz.UI.showLoading();

				if (!thisST.lastquery) {
					thisST.lastquery = thisST.query;
				} else if (thisST.lastquery != thisST.query) {
					$timeline.find('.timeline-entry').remove();
				}
				
				// alert(thisST.lastquery+"\n"+thisST.query);
				
				// clear the existing results if this is a new query
				thisST.markAsRead($timeline.selector + ' div.timeline-entry');
				
				Spaz.Data.setAPIUrl(thisST.twit);
        		var auth = Spaz.Prefs.getAuthObject();
        		var username = Spaz.Prefs.getUsername();
        		thisST.twit.setCredentials(auth);
				thisST.twit.search(thisST.query, null, 100);
				thisST.lastquery = thisST.query;
			}
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('search_timeline_data_success_start');
			
			sch.debug(e);
			sch.debug(data[1]);
			sch.debug(data[0]);
			var query_info = data[1];
			data = data[0] || [];
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    sui = new SpazImageURL(),
			    dataItem;
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {
					
										
					no_dupes.push(dataItem);
					
					// don't save search tweets -- inconsistent data, esp for users
					// Spaz.TweetsModel.saveTweet(dataItem);
				}
				
			}
			
			/*
				process new items through filter chain
			*/			
			no_dupes = Spaz.TimelineFilters.search.processArray(no_dupes);
			
			$timelineWrapper.children('.loading, .intro').hide();
			if (no_dupes.length > 0) {
				thisST.timeline.addItems(no_dupes);
			}
			$timelineWrapper.children('.empty').toggle($timeline.is(':empty'));

			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // search are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('search_timeline_data_success_finish');
		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving your favorites";
			Spaz.UI.statusBar(err_msg);
			$timelineWrapper.children('.loading').hide();

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('timeline_entry', obj);
		}
	});

	this.searchFor = function(query){
		jQuery('#search-for').val(query);
		thisST.timeline.refresh();

		var dataQueryAttr = query.toLowerCase().replace('"', '\\"'),
		    $queryLI = jQuery('#saved-searches-menu li').removeClass('selected').
		                 filter('[data-query="' + dataQueryAttr + '"]');
		if($queryLI[0]){
			$queryLI.addClass('selected');
		}
	};

	this.buildSavedSearchesMenu = function(){
		var auth     = Spaz.Prefs.getAuthObject(),
		    username = Spaz.Prefs.getUsername();
		thisST.twit.setCredentials(auth);
		Spaz.Data.setAPIUrl(thisST.twit);
		sch.debug('Loading saved searches for @'+username+'…');
		Spaz.UI.statusBar('Loading saved searches for @'+username+'&hellip;');
		Spaz.UI.showLoading();

		function onDataRequestSuccess(data){
			var i, iMax, menu,
			    menuId  = 'saved-searches-menu',
			    $toggle = $('#search-saved');

			// Build menu
			function menuItemId(id){
				return menuId + '-' + id;
			}
			function onMenuItemClick(e, itemData){
				thisST.searchFor(itemData.query);
			}
			menu = new SpazMenu({
				base_id:    menuId,
				base_class: 'spaz-menu',
				li_class:   'spaz-menu-item',
				items_func: function(itemsData){
					var i, iMax, itemData, items = [];

					// Add saved searches
					for(i = 0, iMax = itemsData.length; i < iMax; i++){
						itemData = itemsData[i];
						items.push({
							id:      menuItemId(itemData.id),
							attrs:   { 'data-query': itemData.query.toLowerCase() },
							label:   itemData.name,
							handler: onMenuItemClick,
							data: {
								id:    itemData.id,
								query: itemData.query
							}
						});
					}
					items.sort(function(a, b){
						// TODO: Sort by `a.position` instead when Twitter allows changing
						//       saved searches' positions
						return (a.label === b.label) ? 0 :
						       (a.label > b.label)   ? 1 : -1;
					});

					// Add management controls
					// TODO: Implement
					// if(items.length > 0){
					// 	items.push(null); // Separator
					// }
					// items.push({
					// 	label:   'Save current search (N/A)',
					// 	handler: function(e){}
					// });
					// items.push({
					// 	label:   'Manage saved searches&hellip; (N/A)',
					// 	handler: function(e){}
					// });

					return items;
				}
			});
			menu.bindToggle($toggle.selector, { showData: data });

			Spaz.UI.statusBar('Loaded saved searches for @' + username);
			Spaz.UI.hideLoading();

			sch.listen(document, 'before_account_switched', function(e, account){
				menu.hideAndDestroy();
			});
		} // function onDataRequestSuccess

		function onDataRequestFailure(msg){
			Spaz.UI.statusBar('Error loading saved searches for @' + username);
			Spaz.UI.hideLoading();
		}

		thisST.twit.getSavedSearches(onDataRequestSuccess, onDataRequestFailure);
	};

	thisST.buildSavedSearchesMenu();

};

SearchTimeline.prototype = new AppTimeline();

