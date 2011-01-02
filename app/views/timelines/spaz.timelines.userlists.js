
/**
 * User Lists timeline def 
 */
var UserlistsTimeline = function(args) {

	var thisULT   = this,
	    $timeline = $('#timeline-userlists'),
	    $timelineWrapper = $timeline.parent();
	
	this.twit = new SpazTwit();
	
	this.list = {
		'user':null,
		'slug':null
	};
	
	/**
	 * @param {string} slug the list slug
	 * @param {string} user the user who owns the list 
	 */
	this.setlist = function(slug, user) {
		if (slug != this.list.slug || user != this.list.user) {
			$(this.timeline.timeline_container_selector).empty();
		}
		
		this.list.user = user;
		this.list.slug = slug;
		
		
		
		this.timeline.start();
	};
	
	/*
		set up the userlists timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'get_list_timeline_succeeded',
		'failure_event':'get_list_timeline_failed',
		'event_target' :document,
		
		'refresh_time':1000*60*5, // 30 minutes
		'max_items':300,

		'request_data': function() {
			thisULT.markAsRead($timeline.selector + ' div.timeline-entry');
						
			if (thisULT.list.user && thisULT.list.slug) {
				// Give UI feedback immediately
				if($timeline.is(':empty')){
					$timelineWrapper.children('.loading').show();
				}
				Spaz.UI.statusBar('Loading user list&hellip;');
				Spaz.UI.showLoading();

				$('#timeline-userlists-full-name').
					text("@"+thisULT.list.user+'/'+thisULT.list.slug).show();
				$timelineWrapper.children('.intro').hide();

				thisULT.twit.setCredentials(Spaz.Prefs.getAuthObject());
				Spaz.Data.setAPIUrl(thisULT.twit);
				thisULT.twit.getListTimeline(thisULT.list.slug, thisULT.list.user);
			}
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('lists_timeline_data_success_start');
			
			sch.debug('statuses:'+data.statuses);
			sch.debug('user:'+data.user);
			sch.debug('slug:'+data.slug);
			
			// data.statuses = data.statuses.reverse();
			var no_dupes = [];
			
			var status;
			
			for (var i = 0, iMax = data.statuses.length; i < iMax; i++) {
				status = data.statuses[i];
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+status.id+']').length<1) {
					
					no_dupes.push(status);
					/*
						Save to DB via JazzRecord
					*/
					Spaz.TweetsModel.saveTweet(status);
				} else {
					sch.debug(status.id+' already exists');
				}
				
			}

			/*
				process new items through filter chain
			*/			
			no_dupes = Spaz.TimelineFilters.lists.processArray(no_dupes);


			$timelineWrapper.children('.loading, .new-user, .intro').hide();
			thisULT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-userlists').trigger('keyup');
			
			
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // user is never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			
			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('lists_timeline_data_success_finish');
			
		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the userlists timeline";
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
	
	
	
	this.buildListsMenu = function() {
		var auth     = Spaz.Prefs.getAuthObject(),
		    username = Spaz.Prefs.getUsername();
		thisULT.twit.setCredentials(auth);
		Spaz.Data.setAPIUrl(thisULT.twit);
		sch.debug("Loading lists for @"+username+ "…");
		Spaz.UI.statusBar("Loading lists for @"+username+ "&hellip;");
		Spaz.UI.showLoading();

		function onDataRequestSuccess(data){
			var i, iMax, menu,
			    menuId  = 'lists-menu',
			    $toggle = $('#view-userlists');

			// Build menu
			function menuItemId(id){
				return menuId + '-' + id;
			}
			function onMenuItemClick(e, itemData){
				thisULT.setlist(itemData.slug, itemData.username);
				jQuery('#' + menuItemId(itemData.id)).addClass('selected').
					siblings('.selected').removeClass('selected');
			}
			menu = new SpazMenu({
				base_id:    menuId,
				base_class: 'spaz-menu',
				li_class:   'spaz-menu-item',
				items_func: function(itemsData){
					var i, iMax, itemData, items = [];

					// Add user lists
					for(i = 0, iMax = itemsData.lists.length; i < iMax; i++){
						itemData = itemsData.lists[i];
						items.push({
							id:      menuItemId(itemData.id),
							label:   itemData.name,
							handler: onMenuItemClick,
							data: {
								id:       itemData.id,
								slug:     itemData.slug,
								username: itemData.user.screen_name
							}
						});
					}
					items.sort(function(a, b){
						return (a.label === b.label) ? 0 :
						       (a.label > b.label)   ? 1 : -1;
					});

					// Add management controls
					if(items.length > 0){
						items.push(null); // Separator
					}
					// items.push({
					// 	label:   'Add list&hellip; (N/A)',
					// 	handler: function(e){}
					// });
					items.push({
						// This will be built into a later version of Spaz. For now,
						// manage lists via web instead.
						label:   'Manage lists&hellip;',
						handler: function(e){
							sch.openInBrowser('http://twitter.com/lists');
						}
					});

					return items;
				}
			});
			menu.bindToggle($toggle.selector, { showData: data });

			Spaz.UI.statusBar('Loaded lists for @' + username);
			Spaz.UI.hideLoading();

			sch.listen(document, 'before_account_switched', function(e, account){
				menu.hideAndDestroy();
				$('#timeline-userlists-full-name').hide();
			});
		} // function onDataRequestSuccess

		function onDataRequestFailure(msg){
			Spaz.UI.statusBar('Error loading lists for @' + username);
			Spaz.UI.hideLoading();
		}

		Spaz.Data.getLists('@' + username, null,
			onDataRequestSuccess, onDataRequestFailure);
	};

	/*
		build the lists menu
	*/
	thisULT.buildListsMenu();
};

UserlistsTimeline.prototype = new AppTimeline();
