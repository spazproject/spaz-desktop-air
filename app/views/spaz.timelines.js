var Spaz; if (!Spaz){ Spaz = {}; }

if (!Spaz.Timelines){ Spaz.Timelines = {}; }


/**
 * options used for makeClickable calls 
 */
var SPAZ_MAKECLICKABLE_OPTS = {
	'autolink': {
		'type'		:'both',
		'extra_code':'',
		'maxlen'	:100
	},
	'screenname': {
		'tpl':'<span class="user-screen-name clickable" title="View user\'s profile" user-screen_name="#username#">@#username#</span>' // should contain macro '#username#'
	},
	'hashtag': {
		'tpl':'<span class="hashtag clickable" title="Search for this hashtag" data-hashtag="#hashtag_enc#">##hashtag#</span>' // should contain macros '#hashtag#' and '#hashtag_enc#'
	}
};


/**
 * The string prefix for a "not these" filter
 */
var NEGATION_TOKEN = "not:";

/**
 * The AppTimeline is defined here so we can inherit its prototype below 
 */
var AppTimeline = function() {};


AppTimeline.prototype.model = {
	'items' : []
};

/**
 * This is just a wrapper to start the SpazTimeline object contained within 
 */
AppTimeline.prototype.activate = function() {
	this.timeline.start();
};

/**
 * filter the timeline (hide or show entries) based on a string of terms
 * @param {string} terms 
 */
AppTimeline.prototype.filter = function(terms) {
	var entry_selector = this.getEntrySelector();
	sch.dump(entry_selector);
	var jqentries = jQuery(entry_selector);
	jqentries.removeClass('hidden');

	if (terms) {
		try {
			var negate = false;
			if (terms.substring(0, NEGATION_TOKEN.length).toLowerCase() === NEGATION_TOKEN) {
				negate = true;
				terms  = terms.slice(NEGATION_TOKEN.length);
			}
			var filter_re = new RegExp(sch.trim(terms), "i");
			sch.dump(filter_re.toString());
			jqentries.each(function(i) {
				var jqthis = jQuery(this);
				if (negate) {
					if ( jqthis.text().search(filter_re) > -1 ) {
						jqthis.addClass('hidden');
					}
				} else {
					if ( jqthis.text().search(filter_re) === -1 ) {
						jqthis.addClass('hidden');
					}
				}
			});
		} catch(e) {
			sch.debug(e.name+":"+e.message);
		}
	}

};

AppTimeline.prototype.filterWithDelay = function(terms){
	var _this = this;

	if(this.filterTimeout){ this.clearFilterTimeout(); }

	this.filterTimeout = setTimeout(function(){
		_this.filter(terms);
		_this.clearFilterTimeout();
	}, 100);
};

AppTimeline.prototype.clearFilterTimeout = function(){
	clearTimeout(this.filterTimeout);
	delete this.filterTimeout;
};

AppTimeline.prototype.clear = function() {
	var entry_selector = this.getEntrySelector();
	$(entry_selector).remove();
};


AppTimeline.prototype.markAsRead = function() {
	var entry_selector = this.getEntrySelector();

	/* we use our own "mark as read" here because the helper version just removes the 'new' class' */
	$(entry_selector+':visible').removeClass('new').addClass('read').each(function(i){
		var status_id = $(this).attr('data-status-id');
		Spaz.DB.markEntryAsRead(status_id);
	});
	$().trigger('UNREAD_COUNT_CHANGED');

};

AppTimeline.prototype.getEntrySelector = function() {
	return this.getTimelineSelector()+' div.timeline-entry';
};

AppTimeline.prototype.getWrapperSelector = function() {
	return this.getTimelineSelector().replace('timeline-', 'timelinewrapper-');
};

AppTimeline.prototype.getTimelineSelector = function() {
	return this.timeline.timeline_container_selector;
};

AppTimeline.prototype.sortByAttribute = function(sortattr, idattr, sortfunc) {

	var items = jQuery( this.getEntrySelector() ),
	    itemAttrs   = [],
	    itemsSorted = [],
	    sortedHTML  = '';
	sortfunc = sortfunc || function(a,b){return b.sortval - a.sortval;};

	(function(){
		var i, iMax, $item, attrobj;
		for (i = 0, iMax = items.length; i < iMax; i++){
			$item = jQuery(items[i]);
			attrobj = {
				id:			$item.attr(idattr),
				sortval:	$item.attr(sortattr)
			};
			itemAttrs.push(attrobj);
		}
	})();

	itemAttrs.sort( sortfunc );

	(function(){
		var i, iMax, attrobj, selector, $item, itemHTML;
		for (i = 0, iMax = itemAttrs.length; i < iMax; i++){
			attrobj = itemAttrs[i];
			selector = this.getEntrySelector()+"["+idattr+"=" + attrobj.id + "]";
			// sch.error(selector);
			$item = jQuery(selector);
			// sch.error($item.length);
			itemHTML = $item.get(0).outerHTML;
			// sch.error(itemHTML);
			itemsSorted.push(itemHTML);
		}
	})();
	
	sortedHTML = '<div>'+itemsSorted.join('')+'</div>';
	
	jQuery(this.getTimelineSelector()).html(sortedHTML);
};

AppTimeline.prototype.refresh = function() {
	sch.error('refreshing timeline');
	this.timeline.refresh();
};


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
		sch.error('closing user stream because of account switch');
		thisFT.twit.closeUserStream();
	});

	sch.listen(document, 'pref_user_stream_changed', function(e, stream_enabled) {
		sch.error('user stream changed ===========================================');
		sch.error("stream_enabled: "+ stream_enabled);
		if ( (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_TWITTER) && stream_enabled ) {
			sch.error('Spaz.Prefs.getAccountType():'+Spaz.Prefs.getAccountType());
			sch.error('stream_enabled:'+stream_enabled);
			sch.error('opening user stream');
			thisFT.twit.openUserStream(function(data) {
				sch.error('new stream data received');
				sch.trigger('new_combined_timeline_data', document, [data]);
			});
		} else {
			sch.error('closing user stream because of pref change');
			thisFT.twit.closeUserStream();
		}
		thisFT.timeline.refresh_time = getRefreshTime(stream_enabled);
		sch.error('refresh_time:'+thisFT.timeline.refresh_time);
		sch.error('refreshing because of pref_user_stream_changed');
		setTimeout(function() {
			thisFT.refresh();
		}, 1000); // give it a sec to refresh (so pref sets correctly and things aren't so busy)
		sch.error('user stream listener done ======================================');
	});

	var maxFT = {
		'home': Spaz.Prefs.get('timeline-home-pager-count-max'),
		'direct': Spaz.Prefs.get('timeline-direct-pager-count-max'),
		'replies': Spaz.Prefs.get('timeline-replies-pager-count-max')
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
			Spaz.UI.statusBar('Loading friends timeline…');
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
				sch.error("Spaz.Prefs.get('twitter-enable-userstream'): "+Spaz.Prefs.get('twitter-enable-userstream'));
				sch.error("typeof Spaz.Prefs.get('twitter-enable-userstream'): "+ typeof Spaz.Prefs.get('twitter-enable-userstream'));
				if ( (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_TWITTER) && !thisFT.twit.userStreamExists() ) {
					sch.error('opening user stream in request_data');
					thisFT.twit.openUserStream(function(data) {
						sch.error('new stream data received');
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
					
					// check if entry has been read
					dataItem.SC_is_read = !!Spaz.DB.isRead(dataItem.id);
					
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
					sch.error('Didn\'t resort…');
				}

			}
			var after = new Date();
			var total = new Date();
			total.setTime(after.getTime() - before.getTime());
			sch.error('Sorting took ' + total.getMilliseconds() + 'ms');				
			

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
			var html = '';
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
		    menuId = 'view-friends-menu',
		    currentFilterId = Spaz.cssFilters.filters[0].id;

		function onStandardFilterClick(e){
			Spaz.cssFilters.applyFilter(e.data.item.id);
			currentFilterId = e.data.item.id;
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
				items.push(null); // Separator
				// TODO: Implement; use `onCustomFilterClick`

				// Add controls for managing custom filters
				// TODO: After adding/deleting a custom filter, empty the menu. This
				//       forces it to be rebuilt the next time it's shown.
				items.push({
					label:   'Save current filter (NYI)',
					handler: function(){
						sch.debug('Save current filter (NYI)');
						// TODO: Implement
					}
				});
				items.push({
					label:   'Manage saved filters&hellip; (NYI)',
					handler: function(){
						sch.debug('Manage saved filters (NYI)');
						// TODO: Implement
					}
				});

				return items;
			}
		});
		menu.bindToggle('#view-friends', {
			afterShow: function(e){
				jQuery('#' + currentFilterId).addClass('selected').
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







/**
 * Public timeline def 
 */
var PublicTimeline = function(args) {
	
	var thisPT			 = this,
		$timeline		 = $('#timeline-public'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_public_timeline_data',
		'failure_event':'error_public_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading public timeline…');
			Spaz.UI.showLoading();
			thisPT.markAsRead($timeline.selector + ' div.timeline-entry');

			Spaz.Data.setAPIUrl(thisPT.twit);
			thisPT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			thisPT.twit.getPublicTimeline();
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('public_timeline_data_success_start');
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    dataItem; // "datum"?
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];

				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {

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
			no_dupes = Spaz.TimelineFilters['public'].processArray(no_dupes);

			$timelineWrapper.children('.loading').hide();
			thisPT.timeline.addItems(no_dupes);

			/*
				reapply filtering
			*/
			$('#filter-public').trigger('keyup');

			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // public are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('public_timeline_data_success_finish');

		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the public timeline";
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




};

PublicTimeline.prototype = new AppTimeline();





/**
 * Public timeline def 
 */
var FavoritesTimeline = function(args) {

	var thisFVT			 = this,
		$timeline		 = $('#timeline-favorites'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();

	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',

		'success_event':'new_favorites_timeline_data',
		'failure_event':'error_favorites_timeline_data',
		'event_target' :document,

		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading favorites…');
			Spaz.UI.showLoading();
			thisFVT.markAsRead($timeline.selector + ' div.timeline-entry');

			thisFVT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			Spaz.Data.setAPIUrl(thisFVT.twit);
			thisFVT.twit.getFavorites();
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('favorites_timeline_data_success_start');
			
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
					/*
						Save to DB via JazzRecord
					*/
					Spaz.TweetsModel.saveTweet(dataItem);
				}

			}

			/*
				process new items through filter chain
			*/			
			no_dupes = Spaz.TimelineFilters.other.processArray(no_dupes);

			$timelineWrapper.children('.loading, .new-user').hide();
			thisFVT.timeline.addItems(no_dupes);

			/*
				reapply filtering
			*/
			$('#filter-favorites').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // favorites are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('favorites_timeline_data_success_finish');

		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the favorites timeline";
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
};

FavoritesTimeline.prototype = new AppTimeline();





/**
 * User timeline def 
 */
var UserTimeline = function(args) {

	var thisUT			 = this,
		$timeline		 = $('#timeline-user'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();

	var maxUT = Spaz.Prefs.get('timeline-user-pager-count-max');

	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_user_timeline_data',
		'failure_event':'error_user_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items': maxUT,

		'request_data': function() {
			var username = Spaz.Prefs.getUsername();

			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading @' + username + '\'s timeline…');
			Spaz.UI.showLoading();
			thisUT.markAsRead($timeline.selector + ' div.timeline-entry');

			var countmax = thisUT.timeline.max_items;
			var count = Spaz.Prefs.get('timeline-user-pager-count');
			count = (count > maxUT ? maxUT : count);

			thisUT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			Spaz.Data.setAPIUrl(thisUT.twit);
			sch.error('username in UserTimeline is '+username);
			thisUT.twit.getUserTimeline(username, count);
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('user_timeline_data_success_start');
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    dataItem;
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {
					
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
			no_dupes = Spaz.TimelineFilters.other.processArray(no_dupes);

			$timelineWrapper.children('.loading, .new-user').hide();
			thisUT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-user').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // user is never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('user_timeline_data_success_finish');
			
		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the user timeline";
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
	
	
	
};

UserTimeline.prototype = new AppTimeline();





/**
 * User timeline def 
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
				Spaz.UI.statusBar('Loading followers list…');
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
		Spaz.UI.statusBar("Loading lists for @"+username+ "…");
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

					if(items.length > 0){
						items.push(null); // Separator
					}

					// Add management controls
					// items.push({
					// 	label:   'Add list&hellip; (NYI)',
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

		thisULT.twit.getLists(
			username, onDataRequestSuccess, onDataRequestFailure);
	};

	/*
		build the lists menu
	*/
	thisULT.buildListsMenu();
};

UserlistsTimeline.prototype = new AppTimeline();




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
	
	var maxST = Spaz.Prefs.get('timeline-search-pager-count-max');
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
		'max_items': maxST,

		'request_data': function() {
			var $searchInput = jQuery('#search-for');
			var count = Spaz.Prefs.get('timeline-search-pager-count');
			count = (count > maxST ? maxST : count);

			if ($searchInput.val().length > 0) {
				thisST.query = $searchInput.val();

				// Give UI feedback immediately
				$timelineWrapper.children('.intro, .empty').hide();
				$timelineWrapper.children('.loading').show();
				Spaz.UI.statusBar("Searching for '" + thisST.query + "'…");
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
				thisST.twit.search(thisST.query, null, count);
				thisST.lastquery = thisST.query;
			}
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('search_timeline_data_success_start');
			
			sch.debug(e);
			sch.error(data[1]);
			sch.error(data[0]);
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
					
					/*
						Save to DB via JazzRecord
					*/
					Spaz.TweetsModel.saveTweet(dataItem);
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
		Spaz.UI.statusBar('Loading saved searches for @'+username+'…');
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

					if(items.length > 0){
						items.push(null); // Separator
					}

					// Add management controls
					items.push({
						label:   'Save current search (NYI)',
						handler: function(e){}
					});
					items.push({
						label:   'Manage saved searches&hellip; (NYI)',
						handler: function(e){}
					});

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




/**
 * Followers/following timeline def 
 */
var FollowersTimeline = function(args) {

	var thisFLT			 = this,
		$timeline		 = $('#timeline-followerslist'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	
	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'get_followerslist_succeeded',
		'failure_event':'get_followerslist_failed',
		'event_target' :document,
		
		'refresh_time':-1, // never automatically
		'max_items':200,

		'request_data': function() {
			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading followers list…');
			Spaz.UI.showLoading();
			sch.markAsRead($timeline.selector + ' div.timeline-entry');

			thisFLT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			Spaz.Data.setAPIUrl(thisFLT.twit);
			thisFLT.twit.getFollowersList();
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('followers_timeline_data_success_start');
			
			// alert('got follower data');
			data = data.reverse();
			
			var i, iMax,
			    no_dupes = [],
			    dataItem;
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {
					
					no_dupes.push(dataItem);
					/*
						Save to DB via JazzRecord
					*/
					Spaz.Tweets.saveUser(dataItem);
				}
				
			}

			$timelineWrapper.children('.loading, .new-user').hide();
			thisFLT.timeline.addItems(no_dupes);

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('followers_timeline_data_success_finish');
			
		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);
			$timelineWrapper.children('.loading').hide();

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('followerslist_row', obj);
		}
	});
	
};

FollowersTimeline.prototype = new AppTimeline();


/**
 * Initialize the timelines 
 */
Spaz.Timelines.init = function() {
	Spaz.Timelines.friends	 = new FriendsTimeline();
	Spaz.Timelines.user		 = new UserTimeline();
	Spaz.Timelines['public'] = new PublicTimeline();
		// `public` is a reserved keyword
	Spaz.Timelines.favorites = new FavoritesTimeline();
	Spaz.Timelines.userlists = new UserlistsTimeline();
	Spaz.Timelines.search	 = new SearchTimeline();
	Spaz.Timelines.followers = new FollowersTimeline();
	
	Spaz.Timelines.map = {
		friends:	Spaz.Timelines.friends,
		user:		Spaz.Timelines.user,
		'public':	Spaz.Timelines['public'],
		userlists:	Spaz.Timelines.userlists,
		favorites:	Spaz.Timelines.favorites,
		search:		Spaz.Timelines.search//,
		// followerslist: Spaz.Timelines.followerslist
	};


};

Spaz.Timelines.getTimelineFromTab = function(tab) {
	var timeline = tab.id.replace(/tab-/, '');
	sch.debug('timeline for tab:' + timeline);
	return Spaz.Timelines.map[timeline];
};

Spaz.Timelines.getTabFromTimeline = function(tab) {
	var timeline = tab.id.replace(/tab-/, '');
	sch.debug('timeline for tab:' + timeline);
	return Spaz.Timelines.map[timeline];
};

Spaz.Timelines.toggleNewUserCTAs = function(){
	var anyAccts = Spaz.AccountPrefs.spaz_acc.getAll().length > 0,
	    $timelines = $(
		'#timelinewrapper-friends, ' +
		'#timelinewrapper-user, ' +
		'#timelinewrapper-favorites, ' +
		'#timelinewrapper-userlists, ' +
		'#timelinewrapper-public, ' +
		'#timelinewrapper-followerslist');
	$timelines.each(function(){
		// Timelines that require user interaction first (e.g., choose a
		// list, enter a search query) should show the intro by default.
		// Otherwise, show the loading indicator by default.

		var $timeline = $(this),
		    $intro = $timeline.children('.intro');
		if(!!$intro[0]){
			$intro.toggle(anyAccts);
		}else{
			$timeline.children('.loading').toggle(anyAccts);
		}
		$timeline.children('.new-user').toggle(!anyAccts);
	});
};

Spaz.Timelines.resetTimelines = function() {
	/*
		remove all timeline event listeners
	*/
	var timelinesMap = Spaz.Timelines.map;

	if (typeof timelinesMap !== 'undefined') {
		for (var key in timelinesMap) {
			if(timelinesMap.hasOwnProperty(key)){
				sch.error(key);
				timelinesMap[key].timeline.stopListening();
			}
		}
	}

	Spaz.Timelines.init();


	/*
		clear timeline entries inside the timelines
	*/
	$('div.timeline-entry').remove();

};

