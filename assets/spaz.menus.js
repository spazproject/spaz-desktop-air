var Spaz; if (!Spaz) Spaz = {};
if (!Spaz.Menus) Spaz.Menus = {};


// Spaz.Menus.methods = new object{
// 	'Preferences…':			Spaz.Menu.menus.prefs,
// 	'Reload current timeline': 	Spaz.Menu.menus.reload, 
// }



Spaz.Menus.initAll = function() {
	//For application menu (on MAC OS X)
	// Spaz.dump('Init Native Menus');
	// if(air.NativeApplication.supportsMenu){
	// 	Spaz.dump('Native Menus for OS X');
	// 	air.NativeApplication.nativeApplication.menu = Spaz.Menus.createRootMenu('OSX');
	// } else {
	// 	Spaz.dump('Native Menus in Windows not supported');
	// 	// Spaz.dump('Creating Windows root menu');
	// 	// window.nativeWindow.menu = Spaz.Menus.createRootMenu();
	// }
	
	// if( air.NativeWindow.supportsMenu && (window.nativeWindow.systemChrome != air.NativeWindowSystemChrome.NONE) ) {
	// 	window.nativeWindow.menu = new air.NativeMenu();
	// 	window.nativeWindow.menu.addEventListener(air.Event.SELECT, selectCommandMenu);
	// 	fileMenu = window.nativeWindow.menu.addItem(new air.NativeMenuItem("File"));
	// 	fileMenu.submenu = Spaz.Menus.createFileMenu();
	// 
	// 	editMenu = window.nativeWindow.menu.addItem(new air.NativeMenuItem("Edit"));
	// 	editMenu.submenu = Spaz.Menus.createEditMenu();
	// }
	
	// dock/systray icon menus
	if(air.NativeApplication.supportsDockIcon){ // dock on OS X
		Spaz.dump('Dock Menus for OS X');
		var iconLoader = new air.Loader();
        iconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
                                                Spaz.Menus.iconLoadComplete);
        iconLoader.load(new air.URLRequest("images/spaz-icon-alpha.png"));
        air.NativeApplication.nativeApplication.icon.menu = Spaz.Menus.createRootMenu();


    } else if(air.NativeApplication.supportsSystemTrayIcon) { // system tray on windows
		Spaz.dump('Making Windows system tray menu')
	    air.NativeApplication.nativeApplication.icon.tooltip = "Spaz loves you";
	    air.NativeApplication.nativeApplication.icon.menu = Spaz.Menus.createRootMenu();
	    var systrayIconLoader = new runtime.flash.display.Loader();
	    systrayIconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
	                                                            Spaz.Menus.iconLoadComplete);
	    systrayIconLoader.load(new air.URLRequest("images/spaz-icon-alpha_16.png"));
	    air.NativeApplication.nativeApplication.icon.addEventListener('click', Spaz.Menus.onSystrayClick);
	}
	
	Spaz.dump('Create Native context Menus');
	Spaz.Menus.contextMenu = Spaz.Menus.createRootMenu();
};


Spaz.Menus.onSystrayClick = function(event) {
	// TODO replace this with call to Spaz.Windows.windowRestore()
	Spaz.dump('clicked on systray');
	Spaz.dump(nativeWindow.displayState);
	Spaz.dump('id:'+air.NativeApplication.nativeApplication.id);
	
	if (nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
		Spaz.dump('restoring window');
 		nativeWindow.restore();
 	}
 	Spaz.dump('activating application');
 	air.NativeApplication.nativeApplication.activate() // bug fix by Mako
	Spaz.dump('activating window');
	nativeWindow.activate();
	Spaz.dump('ordering-to-front window');
	nativeWindow.orderToFront();
}

// completes the loading of the systray icon
Spaz.Menus.iconLoadComplete = function(event) {
	air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
}

Spaz.Menus.displayContextMenu = function(event) {
	Spaz.dump('showing context menu');
	Spaz.Menus.contextMenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
};


//Reports the chosen menu command
Spaz.Menus.itemSelected = function(event){
	Spaz.dump("Selected item: " + event.target.label);
	Spaz.dump('event.target.name:' + event.target.name);
	
	if (event.target.name == "exit") {
		Spaz.dump('Calling Spaz.Prefs.windowClosingHandler');
		Spaz.Prefs.windowClosingHandler();
	}
	
	
	else if (event.target.name == "reload") {
		Spaz.dump('Calling Spaz.Menu.menuReload');
		Spaz.Menu.menuReload();
	}

	else if (event.target.name == "clear") {
		Spaz.dump('Calling Spaz.Menu.menuClearTimeline');
		Spaz.Menu.menuClearTimeline();
	}

	else if (event.target.name == "prefs") {
		Spaz.dump('Calling Spaz.Menu.menuPrefs');
		Spaz.Menu.menuPrefs();
	}
	
	else if (event.target.name == "about") {
		Spaz.dump('Calling Spaz.Menu.menuAbout');
		Spaz.Menu.menuAbout();
	}
	
	else if (event.target.name == "feedback") {
		Spaz.dump('Calling Spaz.Menu.menuFeedback');
		Spaz.Menu.menuFeedback('spaz');
	}
	else if (event.target.name == "check") {
		Spaz.dump('Calling Spaz.Update.updater.checkForUpdate');
		Spaz.Update.updater.checkForUpdate();
	}
	else if (event.target.name == "help") {
		Spaz.dump('Calling Spaz.Menu.menuHelp');
		Spaz.Menu.menuHelp();
	}
	
  	else {
		Spaz.dump('No matching call for this menu item');
	}
	
	
	
}

Spaz.Menus.createContextMenu = function() {
	
}


//Creates a root-level
Spaz.Menus.createRootMenu = function(type){
	if (type == 'OSX'){
		var menu = air.NativeApplication.nativeApplication.menu;
		menu.addSubmenuAt(Spaz.Menus.createFileMenu(),1,"File");
		menu.addSubmenu(Spaz.Menus.createViewMenu(),"View");
		menu.addSubmenu(Spaz.Menus.createHelpMenu(),"Help");
		
		
		var titleMenu = menu.getItemAt(0).submenu;
		var viewMenu  = menu.getItemAt(3).submenu;
		var helpMenu  = menu.getItemAt(4).submenu;

		for(var i = 0; i < titleMenu.items.length; i++){
			item = titleMenu.items[i];
			Spaz.dump(i+":"+item.label);
		}
		for(var i = 0; i < viewMenu.items.length; i++){
			item = viewMenu.items[i];
			Spaz.dump(i+":"+item.label);
		}
		for(var i = 0; i < helpMenu.items.length; i++){
			item = helpMenu.items[i];
			Spaz.dump(i+":"+item.label);
		}
		
		// remove existing item from menu 0, position 0 (generated "About" item)		
		var genAboutItem = titleMenu.removeItemAt(0);

		// remove existing item from menu 3, position 6 (generated "About" item)
		var aboutItem = helpMenu.removeItemAt(5);
		helpMenu.removeItemAt(4); // remove extra separator
		// helpMenu.removeItemAt(1); // remove extra separator
		var prefsItem = viewMenu.removeItemAt(2);
		
		menu.removeItemAt(1);
		
		titleMenu.addItemAt(aboutItem, 0);
		titleMenu.addItemAt(new air.NativeMenuItem("",true),1);//separator
		titleMenu.addItemAt(prefsItem, 2);
		
	} else {
		Spaz.dump('creating new menu for Windows')
		var menu = new air.NativeMenu();
		menu.addSubmenu(Spaz.Menus.createFileMenu(),"File");
		menu.addSubmenu(Spaz.Menus.createEditMenu(),"Edit");
		menu.addSubmenu(Spaz.Menus.createViewMenu(),"View");
		menu.addSubmenu(Spaz.Menus.createHelpMenu(),"Help");
	}
		
	return menu;
}

//Creates the file menu
Spaz.Menus.createFileMenu = function(){
	var menu = new air.NativeMenu();
	
	var miExit = new air.NativeMenuItem("Quit Spaz");
	miExit.name = 'exit';
	// miExit.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
	miExit.mnemonicIndex = 0;
	// miExit.keyEquivalent = 'q';
	menu.addItem(miExit);
	
	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		Spaz.dump('adding listener to '+item.name)
		item.addEventListener(air.Event.SELECT,function(event) {
			Spaz.Menus.itemSelected(event);
		});
	}		
	return menu;
}

//Creates the edit menu
Spaz.Menus.createEditMenu = function(){
	var menu = new air.NativeMenu();
	menu.addItem(new air.NativeMenuItem("Undo"));
	menu.addItem(new air.NativeMenuItem("",true));//separator
	menu.addItem(new air.NativeMenuItem("Cut"));
	menu.addItem(new air.NativeMenuItem("Copy"));
	menu.addItem(new air.NativeMenuItem("Paste"));
	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		Spaz.dump('adding listener to '+item.name)
		item.addEventListener(air.Event.SELECT,function(event) {
			Spaz.Menus.itemSelected(event);
		});
	}		
	return menu;
	
}

Spaz.Menus.createViewMenu = function(){
	
	// 17 = CONTROL
	// 16 = SHIFT
	// 15 = CMD
	
	var miReload = new air.NativeMenuItem("Reload current timeline");
	miReload.name = 'reload';
	if (air.NativeWindow.supportsMenu) {
		Spaz.dump('adding runtime.flash.ui.Keyboard.CONTROL modifier');
		// miReload.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.CONTROL);
	}
	miReload.mnemonicIndex = 0;
	// miReload.keyEquivalent = 'r';

	var miClear = new air.NativeMenuItem("Clear current timeline");
	miClear.name = 'clear';
	if (air.NativeWindow.supportsMenu) {
		Spaz.dump('adding runtime.flash.ui.Keyboard.CONTROL modifier');
		// miClear.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.CONTROL);
	}
	miClear.mnemonicIndex = 0;
	// miClear.keyEquivalent = 'l';
	
	var miPrefs = new air.NativeMenuItem("Preferences…");
	miPrefs.name = 'prefs';
	if (air.NativeWindow.supportsMenu) {
		Spaz.dump('adding runtime.flash.ui.Keyboard.CONTROL modifier');
		// miPrefs.keyEquivalentModifiers = new Array(air.Keyboard.CONTROL);
	}
	// miPrefs.keyEquivalentModifiers = new Array(air.Keyboard.COMMAND);
	miPrefs.mnemonicIndex = 0;
	// miPrefs.keyEquivalent = ',';

	
	var menu = new air.NativeMenu();
	menu.addItem(miReload);
	menu.addItem(miClear);
	menu.addItem(miPrefs);
	
	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		Spaz.dump('adding listener to '+item.name)
		item.addEventListener(air.Event.SELECT,function(event) {
			Spaz.Menus.itemSelected(event);
		});
	}
	return menu;
}

//Creates the help menu
Spaz.Menus.createHelpMenu = function(){
	var menu = new air.NativeMenu();
	var miHelp = new air.NativeMenuItem("Spaz Help");
	miHelp.name = 'help';
	// miHelp.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
	miHelp.mnemonicIndex = 0;
	miHelp.keyEquivalent = '?';
	menu.addItem(miHelp);
	
	menu.addItem(new air.NativeMenuItem("",true));//separator

	var miCheck = new air.NativeMenuItem("Check for updates");
	miCheck.name = 'check';
	menu.addItem(miCheck);

	var miFeedback = new air.NativeMenuItem("Provide feedback");
	miFeedback.name = 'feedback';
	menu.addItem(miFeedback);

	menu.addItem(new air.NativeMenuItem("",true));//separator

	var miAbout = new air.NativeMenuItem("About Spaz");
	miAbout.name = 'about';
	menu.addItem(miAbout);

	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		Spaz.dump('adding listener to '+item.name)
		item.addEventListener(air.Event.SELECT,function(event) {
			Spaz.Menus.itemSelected(event);
		});
	}	
	return menu;			
}



Spaz.Menus.setSystrayTooltip = function(msg){
	if (air.NativeApplication.supportsSystemTrayIcon) {
		SystemItrayIcon(air.NativeApplication.nativeApplication.icon).tooltip = msg;
	}
}





// Handlers
Spaz.Menus.menuReload = function() {
	Spaz.dump('in Spaz.Menu.menuReload');
	Spaz.UI.reloadCurrentTab();
	Spaz.restartReloadTimer();
};

Spaz.Menus.menuClearTimeline = function() {
	Spaz.dump('in Spaz.Menu.menuClearTimeline');
	Spaz.UI.clearCurrentTimeline();
	Spaz.UI.reloadCurrentTab();
	Spaz.restartReloadTimer();
};

Spaz.Menus.menuPrefs  = function() {
	Spaz.dump('in Spaz.Menu.menuPrefs');
	Spaz.UI.setSelectedTab(document.getElementById('tab-prefs'));
	Spaz.UI.tabbedPanels.showPanel('tab-prefs');
};


Spaz.Menus.menuAbout = function() {
	Spaz.UI.showAbout();
}

Spaz.Menus.menuHelp = function() {
	Spaz.UI.showHelp();
}

Spaz.Menus.menuFeedback = function() {
	Spaz.UI.prepReply('spaz');
}