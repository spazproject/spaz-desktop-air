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
			sch.error(e.name+":"+e.message);
		}
	}
	
};

AppTimeline.prototype.clear = function() {
	var entry_selector = this.getEntrySelector();
	$(entry_selector).remove();
}


AppTimeline.prototype.markAsRead = function() {
	var entry_selector = this.getEntrySelector();
	/* we use our own "mark as read" here because the helper version just removes the 'new' class' */
	$(entry_selector+':visible').removeClass('new').addClass('read');
	$().trigger('UNREAD_COUNT_CHANGED');
};

AppTimeline.prototype.getEntrySelector = function() {
	return this.timeline.timeline_container_selector+' div.timeline-entry';
}

AppTimeline.prototype.getWrapperSelector = function() {
	return this.timeline.timeline_container_selector.replace('timeline-', 'timelinewrapper-');
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
	this.timeline.refresh();
};

/**
 * Friends timeline def 
 */
var FriendsTimeline = function() {
	
	var thisFT = this;
	this.twit = new SpazTwit();
	this.shurl = new SpazShortURL();
	
	/*
		set up the Friends timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-friends',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_combined_timeline_data',
		'failure_event':'error_combined_timeline_data',
		'event_target' :document,
		
		'refresh_time':Spaz.Prefs.get('network-refreshinterval'),
		'max_items':300,

		'request_data': function() {
			sch.dump('REQUESTING DATA FOR FRIENDS TIMELINE =====================');
			sc.helpers.markAllAsRead('#timeline-friends div.timeline-entry');
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
				if (jQuery('#timeline-friends div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sc.helpers.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
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
			var oldFirst  = jQuery('#timeline-friends div.timeline-entry:first');
			var $timeline = jQuery('#timeline-friends');
			var offset_before = oldFirst.offset().top;
			

			/*
				Add new items
			*/
			thisFT.timeline.addItems(no_dupes);
			// thisFT.sortByAttribute('data-timestamp', 'data-status-id');

			sch.note('notify of new entries!');
			Spaz.UI.notifyOfNewEntries(no_dupes);


			/*
				expand URLs
			*/
			var exp_urls = [];
			for (var i=0; i < no_dupes.length; i++) {
				urls = thisFT.shurl.findExpandableURLs(no_dupes[i].text);
				if (urls) {
					exp_urls = exp_urls.concat(urls);
				}
			};
			
			thisFT.shurl.expandURLs(exp_urls, thisFT.timeline.container);

			/*
				set new scroll position
			*/
			var offset_after = oldFirst.offset().top;
			var offset_diff = Math.abs(offset_before - offset_after);
			if ($timeline.parent().scrollTop() > 0) {
				$timeline.parent().scrollTop( $timeline.parent().scrollTop() + offset_diff );
			}

			/*
			 reapply filtering
			*/
			$('#filter-friends').trigger('keyup');
			
			sc.helpers.updateRelativeTimes('#timeline-friends a.status-created-at', 'data-created-at');
			jQuery('#timeline-friends div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-friends div.timeline-entry:even').addClass('even');
			jQuery('#timeline-friends div.timeline-entry:odd').addClass('odd');
			
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
			sc.helpers.updateRelativeTimes('#timeline-friends a.status-created-at', 'data-created-at');
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
		sch.removeExtraElements('#timeline-friends div.timeline-entry:not(.reply):not(.dm)', Spaz.Prefs.get('timeline-maxentries'));
		sch.removeExtraElements('#timeline-friends div.timeline-entry.reply', Spaz.Prefs.get('timeline-maxentries-reply'));
		sch.removeExtraElements('#timeline-friends div.timeline-entry.dm', Spaz.Prefs.get('timeline-maxentries-dm'));
	};

	
	/*
		handler for URL expansion
	*/
	this.expandURL = function(e) {
		var tl_el = thisFT.timeline.container;
		var data = sch.getEventData(e);
		sch.dump('expanding…');
		sch.dump(data);
		tl_el.innerHTML = thisFT.shurl.replaceExpandableURL(tl_el.innerHTML, data.shorturl, data.longurl);
	}

	/*
		listener for URL expansion
	*/
	sch.listen(this.timeline.container, sc.events.newExpandURLSuccess, this.expandURL);
};

FriendsTimeline.prototype = new AppTimeline();

FriendsTimeline.prototype.reset = function() {
	
}







/**
 * Public timeline def 
 */
var PublicTimeline = function(args) {
	
	var thisPT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-public',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_public_timeline_data',
		'failure_event':'error_public_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-public div.timeline-entry');
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
				if (jQuery('#timeline-public div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sc.helpers.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			thisPT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-public').trigger('keyup');


			sc.helpers.markAllAsRead('#timeline-public div.timeline-entry'); // public are never "new"
			sc.helpers.updateRelativeTimes('#timeline-public a.status-created-at', 'data-created-at');
			jQuery('#timeline-public div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-public div.timeline-entry:even').addClass('even');
			jQuery('#timeline-public div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the public timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-public a.status-created-at', 'data-created-at');
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
	
	var thisFVT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-favorites',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_favorites_timeline_data',
		'failure_event':'error_favorites_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-favorites div.timeline-entry');
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
				if (jQuery('#timeline-favorites div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sc.helpers.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			thisFVT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-favorites').trigger('keyup');


			sc.helpers.markAllAsRead('#timeline-favorites div.timeline-entry'); // favorites are never "new"
			sc.helpers.updateRelativeTimes('#timeline-favorites a.status-created-at', 'data-created-at');
			jQuery('#timeline-favorites div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-favorites div.timeline-entry:even').addClass('even');
			jQuery('#timeline-favorites div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the favorites timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-favorites a.status-created-at', 'data-created-at');
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
	
	var thisUT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-user',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_user_timeline_data',
		'failure_event':'error_user_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-user div.timeline-entry');
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
				if (jQuery('#timeline-user div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sc.helpers.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data[i].text = Emoticons.SimpleSmileys.convertEmoticons(data[i].text)
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			thisUT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-user').trigger('keyup');


			sc.helpers.markAllAsRead('#timeline-user div.timeline-entry'); // user is never "new"
			sc.helpers.updateRelativeTimes('#timeline-user a.status-created-at', 'data-created-at');
			jQuery('#timeline-user div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-user div.timeline-entry:even').addClass('even');
			jQuery('#timeline-user div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-user a.status-created-at', 'data-created-at');
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
	
	var thisUT = this;
	
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
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-userlists',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'get_list_timeline_succeeded',
		'failure_event':'get_list_timeline_failed',
		'event_target' :document,
		
		'refresh_time':1000*60*5, // 30 minutes
		'max_items':300,

		'request_data': function() {

			sc.helpers.markAllAsRead('#timeline-userlists div.timeline-entry');
						
			if (thisUT.list.user && thisUT.list.slug) {
				$('#timeline-userlists-full-name').text("@"+thisUT.list.user+'/'+thisUT.list.slug);
				var username = Spaz.Prefs.getUser();
				var password = Spaz.Prefs.getPass();
				thisUT.twit.setCredentials(username, password);
				thisUT.twit.getListTimeline(thisUT.list.slug, thisUT.list.user);
				Spaz.UI.statusBar("Getting list @"+thisUT.list.user+'/'+thisUT.list.slug + "…");
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
				if (jQuery('#timeline-user div.timeline-entry[data.statuses-status-id='+data.statuses[i].id+']').length<1) {
					
					data.statuses[i].SC_thumbnail_urls = sui.getThumbsForUrls(data.statuses[i].text);
					
					data.statuses[i].text = sc.helpers.makeClickable(data.statuses[i].text, SPAZ_MAKECLICKABLE_OPTS);
					
					// convert emoticons
					data.statuses[i].text = Emoticons.SimpleSmileys.convertEmoticons(data.statuses[i].text)
					
					no_dupes.push(data.statuses[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data.statuses[i]);
				}
				
			};
			
			thisUT.timeline.addItems(no_dupes);
			
			/*
			 reapply filtering
			*/
			$('#filter-userlists').trigger('keyup');
			
			
			sc.helpers.markAllAsRead('#timeline-userlists div.timeline-entry'); // user is never "new"
			sc.helpers.updateRelativeTimes('#timeline-userlists a.status-created-at', 'data-created-at');
			jQuery('#timeline-userlists div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-userlists div.timeline-entry:even').addClass('even');
			jQuery('#timeline-userlists div.timeline-entry:odd').addClass('odd');
			
			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the userlists timeline";
			Spaz.UI.statusBar(err_msg);
			
			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-userlists a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('timeline_entry', obj);
			
		}
	});
	
	
	
	this.buildListsMenu = function() {
		var username = Spaz.Prefs.getUser();
		var password = Spaz.Prefs.getPass();
		thisUT.twit.setCredentials(username, password);
		sch.error("Loading lists for  @"+username+ "…");
		Spaz.UI.statusBar("Loading lists for  @"+username+ "…");
		Spaz.UI.showLoading();
		thisUT.twit.getLists(username, function(data) {
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
						var slug = $(this).attr('data-list-slug');
						var user = $(this).attr('data-user-screen_name');
						thisUT.setlist(slug, user);
					}
				}
			};
		
			
			/*
				create container for menu
			*/
			$(root_container_selector).append('<ul id="'+menu_id+'" class="'+menu_class+'"></ul>');
			
			/*
				add <li> items to menu
			*/
			for (var i=0; i < menu_items.length; i++) {

				var jqitem = $('<li id="'+menu_items[i].id+'" class="menuitem '+menu_item_class+'">'+menu_items[i].label+'</li>');

				for (var key in menu_items[i].attributes) {
					jqitem.attr(key, menu_items[i].attributes[key]);
				};

				$('#'+menu_id).append(jqitem);
				
				/*
					if onclick is defined for this item, bind it to the ID of this element
				*/
				if (menu_items[i].onclick) {
					sch.error(menu_items[i].id);
					sch.error(menu_items[i].onclick);
					
					$('#'+menu_items[i].id).bind('click', {'onClick':menu_items[i].onclick}, function(e) {
						e.data.onClick.call(this, e); // 'this' refers to the clicked element
					});
				}
			};
			
			sch.error($('#'+menu_id).get(0).innerHTML);
			
			/*
				show menu on event
			*/
			$(menu_trigger_selector).live('click', function(e) {
				/*
					thank you http://stackoverflow.com/questions/158070/jquery-how-to-position-one-element-relative-to-another
				*/
				$('#'+menu_id).css('position','absolute');
				var pos = $(this).offset();
				var height = $(this).height();
				var width = $(this).width();
				$('#'+menu_id).css( { "left": (pos.left) + "px", "top":(pos.top + height) + "px" } );
				$('#'+menu_id).show();
				
				$(document).one('click', function() {
					$('#'+menu_id).hide();
				});
			});
			
			Spaz.UI.statusBar("Lists loaded for  @"+username+ "…");
			Spaz.UI.hideLoading();
			
		}, function(msg) {
			Spaz.UI.statusBar("Loading lists for  @"+username+ " failed!");
			Spaz.UI.hideLoading();
			
		});
		
		
	};

	/*
		build the lists menu
	*/
	thisUT.buildListsMenu();
	
};

UserlistsTimeline.prototype = new AppTimeline();




/**
 * Search timeline def 
 */
var SearchTimeline = function(args) {
	
	var thisST = this;
	
	this.query = null;
	this.lastquery = null;
	
	this.twit = new SpazTwit();
	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-search',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_search_timeline_data',
		'failure_event':'error_search_timeline_data',
		
		'event_target' :document,
		
		
		'refresh_time':1000*60*15, // 15 minutes
		'max_items':100,

		'request_data': function() {
			if (jQuery('#search-for').val().length > 0) {
				thisST.query = jQuery('#search-for').val();
				
				if (!thisST.lastquery) {
					thisST.lastquery = thisST.query;
				} else if (thisST.lastquery != thisST.query) {
					jQuery('#timeline-search .timeline-entry').remove();
				};
				
				// alert(thisST.lastquery+"\n"+thisST.query);
				
				// clear the existing results if this is a new query
				sc.helpers.markAllAsRead('#timeline-search div.timeline-entry');
				
				thisST.twit.search(thisST.query);
				thisST.lastquery = thisST.query;
				Spaz.UI.statusBar("Searching for '" + thisST.query + "'…");
				Spaz.UI.showLoading();
			}
		},
		'data_success': function(e, data) {
			sch.dump(e);
			var query_info = data[1];
			data = data[0];
			
			data = data.reverse();
			var no_dupes = [];
			var md = new Showdown.converter();
			
			
			var sui = new SpazImageURL();
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-search div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].SC_thumbnail_urls = sui.getThumbsForUrls(data[i].text);
					
					data[i].text = sc.helpers.makeClickable(data[i].text, SPAZ_MAKECLICKABLE_OPTS);

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
			
			if (no_dupes.length > 0) {
				thisST.timeline.addItems(no_dupes);
			}
			

			sc.helpers.markAllAsRead('#timeline-search div.timeline-entry'); // search are never "new"
			sc.helpers.updateRelativeTimes('#timeline-search a.status-created-at', 'data-created-at');
			jQuery('#timeline-search div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-search div.timeline-entry:even').addClass('even');
			jQuery('#timeline-search div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving your favorites";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-search a.status-created-at', 'data-created-at');
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
	
	var thisFLT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-followerslist',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'get_followerslist_succeeded',
		'failure_event':'get_followerslist_failed',
		'event_target' :document,
		
		'refresh_time':-1, // never automatically
		'max_items':200,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-followerslist div.timeline-entry');
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
				if (jQuery('#timeline-followerslist div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TwUserModel.findOrCreate(data[i]);
				}
				
			};
			
			thisFLT.timeline.addItems(no_dupes);

			jQuery('#timeline-followerslist div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-followerslist div.timeline-entry:even').addClass('even');
			jQuery('#timeline-followerslist div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-followerslist a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			// sch.error(obj);
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
		'userlists':   Spaz.Timelines.user,
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


