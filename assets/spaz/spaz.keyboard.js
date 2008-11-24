var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.Keyboard) Spaz.Keyboard = {};


Spaz.Keyboard.setShortcuts = function() {
	Spaz.dump("Setting Shortcuts=================================================")
    Spaz.dump("os: " + air.Capabilities['os']);
	
	var Modkey = 'Meta';
	
	if (air.Capabilities['os'].search(/Windows/i) != -1) {
		Spaz.dump('THIS IS WINDOWS');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Linux/i) != -1) { // thx agolna
		Spaz.dump('THIS IS LINUX');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Mac/i) != -1) {
		Spaz.dump('THIS IS MACOS');
		Modkey = 'Meta';
	}
	
	Spaz.dump('Modkey is '+Modkey);
	
	shortcut.add(Modkey+'+T', function() {
		$('#entrybox').focus();
	})

	shortcut.add('F5', function() {
		Spaz.UI.reloadCurrentTab(true);
		Spaz.restartReloadTimer();
	})

	shortcut.add('Shift+F5', function() {
		Spaz.UI.clearCurrentTimeline();
		Spaz.UI.reloadCurrentTab(true, true);
		Spaz.restartReloadTimer();
	})
	
	shortcut.add(Modkey+'+Shift+A', function() {
		Spaz.UI.showShortLink();
	});
	
	shortcut.add(Modkey+'+Shift+M', function() {
		Spaz.UI.markCurrentTimelineAsRead();
	});




	shortcut.add('F1', function() {
		Spaz.UI.showHelp();
	});
	
	/*
		Added so we can open the preferences folder if the UI is hosed by bad CSS
	*/
	shortcut.add(Modkey+'+Shift+,', function() {
		Spaz.Sys.openAppStorageFolder();
	});
	
	shortcut.add(Modkey+'+Shift+@', function() {
			Spaz.dump('getting screenname from current selection');
			var screenname = $('div.ui-selected .user-screen-name').text();
			
			if (screenname) {
				Spaz.dump('username for reply is:'+screenname);
				// var username = '';
				Spaz.UI.prepReply(screenname);
			}
		}, {
			'disable_in_input':false
	});
	
	
	
	
	// ****************************************
	// tabs shortcuts
	// ****************************************
	shortcut.add(Modkey+'+1', function() {
		Spaz.UI.showTab(0);
	})
	shortcut.add(Modkey+'+2', function() {
		Spaz.UI.showTab(1);
	})
	shortcut.add(Modkey+'+3', function() {
		Spaz.UI.showTab(2);
	})
	shortcut.add(Modkey+'+4', function() {
		Spaz.UI.showTab(3);
	})
	shortcut.add(Modkey+'+5', function() {
		Spaz.UI.showTab(4);
	})
	shortcut.add(Modkey+'+6', function() {
		Spaz.UI.showTab(5);
	})
	shortcut.add(Modkey+'+7', function() {
		Spaz.UI.showTab(6);
	})
	shortcut.add(Modkey+'+,', function() {
		Spaz.UI.showPrefs()
	})
	
	// ****************************************
	// Keys to navigate timeline
	// ****************************************
	shortcut.add(Modkey+'+down', function() {
		Spaz.Keyboard.move('down', '.reply');
	});
	shortcut.add(Modkey+'+up', function() {
		Spaz.Keyboard.move('up', '.reply');
	});
	shortcut.add(Modkey+'+Shift+down', function() {
		Spaz.Keyboard.move('down', '.dm');
	});
	shortcut.add(Modkey+'+Shift+up', function() {
		Spaz.Keyboard.move('up', '.dm');
	});
	shortcut.add(Modkey+'+End', function() {
		Spaz.Keyboard.move('down', ':last');
	});
	shortcut.add(Modkey+'+Home', function() {
		Spaz.Keyboard.move('up', ':first');
	});	
	shortcut.add('Down', function() {
			Spaz.Keyboard.move('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('Up', function() {
			Spaz.Keyboard.move('up');
		}, {
			'disable_in_input':true
	});
	shortcut.add(Modkey+'+J', function() {
		Spaz.Keyboard.move('down');
	});
	shortcut.add(Modkey+'+K', function() {
		Spaz.Keyboard.move('up');
	});
	shortcut.add('J', function() {
			Spaz.Keyboard.move('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('K', function() {
			Spaz.Keyboard.move('up');
		}, {
			'disable_in_input':true
	});
	
	shortcut.add(Modkey+'+F', function() {
			Spaz.UI.toggleTimelineFilter();
		}, {
			propagate:false
	});
	
	
	/*
		Search box submit on Enter
	*/
	shortcut.add('Enter', function() {
			Spaz.Section.search.build();
		}, {
			target:$('#search-for')[0],
			propagate:false
	});
	
	
	// ****************************************
	// editor shortcuts
	// ****************************************
	shortcut.add(Modkey+'+B', function() {
			Spaz.Editor.bold();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+'+I', function() {
			Spaz.Editor.italics();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+'+R', function() {
			Spaz.Editor.code();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+'+U', function() {
			Spaz.Editor.link();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add('Enter', function() {
			Spaz.UI.sendUpdate();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	
	
	/*
		Username/password prefs -> save
	*/
	shortcut.add('Enter', function() {
			Spaz.Prefs.setPrefs();
		}, {
			target:$('#username')[0],
			propagate:false
	});
	shortcut.add('Enter', function() {
			Spaz.Prefs.setPrefs();
		}, {
			target:$('#password')[0],
			propagate:false
	});

}








Spaz.Keyboard.move = function(dir, selector) {
	
	if (!selector) {
		selector = '';
	}
	
	Spaz.dump("selector is '" + selector+"'")
	
	// var timelineid = 'timeline-friends';
	var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)
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
	// air.trace('selected:'+jqsel.length);
	// air.trace('moving:'+movefunc+'/'+wrapselc+"\n"+'selected:'+jqsel.length);
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		// air.trace('first in timeline');
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector), section)
	} else if (jqsel.length == 0 ) {
		// air.trace('nothing is selected')
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector+':'+wrapselc), section)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		// air.trace('we are at the beginning or end');
		if (Spaz.Prefs.get('timeline-keyboardnavwrap')) {
			Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry:visible'+selector+':'+wrapselc), section)
			jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);				
		} else {
			air.trace('NOT WRAPPING');
		}
	} else {
		// air.trace('something is now selected');
		Spaz.Keyboard.moveSelect(jqsel[movefunc]('div.timeline-entry:visible'+selector).eq(0), section);
	}
	// if selected is at bottom, go to top
}



Spaz.Keyboard.moveSelect = function(jqelement, section) {	
	
	Spaz.dump('Moving to new selected item');
	Spaz.dump('timelineid:'+section.timeline);
	
	// unselect everything
	$('#'+section.timeline+' div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');

	if ( entryId = Spaz.UI.getStatusIdFromElement(jqelement[0]) ) {
		air.trace('entryId:'+entryId);
		Spaz.DB.markEntryAsRead(entryId);
	}
	
	// select passed
	if (jqelement.length > 0) {
		air.trace("toggle ui-selected and scrollto");
		jqelement.toggleClass('ui-selected');
		
		var viewport_bottom = $('#'+section.wrapper).innerHeight();		
		var selected_bottom = jqelement.position().top + jqelement.height();
		
		/*
			going down
		*/
		// air.trace('bottom---')
		// air.trace(selected_bottom)
		// air.trace(viewport_bottom)
		if ( selected_bottom > viewport_bottom ) {
			var scroll_offset = ($('#'+section.wrapper).innerHeight()-jqelement.height())*-1;
			air.trace('scroll offset:'+scroll_offset);
			$('#'+section.wrapper).scrollTo(jqelement, {
				offset:scroll_offset,
				speed:1
			});
		}
		
		/*
			going up
		*/
		// air.trace('top---')
		// air.trace(jqelement.position().top)
		// air.trace($('#'+section.wrapper).position().top)
		if ( jqelement.position().top < $('#'+section.wrapper).position().top ) {
			$('#'+section.wrapper).scrollTo(jqelement, {
				offset:0,
				speed:1
			});
		}
		
		// $('#timeline-tabs-content').scrollTo(jqelement, {
		// 						offset:-25,
		// 						speed:90,
		// 						easing:'swing'
		// 						}
		// );
	} else {
		air.trace("Problem - jqelement passed length = 0 - can't scroll to anything");
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