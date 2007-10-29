var Spaz; if (!Spaz) Spaz = {};
if (!Spaz.Menus) Spaz.Menus = {};


// Spaz.Menus.methods = new object{
// 	'Preferences…':			Spaz.Bridge.Menus.prefs,
// 	'Reload current view': 	Spaz.Bridge.Menus.reload, 
// }



Spaz.Menus.initAll = function() {
	//For application menu (on MAC OS X)
	Spaz.dump('Init Native Menus');
	if(air.Shell.supportsMenu){
		Spaz.dump('Native Menus for OS X');
		air.Shell.shell.menu = Spaz.Menus.createRootMenu('OSX');
	} else {
		Spaz.dump('Native Menus in Windows not supported');
	}
	
	// dock/systray icon menus
	if(air.Shell.supportsDockIcon){
		Spaz.dump('Dock Menus for OS X');
		var iconLoader = new air.Loader();
        iconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
                                                Spaz.Menus.iconLoadComplete);
        iconLoader.load(new air.URLRequest("images/spaz-icon-alpha.png"));
        air.Shell.shell.icon.menu = Spaz.Menus.createRootMenu();
    } else if(air.Shell.supportsSystemTrayIcon) {
		Spaz.dump('Making Windows system tray menu')
	    air.Shell.shell.icon.tooltip = "Spaz loves you";
	    air.Shell.shell.icon.menu = Spaz.Menus.createRootMenu();
	    var systrayIconLoader = new runtime.flash.display.Loader();
	    systrayIconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
	                                                            Spaz.Menus.iconLoadComplete);
	    systrayIconLoader.load(new air.URLRequest("images/spaz-icon-alpha.png"));
	    air.Shell.shell.icon.addEventListener('click', Spaz.Menus.onSystrayClick);
	}
	
	Spaz.dump('Create Native context Menus');
	Spaz.Menus.contextMenu = Spaz.Menus.createRootMenu();
};


Spaz.Menus.onSystrayClick = function(event) {
	Spaz.dump('clicked on systray');
	Spaz.dump(nativeWindow.displayState);
	Spaz.dump('id:'+air.Shell.shell.id);
	
	if (nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
		Spaz.dump('restoring window');
 		nativeWindow.restore();
 	}
 	Spaz.dump('activating application');
 	air.Shell.shell.activateApplication()
	Spaz.dump('activating window');
	nativeWindow.activate();
	Spaz.dump('ordering-to-front window');
	nativeWindow.orderToFront();
}

// completes the loading of the systray icon
Spaz.Menus.iconLoadComplete = function(event) {
	air.Shell.shell.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
}

Spaz.Menus.displayContextMenu = function(event) {
	Spaz.dump('showing context menu');
	Spaz.Menus.contextMenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
};


//Reports the chosen menu command
Spaz.Menus.itemSelected = function(event){
	Spaz.dump("Selected item: " + event.target.label);
	//	Spaz.Debug.showProps(event.target, 'eventtarget');
	Spaz.dump('event.target.name:' + event.target.name);
	//	Spaz.Debug.showProps(Spaz.Menus, 'Spaz.Menus');
	//	console.open();
	// console.log('event.target:');
	// console.dir(event.target);
	
	//eventLog.innerHTML = "Selected item: " + event.target.label + "\n";e
	
	if (event.target.name == "exit") {
		Spaz.dump('Calling Spaz.Prefs.windowClosingHandler');
		Spaz.Prefs.windowClosingHandler();
	}
	
	
	if (event.target.name == "reload") {
		Spaz.dump('Calling Spaz.Bridge.menuReload');
		Spaz.Bridge.menuReload();
	}
	
	if (event.target.name == "prefs") {
		Spaz.dump('Calling Spaz.Bridge.menuPrefs');
		Spaz.Bridge.menuPrefs();
	}
	
	if (event.target.name == "about") {
		Spaz.dump('Calling Spaz.Bridge.menuPrefs');
		Spaz.Bridge.menuAbout();
	}
	
	if (event.target.name == "feedback") {
		Spaz.dump('Calling Spaz.Bridge.UI.prepReply');
		Spaz.Bridge.menuFeedback('spaz');
	}
	if (event.target.name == "check") {
		Spaz.dump('Calling Spaz.Update.updater.checkForUpdate');
		Spaz.Update.updater.checkForUpdate();
	}
	if (event.target.name == "help") {
		Spaz.dump('Calling Spaz.Bridge.menuPrefs');
		Spaz.Bridge.menuHelp();
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
		var menu = air.Shell.shell.menu;
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
		var prefsItem = viewMenu.removeItemAt(1);
		
		menu.removeItemAt(1);
		
		titleMenu.addItemAt(aboutItem, 0);
		titleMenu.addItemAt(new air.NativeMenuItem("",true),1);//separator
		titleMenu.addItemAt(prefsItem, 2);
		
	} else {
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
	miExit.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
	miExit.mnemonicIndex = 0;
	miExit.keyEquivalent = 'q';
	menu.addItem(miExit);
	
	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		item.addEventListener(air.Event.SELECT,Spaz.Menus.itemSelected);
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
		item.addEventListener(air.Event.SELECT,Spaz.Menus.itemSelected);
	}			
	return menu;
	
}

Spaz.Menus.createViewMenu = function(){
	
	// 17 = CONTROL
	// 16 = SHIFT
	// 15 = CMD
	
	var miReload = new air.NativeMenuItem("Reload current view");
	miReload.name = 'reload';
	miReload.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.ALTERNATE);
	miReload.mnemonicIndex = 0;
	miReload.keyEquivalent = 'r';

	
	var miPrefs = new air.NativeMenuItem("Preferences…");
	miPrefs.name = 'prefs';
	miPrefs.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
	miPrefs.mnemonicIndex = 0;
	miPrefs.keyEquivalent = ',';

	
	var menu = new air.NativeMenu();
	menu.addItem(miReload);
	menu.addItem(miPrefs);
	
	for(var i = 0; i < menu.items.length; i++){
		item = menu.items[i];
		item.addEventListener(air.Event.SELECT,Spaz.Menus.itemSelected);
	}
	return menu;
}

//Creates the help menu
Spaz.Menus.createHelpMenu = function(){
	var menu = new air.NativeMenu();
	var miHelp = new air.NativeMenuItem("Spaz Help");
	miHelp.name = 'help';
	miHelp.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
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
		item.addEventListener(air.Event.SELECT,Spaz.Menus.itemSelected);
	}			
	return menu;			
}



Spaz.Menus.setSystrayTooltip = function(msg){
	if (air.Shell.supportsSystemTrayIcon) {
		SystemItrayIcon(Shell.shell.icon).tooltip = msg;
	}
}
