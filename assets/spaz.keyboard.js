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
	} else if (air.Capabilities['os'].search(/Mac/i) != -1) {
		Spaz.dump('THIS IS MACOS');
		Modkey = 'Meta';
	}
	
	Spaz.dump('Modkey is '+Modkey);
	
	shortcut.add(Modkey+'+T', function() {
		$('#entrybox').focus();
	})

	shortcut.add('F5', function() {
		Spaz.UI.reloadCurrentTab();
		Spaz.restartReloadTimer();
	})

	shortcut.add('Shift+F5', function() {
		Spaz.UI.clearCurrentTimeline();
		Spaz.UI.reloadCurrentTab();
		Spaz.restartReloadTimer();
	})
	
	shortcut.add(Modkey+'+Shift+A', function() {
		Spaz.UI.showShortLink();
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
		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[0]);
		Spaz.UI.tabbedPanels.showPanel(0);
	})
	shortcut.add(Modkey+'+2', function() {
		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[1]);
		Spaz.UI.tabbedPanels.showPanel(1);
	})
	shortcut.add(Modkey+'+3', function() {
		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[2]);
		Spaz.UI.tabbedPanels.showPanel(2);
	})
	shortcut.add(Modkey+'+4', function() {
		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[3]);
		Spaz.UI.tabbedPanels.showPanel(3);
	})
	shortcut.add(Modkey+'+,', function() {
		Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.prefs.tab));
		Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
	})
	
	// ****************************************
	// Keys to navigate timeline
	// ****************************************
	shortcut.add(Modkey+'+down', function() {
		Spaz.Handlers.keyboardMove('down', '.reply');
	});
	shortcut.add(Modkey+'+up', function() {
		Spaz.Handlers.keyboardMove('up', '.reply');
	});
	shortcut.add(Modkey+'+Shift+down', function() {
		Spaz.Handlers.keyboardMove('down', '.dm');
	});
	shortcut.add(Modkey+'+Shift+up', function() {
		Spaz.Handlers.keyboardMove('up', '.dm');
	});
	shortcut.add(Modkey+'+End', function() {
		Spaz.Handlers.keyboardMove('down', ':last');
	});
	shortcut.add(Modkey+'+Home', function() {
		Spaz.Handlers.keyboardMove('up', ':first');
	});	
	shortcut.add('Down', function() {
			Spaz.Handlers.keyboardMove('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('Up', function() {
			Spaz.Handlers.keyboardMove('up');
		}, {
			'disable_in_input':true
	});
	shortcut.add(Modkey+'+J', function() {
		Spaz.Handlers.keyboardMove('down');
	});
	shortcut.add(Modkey+'+K', function() {
		Spaz.Handlers.keyboardMove('up');
	});
	shortcut.add('J', function() {
			Spaz.Handlers.keyboardMove('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('K', function() {
			Spaz.Handlers.keyboardMove('up');
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
}