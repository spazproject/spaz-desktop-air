var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Keyboard
***********/
if (!Spaz.Keyboard) Spaz.Keyboard = {};




Spaz.Keyboard.move = function(dir, selector) {
	
	if (!selector) {
		selector = '';
	}
	
	Spaz.dump("selector is '" + selector+"'")
	
	// var timelineid = 'timeline-friends';
	var timeline = Spaz.Timelines.getTimelineFromTab(Spaz.UI.selectedTab)

	var entry_selector = timeline.getEntrySelector();

	if (!dir) { dir = 'down' }
	
	if (dir == 'down') {
		var movefunc = 'nextAll';
		var wrapselc = 'first';
	} else if (dir == 'up') {
		dir = 'up'
		var movefunc = 'prevAll';
		var wrapselc = 'last';
	} else {
		return false;
	}
	
	// get current selected
	var jqsel = $(entry_selector+'.ui-selected');
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		// sch.dump('first in timeline');
		Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector), timeline)
	} else if (jqsel.length == 0 ) {
		// sch.dump('nothing is selected')
		Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector+':'+wrapselc), timeline)
		jqsel = $(entry_selector+'.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		// sch.dump('we are at the beginning or end');
		if (Spaz.Prefs.get('timeline-keyboardnavwrap')) {
			Spaz.Keyboard.moveSelect($(entry_selector+':visible'+selector+':'+wrapselc), timeline)
			jqsel = $(entry_selector+'.ui-selected'+selector);				
		} else {
			sch.dump('NOT WRAPPING');
		}
	} else {
		// sch.dump('something is now selected');
		Spaz.Keyboard.moveSelect(jqsel[movefunc]('div.timeline-entry:visible'+selector).eq(0), timeline);
	}
	// if selected is at bottom, go to top
}



Spaz.Keyboard.moveSelect = function(jqelement, timeline) {	
	
	Spaz.dump('Moving to new selected item');
	var wrapper_selector = timeline.getWrapperSelector();
	var entry_selector   = timeline.getEntrySelector();
	
	// unselect everything that is selected
	$(entry_selector+'.ui-selected').removeClass('ui-selected');

	if ( (entryId = Spaz.UI.getStatusIdFromElement(jqelement[0])) ) {
		sch.dump('entryId:'+entryId);
		Spaz.DB.markEntryAsRead(entryId);
	}
	
	// select passed
	if (jqelement.length > 0) {
		sch.dump("toggle ui-selected and scrollto");
		Spaz.UI.markEntryAsRead(jqelement);
		
		var viewport_bottom = $(wrapper_selector).innerHeight();		
		var selected_bottom = jqelement.position().top + jqelement.height();
		
		/*
			going down
		*/
		// sch.dump('bottom---')
		// sch.dump(selected_bottom)
		// sch.dump(viewport_bottom)
		if ( selected_bottom > viewport_bottom ) {
			var scroll_offset = ($(wrapper_selector).innerHeight()-jqelement.height())*-1;
			sch.dump('scroll offset:'+scroll_offset);
			$(wrapper_selector).scrollTo(jqelement, {
				offset:scroll_offset,
				speed:1
			});
		}
		
		/*
			going up
		*/
		// sch.dump('top---')
		// sch.dump(jqelement.position().top)
		// sch.dump($('#'+section.wrapper).position().top)
		if ( jqelement.position().top < $(wrapper_selector).position().top ) {
			$(wrapper_selector).scrollTo(jqelement, {
				offset:0,
				speed:1
			});
		}

	} else {
		sch.dump("Problem - jqelement passed length = 0 - can't scroll to anything");
	}
	
	$().trigger('UNREAD_COUNT_CHANGED');
}





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
	// 	Spaz.dump('keyboard Event =================');
	// 	Spaz.dump("keyIdentifier:"+ e.keyIdentifier);
	// 	Spaz.dump("KeyCode:" + e.keyCode);
	// 	Spaz.dump("which:"+ e.which);
	// 	Spaz.dump("type:"+ e.type);
	// 	Spaz.dump("shift:"+ e.shiftKey);
	// 	Spaz.dump("ctrl:"+ e.ctrlKey);
	// 	Spaz.dump("alt:"+ e.altKey);
	// 	Spaz.dump("meta:"+ e.metaKey);
	// 	Spaz.dump("src:"+ e.srcElement.id);
	// }
	// 
	// 
	// return true;
}