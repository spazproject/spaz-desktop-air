var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Keyboard
***********/
if (!Spaz.Keyboard) Spaz.Keyboard = {};




Spaz.Keyboard.move = function(dir, selector) {
	var movefunc,
		wrapselc,
		timeline,
		entry_selector,
		jqall,
		jqsel;
		
	sch.debug(dir);
	sch.debug(selector);
	
	dir      = dir      || 'down';
	selector = selector || '';
	
	sch.debug("selector is '" + selector+"'");
	
	// var timelineid = 'timeline-friends';
	timeline       = Spaz.Timelines.getTimelineFromTab(Spaz.UI.selectedTab);
	if (!timeline) {
		sch.error('no timeline in Spaz.Keyboard.move');
	}
	entry_selector = timeline.getEntrySelector();
	sch.debug("timeline.getTimelineSelector():"+timeline.getTimelineSelector());
	sch.debug("entry_selector:"+entry_selector);
	
	jqall = $(entry_selector).is(':visible');
	
	if (dir == 'down') {
		movefunc = 'nextAll';
		wrapselc = 'first';
	} else if (dir == 'up') {
		dir = 'up';
		movefunc = 'prevAll';
		wrapselc = 'last';
	} else {
		return;
	}
	
	// get current selected
	jqsel = $(entry_selector+'.ui-selected');
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		sch.debug('first in timeline');
		Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector), timeline);
	} else if (jqsel.length == 0 ) {
		sch.debug('nothing is selected');
		Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector+':'+wrapselc), timeline);
		jqsel = $(entry_selector+'.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		sch.debug('we are at the beginning or end');
		if (Spaz.Prefs.get('timeline-keyboardnavwrap')) {
			Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector+':'+wrapselc), timeline);
			jqsel = $(entry_selector+'.ui-selected'+selector);				
		} else {
			sch.debug('NOT WRAPPING');
		}
	} else {
		sch.debug('something is now selected');
		Spaz.Keyboard.moveSelect(jqsel[movefunc]('div.timeline-entry:visible'+selector).eq(0), timeline);
	}
	// if selected is at bottom, go to top
};



Spaz.Keyboard.moveSelect = function(jqelement, timeline) {	
	
	sch.debug('Moving to new selected item');
	sch.debug("jqelement.selector:"+jqelement.selector);
	var wrapper_selector  = timeline.getWrapperSelector();
	var timeline_selector = timeline.getTimelineSelector();
	var entry_selector    = timeline.getEntrySelector();
	sch.debug("timeline.getWrapperSelector():"+timeline.getWrapperSelector());
	sch.debug("timeline.getTimelineSelector():"+timeline.getTimelineSelector());
	sch.debug("timeline.getEntrySelector():"+timeline.getEntrySelector());
		
	var entryId = Spaz.UI.getStatusIdFromElement(jqelement[0]);
	sch.debug("entryId:"+entryId);
	if ( entryId ) {
		sch.debug('entryId:'+entryId);
	}
	
	Spaz.UI.selectEntry(jqelement);
	
	// select passed
	if (jqelement.length > 0) {
		sch.debug("toggle ui-selected and scrollto");
		Spaz.UI.markEntryAsRead(jqelement);
		
		var viewport_bottom = $(wrapper_selector).innerHeight();		
		var selected_bottom = jqelement.position().top + jqelement.height();
		
		/*
			going down
		*/
		sch.debug('bottom--- GOING DOWN');
		sch.debug("selected_bottom:"+selected_bottom);
		sch.debug("viewport_bottom:"+viewport_bottom);
		if ( selected_bottom > viewport_bottom ) {
			var scroll_offset = ($(wrapper_selector).innerHeight()-jqelement.height() - 10 )*-1;
			sch.debug('scroll offset:'+scroll_offset);
			$(wrapper_selector).scrollTo(jqelement, {
				offset:scroll_offset,
				speed:1
			});
		}
		
		/*
			going up
		*/
		sch.debug('top--- GOING UP');
		sch.debug("jqelement.position().top:"+jqelement.position().top);
		sch.debug("$(timeline_selector).position().top:"+$(timeline_selector).position().top);
		if ( jqelement.position().top < $(wrapper_selector).position().top ) {
			$(wrapper_selector).scrollTo(jqelement, {
				offset:0,
				speed:1
			});
		}

	} else {
		sch.debug("Problem - jqelement passed length = 0 - can't scroll to anything");
	}
	
	$(document).trigger('UNREAD_COUNT_CHANGED');
};





/******************************
 * Keyboard 
 ******************************/
Spaz.Keyboard.keyboardHandler = function(event) {
	// e = event || window.event;
	// el = e.srcElement || e.target;
	// 
	// if (el.name) {
	// 	return true;
	// }
	// 
	// 
	// if (e.which == 13 && e.srcElement.id == 'entrybox') {
	// 	Spaz.UI.sendUpdate();
	// 	return false;
	// }
	// 
	// // debugging
	// if (e.srcElement.id == 'home') {
	// 	sch.debug('keyboard Event =================');
	// 	sch.debug("keyIdentifier:"+ e.keyIdentifier);
	// 	sch.debug("KeyCode:" + e.keyCode);
	// 	sch.debug("which:"+ e.which);
	// 	sch.debug("type:"+ e.type);
	// 	sch.debug("shift:"+ e.shiftKey);
	// 	sch.debug("ctrl:"+ e.ctrlKey);
	// 	sch.debug("alt:"+ e.altKey);
	// 	sch.debug("meta:"+ e.metaKey);
	// 	sch.debug("src:"+ e.srcElement.id);
	// }
	// 
	// 
	// return true;
};