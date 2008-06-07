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
		Spaz.UI.reloadCurrentTab(true);
		Spaz.restartReloadTimer();
	})
	
	shortcut.add(Modkey+'+Shift+A', function() {
		Spaz.UI.showShortLink();
	})
	
	shortcut.add(Modkey+'+Shift+M', function() {
		Spaz.UI.markCurrentTimelineAsRead();
	})




	shortcut.add('F1', function() {
		Spaz.UI.showHelp();
	})
	
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
			return false;
		}, {
			type:'keypress',
			propagate:false
	});
	
	
	// ****************************************
	// editor shortcuts
	// ****************************************
	shortcut.add(Modkey+'+B', function() {
			Spaz.Editor.bold();
		}, {
			target:$('entrybox')[0],
			type:'keypress',
			propagate:false
	});
	shortcut.add(Modkey+'+I', function() {
			Spaz.Editor.italics();
		}, {
			target:$('entrybox')[0],
			type:'keypress',
			propagate:false
	});
	shortcut.add(Modkey+'+R', function() {
			Spaz.Editor.code();
		}, {
			target:$('entrybox')[0],
			type:'keypress',
			propagate:false
	});
	shortcut.add(Modkey+'+U', function() {
			Spaz.Editor.link();
		}, {
			target:$('entrybox')[0],
			type:'keypress',
			propagate:false
	});
	shortcut.add('Enter', function() {
			Spaz.UI.sendUpdate();
		}, {
			target:$('entrybox')[0],
			type:'keypress',
			propagate:false
	});
}








Spaz.Keyboard.move = function(dir, selector) {
	
	if (!selector) {
		selector = '';
	}
	
	Spaz.dump("selector is '" + selector+"'")
	
	var timelineid = 'timeline-friends';

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
	// alert('selected:'+selected.length);
	//alert('moving:'+movefunc+'/'+wrapselc+"\n"+'selected:'+selected.length + "\n"+'current:'+selected.html());
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		Spaz.dump('first in timeline')
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry'+selector), timelineid)
	} else if (jqsel.length == 0 ) {
		Spaz.dump('nothing is selected')
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry'+selector+':'+wrapselc), timelineid)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		Spaz.dump('we are at the beginning or end')
		Spaz.Keyboard.moveSelect($('#'+timelineid+' div.timeline-entry'+selector+':'+wrapselc), timelineid)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);				
	} else {
		Spaz.dump('something is now selected');
		Spaz.Keyboard.moveSelect(jqsel[movefunc]('div.timeline-entry'+selector).eq(0), timelineid);
	}
	// if selected is at bottom, go to top
}



Spaz.Keyboard.moveSelect = function(jqelement, timelineid) {	
	
	Spaz.dump('Moving to new selected item');
	
	Spaz.dump('jqelement.length:'+jqelement.length);
	
	// unselect everything
	$('#'+timelineid+' div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
	
	// select passed
	if (jqelement.length > 0) {
		jqelement.toggleClass('ui-selected');
		$('#'+timelineid+'').scrollTo(jqelement, {
								offset:-25,
								speed:90,
								easing:'swing'
								}
		);
	} else {
		Spaz.dump("Problem - jqelement passed length = 0 - can't scroll to anything");
	}
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