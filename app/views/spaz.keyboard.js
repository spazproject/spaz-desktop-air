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
	var section = Spaz.Timelines.getTimelineFromTab(Spaz.UI.selectedTab)
	var timelineid = section.timeline;

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
	var jqsel = $('#'+timelineid+' div.ui-selected');
	// sch.dump('selected:'+jqsel.length);
	// sch.dump('moving:'+movefunc+'/'+wrapselc+"\n"+'selected:'+jqsel.length);
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		// sch.dump('first in timeline');
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector), section)
	} else if (jqsel.length == 0 ) {
		// sch.dump('nothing is selected')
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector+':'+wrapselc), section)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		// sch.dump('we are at the beginning or end');
		if (Spaz.Prefs.get('timeline-keyboardnavwrap')) {
			Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector+':'+wrapselc), section)
			jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);				
		} else {
			sch.dump('NOT WRAPPING');
		}
	} else {
		// sch.dump('something is now selected');
		Spaz.Keyboard.moveSelect(jqsel[movefunc]('div.timeline-entry:visible'+selector).eq(0), section);
	}
	// if selected is at bottom, go to top
}



Spaz.Keyboard.moveSelect = function(jqelement, section) {	
	
	Spaz.dump('Moving to new selected item');
	Spaz.dump('timelineid:'+section.timeline);
	
	// unselect everything that is selected
	$('#'+section.timeline+' div.timeline-entry.ui-selected').removeClass('ui-selected');

	if ( entryId = Spaz.UI.getStatusIdFromElement(jqelement[0]) ) {
		sch.dump('entryId:'+entryId);
		Spaz.DB.markEntryAsRead(entryId);
	}
	
	// select passed
	if (jqelement.length > 0) {
		sch.dump("toggle ui-selected and scrollto");
		jqelement.toggleClass('ui-selected').addClass('read');
		
		var viewport_bottom = $('#'+section.wrapper).innerHeight();		
		var selected_bottom = jqelement.position().top + jqelement.height();
		
		/*
			going down
		*/
		// sch.dump('bottom---')
		// sch.dump(selected_bottom)
		// sch.dump(viewport_bottom)
		if ( selected_bottom > viewport_bottom ) {
			var scroll_offset = ($('#'+section.wrapper).innerHeight()-jqelement.height())*-1;
			sch.dump('scroll offset:'+scroll_offset);
			$('#'+section.wrapper).scrollTo(jqelement, {
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
		if ( jqelement.position().top < $('#'+section.wrapper).position().top ) {
			$('#'+section.wrapper).scrollTo(jqelement, {
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
	e = event || window.event;
	el = e.srcElement || e.target;
	
	if (el.name) {
		return true;
	}


	if (e.which == 13 && e.srcElement.id == 'entrybox') {
		Spaz.UI.sendUpdate();
		return false;
	}

	// debugging
	if (e.srcElement.id == 'home') {
		Spaz.dump('keyboard Event =================');
		Spaz.dump("keyIdentifier:"+ e.keyIdentifier);
		Spaz.dump("KeyCode:" + e.keyCode);
		Spaz.dump("which:"+ e.which);
		Spaz.dump("type:"+ e.type);
		Spaz.dump("shift:"+ e.shiftKey);
		Spaz.dump("ctrl:"+ e.ctrlKey);
		Spaz.dump("alt:"+ e.altKey);
		Spaz.dump("meta:"+ e.metaKey);
		Spaz.dump("src:"+ e.srcElement.id);
	}


	return true;
}