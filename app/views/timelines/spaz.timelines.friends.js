/**
 * Friends timeline def 
 */
var FriendsTimeline = function() {

	var thisFT    = this,
	    $timeline = $('#timeline-friends'),
	    $timelineWrapper = $timeline.parent();
	this.twit  = new SpazTwit();
	this.shurl = new SpazShortURL();
	
	/**
	 * helper to get refresh time. pass true or false to force state of "stream_enabled"; otherwise uses pref
	 */
	function getRefreshTime(stream_enabled) {
		
		if (!stream_enabled === true && !stream_enabled === false) {
			stream_enabled = Spaz.Prefs.get('twitter-enable-userstream');
		}
		
		var refresh_time = Spaz.Prefs.get('network-refreshinterval');
		if (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_TWITTER && stream_enabled) {
			refresh_time = -1;
		}
		return refresh_time;
	}
	
	
	// set up listener to close existing user streams
	sch.listen(document, 'before_account_switched', function(e, account) {
		sch.debug('closing user stream because of account switch');
		thisFT.twit.closeUserStream();
	});

	sch.listen(document, 'pref_user_stream_changed', function(e, stream_enabled) {
		sch.debug('user stream changed ===========================================');
		sch.debug("stream_enabled: "+ stream_enabled);
		if ( (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_TWITTER) && stream_enabled ) {
			sch.debug('Spaz.Prefs.getAccountType():'+Spaz.Prefs.getAccountType());
			sch.debug('stream_enabled:'+stream_enabled);
			sch.debug('opening user stream');
			thisFT.twit.openUserStream(function(data) {
				sch.debug('new stream data received');
				sch.trigger('new_combined_timeline_data', document, [data]);
			});
		} else {
			sch.debug('closing user stream because of pref change');
			thisFT.twit.closeUserStream();
		}
		thisFT.timeline.refresh_time = getRefreshTime(stream_enabled);
		sch.debug('refresh_time:'+thisFT.timeline.refresh_time);
		sch.debug('refreshing because of pref_user_stream_changed');
		setTimeout(function() {
			thisFT.refresh();
		}, 1000); // give it a sec to refresh (so pref sets correctly and things aren't so busy)
		sch.debug('user stream listener done ======================================');
	});

	var maxFT = {
		'home':    500,
		'direct':  100,
		'replies': 100
	};
	
	
	/*
		set up the Friends timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_combined_timeline_data',
		'failure_event':'error_combined_timeline_data',
		'event_target' :document,
		
		'refresh_time':getRefreshTime(),
		'max_items': (maxFT.home + maxFT.direct + maxFT.replies),

		'request_data': function() {
			sch.dump('REQUESTING DATA FOR FRIENDS TIMELINE =====================');

			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading friends timeline&hellip;');
			Spaz.UI.showLoading();
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');

			var count = {
				'home': Spaz.Prefs.get('timeline-home-pager-count'),
				'direct': Spaz.Prefs.get('timeline-direct-pager-count'),
				'replies': Spaz.Prefs.get('timeline-replies-pager-count')
			};

			var com_opts = {
				'home_count': (count.home > maxFT.home ? maxFT.home : count.home),
				'dm_count': (count.direct > maxFT.direct ? maxFT.direct : count.direct),
				'replies_count': (count.replies > maxFT.replies ? maxFT.replies : count.replies)
			};

			thisFT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			sch.debug('thisFT.twit.username:'+thisFT.twit.username);
			sch.debug('thisFT.twit.auth:'+sch.enJSON(thisFT.twit.auth));
			sch.debug('Account Type:'+Spaz.Prefs.getAccountType());
			sch.debug(Spaz.Prefs.getCustomAPIUrl());
            Spaz.Data.setAPIUrl(thisFT.twit);
			
			thisFT.twit.getCombinedTimeline(com_opts);
			
			if (Spaz.Prefs.get('twitter-enable-userstream')) {
				sch.debug("Spaz.Prefs.get('twitter-enable-userstream'): "+Spaz.Prefs.get('twitter-enable-userstream'));
				sch.debug("typeof Spaz.Prefs.get('twitter-enable-userstream'): "+ typeof Spaz.Prefs.get('twitter-enable-userstream'));
				if ( (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_TWITTER) && !thisFT.twit.userStreamExists() ) {
					sch.debug('opening user stream in request_data');
					thisFT.twit.openUserStream(function(data) {
						sch.debug('new stream data received');
						sch.trigger('new_combined_timeline_data', document, [data]);
					});
				}
			}
			
			sch.dump('REQUEST_DATA');
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('friends_timeline_data_success_start');
			
			sch.dump('DATA_SUCCESS');
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    dataItem;

			sch.dump(data);
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];
				sch.dump(i);

				if (dataItem.SC_is_retweet) {
					dataItem.id = dataItem.retweeted_status.id;
				}
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {
					var is_dm = false;
					
					// check if entry has been read
					if (dataItem.SC_is_dm) { is_dm = true; }
					dataItem.SC_is_read = !!Spaz.DB.isRead(dataItem.id, is_dm);
					
					sch.debug(i +' is ' + dataItem.SC_is_read);
					
					no_dupes.push(dataItem);
					
					/*
						Save to DB via JazzRecord
					*/
					Spaz.TweetsModel.saveTweet(dataItem);
					
				}
				
			}

			/*
				process new items through filter chain
			*/
			no_dupes = Spaz.TimelineFilters.friends.processArray(no_dupes);

			/*
				Record old scroll position
			*/
			var $oldFirst, offset_before;
			$oldFirst	  = $timeline.find('div.timeline-entry:first');
			if ($oldFirst.length > 0) {
			    offset_before = $oldFirst.offset().top;
			}
				

			/*
				Add new items
			*/
			$timelineWrapper.children('.loading, .new-user').hide();
			
			setTimeout(function(){
				$timeline.children('.animate-in').removeClass('animate-in');
			}, 2000);
			
			thisFT.timeline.addItems(no_dupes);

			/*
				sort timeline
			*/
			var before = new Date();
			
			// don't sort if we don't have anything new!
			if (no_dupes.length > 0) {
				// get first of new times
				var new_first_time = no_dupes[0].SC_created_at_unixtime;
				// get last of new times
				var new_last_time  = no_dupes[no_dupes.length-1].SC_created_at_unixtime;
				// get first of OLD times
				var old_first_time = parseInt($oldFirst.attr('data-timestamp'), 10);
				// sort if either first new or last new is OLDER than the first old
				if (new_first_time < old_first_time || new_last_time < old_first_time) {
					$('div.timeline-entry', $timeline).tsort({attr:'data-timestamp', place:'orig', order:'desc'});					
				} else {
					sch.debug('Didn\'t resort…');
				}

			}
			var after = new Date();
			var total = new Date();
			total.setTime(after.getTime() - before.getTime());
			sch.debug('Sorting took ' + total.getMilliseconds() + 'ms');				
			

			sch.note('notify of new entries!');
			Spaz.UI.notifyOfNewEntries(no_dupes);

			/*
				expand URLs
			*/
			// var exp_urls = [];
			// for (var i=0; i < no_dupes.length; i++) {
			//	urls = thisFT.shurl.findExpandableURLs(no_dupes[i].text);
			//	if (urls) {
			//		exp_urls = exp_urls.concat(urls);
			//	}
			// };
			// 
			// thisFT.shurl.expandURLs(exp_urls, thisFT.timeline.container);

			$('div.timeline-entry.new div.status-text', thisFT.timeline.container).each(function(i) {
				var urls = thisFT.shurl.findExpandableURLs(this.innerHTML);
				if (urls) {
					sch.debug(urls);
					sch.debug(this.innerHTML);
					sch.listen(this, sc.events.newExpandURLSuccess, thisFT.expandURL);
					thisFT.shurl.expandURLs(urls, this);
				}
			});


			/*
				set new scroll position
			*/
			if (offset_before) {
			    var offset_after = $oldFirst.offset().top;
    			var offset_diff = Math.abs(offset_before - offset_after);
    			if ($timelineWrapper.scrollTop() > 0) {
    				$timelineWrapper.scrollTop( $timelineWrapper.scrollTop() + offset_diff );
    			}
			}

			/*
				reapply filtering
			*/
			$('#filter-friends').trigger('keyup');
			
			sch.updateRelativeTimes($timeline.selector + ' .status-created-at', 'data-created-at');
						
			/*
				get new set of usernames
			*/
			Spaz.Autocomplete.initSuggestions();
			
			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('friends_timeline_data_success_finish');

		},
		'data_failure': function(e, error_obj) {
			sch.dump('DATA_FAILURE');

			// Give UI feedback immediately
			var err_msg = "There was an error retrieving your timeline";
			Spaz.UI.statusBar(err_msg);
			$timelineWrapper.children('.loading').hide();

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			var html = '', $html;
			if (obj.SC_is_dm) {
				html = Spaz.Tpl.parse('timeline_entry_dm', obj);
			} else {
				html = Spaz.Tpl.parse('timeline_entry', obj);
			}
			$html = jQuery(html).addClass('animate-in');
			html = $html[0].outerHTML;
			return html;
		}
	});

	this.buildViewMenu = function(){
		var menu,
		    menuId = 'view-friends-menu';
		
		function onStandardFilterClick(e){
			Spaz.cssFilters.applyFilter(e.data.item.id);
		}
		function onCustomFilterClick(e, itemData){
			// TODO: Implement
		}

		menu = new SpazMenu({
			base_id:    menuId,
			base_class: 'spaz-menu',
			li_class:   'spaz-menu-item',
			items_func: function(){
				var items = [], filter, i;

				// Add standard filters
				for (i = 0; i < Spaz.cssFilters.filters.length; i++) {
					filter = Spaz.cssFilters.filters[i];
					items.push({
						label:   filter.label,
						id:      filter.id,
						handler: onStandardFilterClick
					});
				}
				
				// Add saved custom filters
				// items.push(null); // Separator
				// TODO: Implement; use `onCustomFilterClick`

				// Add controls for managing custom filters
				// TODO: After adding/deleting a custom filter, empty the menu. This
				//       forces it to be rebuilt the next time it's shown.
				// items.push({
				// 	label:   'Save current filter (N/A)',
				// 	handler: function(){
				// 		sch.debug('Save current filter (N/A)');
				// 		// TODO: Implement
				// 	}
				// });
				// items.push({
				// 	label:   'Manage saved filters&hellip; (N/A)',
				// 	handler: function(){
				// 		sch.debug('Manage saved filters (N/A)');
				// 		// TODO: Implement
				// 	}
				// });

				return items;
			}
		});
		menu.bindToggle('#view-friends', {
			afterShow: function(e){
				jQuery('#' + Spaz.cssFilters.currentFilter).addClass('selected').
					siblings('.selected').removeClass('selected');
			}
		});
		sch.listen(document, 'before_account_switched', function(e, account){
			menu.hideAndDestroy();
		});
	};

	/*
		override the default method
	*/
	this.timeline.removeExtraItems = function() {
		var sel = $timeline.selector;
		sch.removeExtraElements(sel + ' div.timeline-entry:not(.reply):not(.dm)', Spaz.Prefs.get('timeline-home-pager-count'));
		sch.removeExtraElements(sel + ' div.timeline-entry.reply', Spaz.Prefs.get('timeline-replies-pager-count'));
		sch.removeExtraElements(sel + ' div.timeline-entry.dm', Spaz.Prefs.get('timeline-direct-pager-count'));
	};

	
	/*
		handler for URL expansion
	*/
	this.expandURL = function(e, data) {
		
		var el = e.target;
		sch.unlisten(el, sc.events.newExpandURLSuccess, thisFT.expandURL);

		sch.debug('expanding…');
		sch.debug(data);
		if(data.longurl){
			// `data.longurl` may be null if the URL lengthening service fails
			el.innerHTML = thisFT.shurl.replaceExpandableURL(
				el.innerHTML, data.shorturl, data.longurl);
		}
	};

	/*
		listener for URL expansion
	*/
	sch.listen(this.timeline.container, sc.events.newExpandURLSuccess, this.expandURL);

	this.buildViewMenu();

};

FriendsTimeline.prototype = new AppTimeline();

FriendsTimeline.prototype.reset = function() {
	sch.debug('reset friends timeline');
};


