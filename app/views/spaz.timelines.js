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
		'tpl':'<span class="user-screen-name clickable" title="View profile" user-screen_name="#username#">@#username#</span>' // should contain macro '#username#'
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
var AppTimeline = function(opts) {
	
/*
	opts = sch.defaults({
		
	}, opts);
	
	this.$timeline		  = $(opts.timeline_selector);
	this.$timelineWrapper = this.$timeline.parent();
	this.more_cursor      = -1;
	this.twit             = new SpazTwit();*/

	
};

AppTimeline.prototype.model = {
	'items' : []
};

/**
 * This is just a wrapper to start the SpazTimeline object contained within 
 */
AppTimeline.prototype.activate = function() {
	if (this.timeline) {
		this.timeline.start();
	} else {
		this.refresh();
	}
	
};

AppTimeline.prototype.deactivate = function() {
	
};

/**
 * filter the timeline (hide or show entries) based on a string of terms
 * @param {string} terms 
 */
AppTimeline.prototype.filter = function(terms) {
	var entry_selector = this.getEntrySelector();
	sch.debug(entry_selector);
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
			sch.debug(filter_re.toString());
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
		var is_dm = false;
		if ($(this).hasClass('dm')) {
			is_dm = true;
		} else {
			is_dm = false;
		}
		Spaz.DB.markEntryAsRead(status_id, is_dm);
	});
	$(document).trigger('UNREAD_COUNT_CHANGED');

};

AppTimeline.prototype.getEntrySelector = function() {
	return this.getTimelineSelector()+' div.timeline-entry';
};

AppTimeline.prototype.getWrapperSelector = function() {
	return this.getTimelineSelector().replace('timeline-', 'timelinewrapper-');
};

AppTimeline.prototype.getTimelineSelector = function() {
	if (this.$timeline) { // new and awesome
		return this.$timeline.selector;
	} else { // old and busted
		return this.timeline.timeline_container_selector;
	}
	
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
			// sch.debug(selector);
			$item = jQuery(selector);
			// sch.debug($item.length);
			itemHTML = $item.get(0).outerHTML;
			// sch.debug(itemHTML);
			itemsSorted.push(itemHTML);
		}
	})();
	
	sortedHTML = '<div>'+itemsSorted.join('')+'</div>';
	
	jQuery(this.getTimelineSelector()).html(sortedHTML);
};

AppTimeline.prototype.refresh = function() {
	sch.debug('refreshing timeline');
	this.timeline.refresh();
};

























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
		'friends'   : Spaz.Timelines.friends,
		'user'      : Spaz.Timelines.user,
		'public'    : Spaz.Timelines['public'],
		'userlists' : Spaz.Timelines.userlists,
		'favorites' : Spaz.Timelines.favorites,
		'search'    : Spaz.Timelines.search,
		'followers' : Spaz.Timelines.followers
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
				if (timelinesMap[key].timeline) {
					timelinesMap[key].timeline.stopListening();
				}
			}
		}
	}

	Spaz.Timelines.init();


	/*
		clear timeline entries inside the timelines
	*/
	$('div.timeline-entry').remove();

};

