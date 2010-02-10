var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Timelines) Spaz.Timelines = {};


/**
 * options used for makeClickable calls 
 */
var SPAZ_MAKECLICKABLE_OPTS = {
 	'autolink': {
 		'type'      :'both',
 		'extra_code':'',
 		'maxlen'    :100
 	},
 	'screenname': {
 		'tpl':'<span class="user-screen-name clickable" title="View user\'s profile" user-screen_name="#username#">@#username#</span>' // should contain macro '#username#'
 	},
 	'hashtag': {
 		'tpl':'<span class="hashtag clickable" title="Search for this hashtag" data-hashtag="#hashtag_enc#">##hashtag#</span>' // should contain macros '#hashtag#' and '#hashtag_enc#'
 	}
};

//'';




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
}

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

AppTimeline.prototype.clear = function() {
	var entry_selector = this.getEntrySelector();
	$(entry_selector).remove();
}


AppTimeline.prototype.markAsRead = function() {
	var entry_selector = this.getEntrySelector();
	
	// sch.error('Entry Selector:'+entry_selector);
	
	// sch.error(this.timeline);
	
	/* we use our own "mark as read" here because the helper version just removes the 'new' class' */
	$(entry_selector+':visible').removeClass('new').addClass('read');
	$().trigger('UNREAD_COUNT_CHANGED');
};

AppTimeline.prototype.getEntrySelector = function() {
	return this.getTimelineSelector()+' div.timeline-entry';
}

AppTimeline.prototype.getWrapperSelector = function() {
	return this.getTimelineSelector().replace('timeline-', 'timelinewrapper-');
}

AppTimeline.prototype.getTimelineSelector = function() {
	return this.timeline.timeline_container_selector;
}

AppTimeline.prototype.sortByAttribute = function(sortattr, idattr, sortfunc) {
	
	var items = jQuery( this.getEntrySelector() );
	var itemAttrs   = [];
	var itemsSorted = [];
	var sortedHTML  = '';
	var sortfunc = sortfunc || function(a,b){return b.sortval - a.sortval};
	
	for ( i = 0; i < items.length; i++ ) {
		var jqitem = jQuery(items[i]);
		var attrobj = {
			'id':jqitem.attr(idattr),
			'sortval':jqitem.attr(sortattr)
		};
	    itemAttrs.push(attrobj);
	}

	itemAttrs.sort( sortfunc );
	
	for ( i=0;i<itemAttrs.length;i++ ) {
		attrobj = itemAttrs[i];
		var selector = this.getEntrySelector()+"["+idattr+"=" + attrobj['id'] + "]";
		// sch.error(selector);
		var itemjq = jQuery( selector );
		// sch.error(itemjq.length);
		var itemhtml = itemjq.get(0).outerHTML;
		// sch.error(itemhtml);
	    itemsSorted.push(itemhtml);
	}
	
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
	
	var thisFT           = this,
	    $timeline        = $('#timeline-friends'),
	    $timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	this.shurl = new SpazShortURL();

	/*
		set up the Friends timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_combined_timeline_data',
		'failure_event':'error_combined_timeline_data',
		'event_target' :document,
		
		'refresh_time':Spaz.Prefs.get('network-refreshinterval'),
		'max_items':300,

		'request_data': function() {
			sch.dump('REQUESTING DATA FOR FRIENDS TIMELINE =====================');
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisFT.twit.setCredentials(username, password);
			thisFT.twit.getCombinedTimeline();
			Spaz.UI.statusBar("Loading friends timeline");
			Spaz.UI.showLoading();
			
			sch.dump('REQUEST_DATA');
		},
		'data_success': function(e, data) {
			
			sch.dump('DATA_SUCCESS');
			
			data = data.reverse();
			var no_dupes = [];

			sch.dump(data);
			
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				sch.dump(i);
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					// nl2br
					data[i].text = sch.nl2br(data[i].text);
					
					// add thumbnails
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					// make clickable
					data[i].text = sch.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
					
				}
				
			};
			

			/*
				Record old scroll position
			*/
			var $oldFirst     = $timeline.find('div.timeline-entry:first'),
			    offset_before = $oldFirst.offset().top;

			/*
				Add new items
			*/
			$timelineWrapper.children('.loading').hide();
			
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
				var old_first_time = parseInt($oldFirst.attr('data-timestamp'));
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
			// 	urls = thisFT.shurl.findExpandableURLs(no_dupes[i].text);
			// 	if (urls) {
			// 		exp_urls = exp_urls.concat(urls);
			// 	}
			// };
			// 
			// thisFT.shurl.expandURLs(exp_urls, thisFT.timeline.container);

			$('div.timeline-entry.new div.status-text', thisFT.timeline.container).each(function(i) {
				urls = thisFT.shurl.findExpandableURLs(this.innerHTML);
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
			var offset_after = $oldFirst.offset().top;
			var offset_diff = Math.abs(offset_before - offset_after);
			if ($timelineWrapper.scrollTop() > 0) {
				$timelineWrapper.scrollTop( $timelineWrapper.scrollTop() + offset_diff );
			}

			/*
			 reapply filtering
			*/
			$('#filter-friends').trigger('keyup');
			
			sch.updateRelativeTimes($timeline.selector + ' .status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');
			
			/*
				get new set of usernames
			*/
			Spaz.Autocomplete.initSuggestions();
			
			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			

		},
		'data_failure': function(e, error_obj) {
			sch.dump('DATA_FAILURE');
			var err_msg = "There was an error retrieving your timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			if (obj.SC_is_dm) {
				return Spaz.Tpl.parse('timeline_entry_dm', obj);
			} else {
				return Spaz.Tpl.parse('timeline_entry', obj);
			}
			
			
		}
	});
	
	/*
		override the default method
	*/
	this.timeline.removeExtraItems = function() {
		sch.removeExtraElements($timeline.selector + ' div.timeline-entry:not(.reply):not(.dm)', Spaz.Prefs.get('timeline-maxentries'));
		sch.removeExtraElements($timeline.selector + ' div.timeline-entry.reply', Spaz.Prefs.get('timeline-maxentries-reply'));
		sch.removeExtraElements($timeline.selector + ' div.timeline-entry.dm', Spaz.Prefs.get('timeline-maxentries-dm'));
	};

	
	/*
		handler for URL expansion
	*/
	this.expandURL = function(e) {
		
		var el = e.target
		var data = sch.getEventData(e);

		sch.unlisten(el, sc.events.newExpandURLSuccess, thisFT.expandURL);

		sch.debug('expanding…');
		sch.debug(data);
		el.innerHTML = thisFT.shurl.replaceExpandableURL(el.innerHTML, data.shorturl, data.longurl);
	}

	/*
		listener for URL expansion
	*/
	sch.listen(this.timeline.container, sc.events.newExpandURLSuccess, this.expandURL);
};

FriendsTimeline.prototype = new AppTimeline();

FriendsTimeline.prototype.reset = function() {sch.debug
	
}







/**
 * Public timeline def 
 */
var PublicTimeline = function(args) {
	
	var thisPT           = this,
	    $timeline        = $('#timeline-public'),
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
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
			thisPT.twit.getPublicTimeline();
			Spaz.UI.statusBar("Loading public timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			data = data.reverse();
			var no_dupes = [];
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					// nl2br
					data[i].text = sch.nl2br(data[i].text);
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sch.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};

			$timelineWrapper.children('.loading').hide();
			thisPT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-public').trigger('keyup');

			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // public are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the public timeline";
			Spaz.UI.statusBar(err_msg);

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
	
	var thisFVT          = this,
	    $timeline        = $('#timeline-favorites'),
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
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisFVT.twit.setCredentials(username, password);
			thisFVT.twit.getFavorites();
			Spaz.UI.statusBar("Loading favorites timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			data = data.reverse();
			var no_dupes = [];
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					// nl2br
					data[i].text = sch.nl2br(data[i].text);
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sch.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};

			$timelineWrapper.children('.loading').hide();
			thisFVT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-favorites').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // favorites are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the favorites timeline";
			Spaz.UI.statusBar(err_msg);

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
	
	var thisUT           = this,
	    $timeline        = $('#timeline-user'),
	    $timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	
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
		'max_items':100,

		'request_data': function() {
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisUT.twit.setCredentials(username, password);
			thisUT.twit.getUserTimeline(username);
			Spaz.UI.statusBar("Loading user timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			data = data.reverse();
			var no_dupes = [];
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					// nl2br
					data[i].text = sch.nl2br(data[i].text);
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sch.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};

			$timelineWrapper.children('.loading').hide();
			thisUT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-user').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // user is never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

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
		
	var thisULT           = this,
	    $timeline        = $('#timeline-userlists'),
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

			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
						
			if (thisULT.list.user && thisULT.list.slug) {
				// Give UI feedback immediately
				$('#timeline-userlists-full-name').text("@"+thisULT.list.user+'/'+thisULT.list.slug);
				if($timeline.is(':empty')){
					$timelineWrapper.children('.loading').show();
				}
				$timelineWrapper.children('.intro').hide();

				var username = Spaz.Prefs.getUser(),
				    password = Spaz.Prefs.getPass();
				thisULT.twit.setCredentials(username, password);
				thisULT.twit.getListTimeline(thisULT.list.slug, thisULT.list.user);
				Spaz.UI.statusBar("Getting list @"+thisULT.list.user+'/'+thisULT.list.slug + "…");
				Spaz.UI.showLoading();
			}
			
			
		},
		'data_success': function(e, data) {
			
			sch.debug('statuses:'+data.statuses);
			sch.debug('user:'+data.user);
			sch.debug('slug:'+data.slug);
			
			// data.statuses = data.statuses.reverse();
			var no_dupes = [];
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.statuses.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data.statuses[i].id+']').length<1) {
					
					sch.debug('div.timeline-entry[data-status-id='+data.statuses[i].id+'] does not exist… adding');
					
					// nl2br
					data.statuses[i].text = sch.nl2br(data.statuses[i].text);
					
					data.statuses[i].SC_thumbnail_urls = sui.getThumbsForUrls(data.statuses[i].text);
					
					data.statuses[i].text = sch.makeClickable(data.statuses[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data.statuses[i].text = Emoticons.SimpleSmileys.convertEmoticons(data.statuses[i].text)
					
					no_dupes.push(data.statuses[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data.statuses[i]);
				} else {
					sch.debug(data.statuses[i].id+' already exists');
				}
				
			};

			$timelineWrapper.children('.loading, .intro').hide();
			thisULT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-userlists').trigger('keyup');
			
			
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // user is never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');
			
			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the userlists timeline";
			Spaz.UI.statusBar(err_msg);
			
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
		var username = Spaz.Prefs.getUser();
		var password = Spaz.Prefs.getPass();
		thisULT.twit.setCredentials(username, password);
		sch.debug("Loading lists for @"+username+ "…");
		Spaz.UI.statusBar("Loading lists for @"+username+ "…");
		Spaz.UI.showLoading();
		thisULT.twit.getLists(username, function(data) {
			/*
				build a new menu
			*/
			var root_container_selector = '#container';
			var menu_id = 'lists-menu';
			var menu_class = 'popup-menu';
			var menu_items = [];
			var menu_item_class = 'userlists-menu-item';
			var menu_trigger_selector = '#view-userlists';
			
			// var menu_container_id  = menu_id + '-container';
			
			for (var i=0; i < data.lists.length; i++) {
				var thislist = data.lists[i];
				menu_items[i] = {
					'label':thislist.full_name,
					'id':'userlist-'+thislist.user.screen_name+'-'+thislist.slug, // this should be unique!
					'attributes':{
						'data-list-id':thislist.id,
						'data-list-name':thislist.name,
						'data-list-slug':thislist.slug,
						'data-user-screen_name':thislist.user.screen_name,
						'title':thislist.description
					},
					'onclick':function(e) {
						var $this = $(this),
						    slug  = $this.attr('data-list-slug'),
						    user  = $this.attr('data-user-screen_name');
						thisULT.setlist(slug, user);
					}
				}
			};
		
			
			/*
				create container for menu
			*/
			$(root_container_selector).append('<ul id="'+menu_id+'" class="'+menu_class+'"></ul>');
			var $menu = $('#' + menu_id);
			
			/*
				add <li> items to menu
			*/
			for (var i=0; i < menu_items.length; i++) {

				var jqitem = $('<li id="'+menu_items[i].id+'" class="menuitem '+menu_item_class+'">'+menu_items[i].label+'</li>');

				for (var key in menu_items[i].attributes) {
					jqitem.attr(key, menu_items[i].attributes[key]);
				};

				$menu.append(jqitem);
				
				/*
					if onclick is defined for this item, bind it to the ID of this element
				*/
				if (menu_items[i].onclick) {
					sch.debug(menu_items[i].id);
					sch.debug(menu_items[i].onclick);
					
					$('#'+menu_items[i].id).bind('click', {'onClick':menu_items[i].onclick}, function(e) {
						e.data.onClick.call(this, e); // 'this' refers to the clicked element
					});
				}
			};
			
			sch.debug($menu.get(0).innerHTML);
			
			/*
				show menu on event
			*/
			$(menu_trigger_selector).live('click', function(e) {
				/*
					thank you http://stackoverflow.com/questions/158070/jquery-how-to-position-one-element-relative-to-another
				*/
				var $this		= $(this),
						pos 		= $this.offset(),
						height	= $this.height(),
						width		= $this.width();
				$menu.css({
					position: 'absolute',
					left:     pos.left + 'px',
					top:      (pos.top + height) + 'px'
				}).show();
				
				$(document).one('click', function() {
					$menu.hide();
				});
			});
			
			Spaz.UI.statusBar("Lists loaded for @"+username+ "…");
			Spaz.UI.hideLoading();
			
		}, function(msg) {
			Spaz.UI.statusBar("Loading lists for @"+username+ " failed!");
			Spaz.UI.hideLoading();
			
		});
		
		
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
	
	var thisST           = this,
	    $timeline        = $('#timeline-search'),
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
		'max_items':100,

		'request_data': function() {
			var $searchInput = jQuery('#search-for');
			if ($searchInput.val().length > 0) {
				thisST.query = $searchInput.val();

				// Give UI feedback immediately
				Spaz.UI.statusBar("Searching for '" + thisST.query + "'…");
				Spaz.UI.showLoading();
				if($timeline.is(':empty')){
					$timelineWrapper.children('.loading').show();
				}
				$timelineWrapper.children('.intro, .empty').hide();

				if (!thisST.lastquery) {
					thisST.lastquery = thisST.query;
				} else if (thisST.lastquery != thisST.query) {
					$timeline.find('.timeline-entry').remove();
				};
				
				// alert(thisST.lastquery+"\n"+thisST.query);
				
				// clear the existing results if this is a new query
				sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
				
				thisST.twit.search(thisST.query);
				thisST.lastquery = thisST.query;
			}
		},
		'data_success': function(e, data) {
			sch.dump(e);
			var query_info = data[1];
			data = data[0] || [];
			
			data = data.reverse();
			var no_dupes = [];
			var md = new Showdown.converter();
			
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					// nl2br
					data[i].text = sch.nl2br(data[i].text);
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sch.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);

					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)

					// if (Spaz.Prefs.get('usemarkdown')) {
					// 	data[i].text = md.makeHtml(data[i].text);
					// 	data[i].text = data[i].text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
					// }
					
					no_dupes.push(data[i]);
					
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			$timelineWrapper.children('.loading, .intro').hide();
			$timelineWrapper.children('.empty').toggle(no_dupes.length == 0);
			if (no_dupes.length > 0) {
				thisST.timeline.addItems(no_dupes);
			}

			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // search are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving your favorites";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			
			var html = Spaz.Tpl.parse('timeline_entry', obj);
			return html;
			
		}
	});
};

SearchTimeline.prototype = new AppTimeline();




/**
 * Followers/following timeline def 
 */
var FollowersTimeline = function(args) {
	
	var thisFLT          = this,
	    $timeline        = $('#timeline-followerslist'),
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
			sch.markAllAsRead($timeline.selector + ' div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisFLT.twit.setCredentials(username, password);
			thisFLT.twit.getFollowersList();
			Spaz.UI.statusBar("Loading followerslist");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			// alert('got follower data');
			data = data.reverse();
			
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TwUserModel.findOrCreate(data[i]);
				}
				
			};

			$timelineWrapper.children('.loading').hide();
			thisFLT.timeline.addItems(no_dupes);

			$timeline.find('div.timeline-entry').removeClass('even').removeClass('odd');
			$timeline.find('div.timeline-entry:even').addClass('even');
			$timeline.find('div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

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
	Spaz.Timelines.friends   = new FriendsTimeline();
	Spaz.Timelines.user      = new UserTimeline();
	Spaz.Timelines.public    = new PublicTimeline();
	Spaz.Timelines.favorites    = new FavoritesTimeline();
	Spaz.Timelines.userlists    = new UserlistsTimeline();
	Spaz.Timelines.search    = new SearchTimeline();
	Spaz.Timelines.followers = new FollowersTimeline();
	
	Spaz.Timelines.map = {
		'friends':Spaz.Timelines.friends,
		'user':   Spaz.Timelines.user,
		'public': Spaz.Timelines.public,
		'userlists':   Spaz.Timelines.userlists,
		'favorites':   Spaz.Timelines.favorites,
		'search': Spaz.Timelines.search,
		'followerslist':Spaz.Timelines.followerslist
	}


}

Spaz.Timelines.getTimelineFromTab = function(tab) {
	var timeline = tab.id.replace(/tab-/, '');
	Spaz.dump('timeline for tab:' + timeline);
	return Spaz.Timelines.map[timeline];
};

Spaz.Timelines.getTabFromTimeline = function(tab) {
	var timeline = tab.id.replace(/tab-/, '');
	Spaz.dump('timeline for tab:' + timeline);
	return Spaz.Timelines.map[timeline];
};


