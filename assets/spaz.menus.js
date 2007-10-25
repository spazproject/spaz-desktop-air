var Spaz; if (!Spaz) Spaz = {};
if (!Spaz.Menus) Spaz.Menus = {};


// Spaz.Menus.methods = new object{
// 	'Preferences…':			Spaz.Bridge.Menus.prefs,
// 	'Reload current view': 	Spaz.Bridge.Menus.reload, 
// }



Spaz.Menus.initAll = function() {
	//For application menu (on MAC OS X)
	if(air.Shell.supportsMenu){
		air.Shell.shell.menu = Spaz.Menus.createRootMenu('OSX');
	} else {
		
	}
	Spaz.Menus.contextMenu = Spaz.Menus.createRootMenu();
};

Spaz.Menus.displayContextMenu = function(event) {
	air.trace('showing context menu');
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
	
	if (event.target.name == "reload") {
		Spaz.dump('Calling Spaz.Bridge.menuReload');
		Spaz.Bridge.menuReload();
	}
	
	else if (event.target.name == "prefs") {
		Spaz.dump('Calling Spaz.Bridge.menuPrefs');
		Spaz.Bridge.menuPrefs();
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
	} else {
		var menu = new air.NativeMenu();
		menu.addSubmenu(Spaz.Menus.createFileMenu(),"File");
		menu.addSubmenu(Spaz.Menus.createEditMenu(),"Edit");
	}
	menu.addSubmenu(Spaz.Menus.createViewMenu(),"View");
	menu.addSubmenu(Spaz.Menus.createHelpMenu(),"Help");
	
	// var appmenu = menu.items[1].submenu;
	
	// console.open();
	// console.log('EditMenu:');
	// console.dir(appmenu);
	
	// 	for(var i = 0; i < appmenu.items.length; i++){
	// 		item = appmenu.items[i];
	// 		console.open();
	// 		console.log('Item'+i+":");
	// 		console.log(item.label);
	// 		console.dir(item);
	// //		item.addEventListener(air.Event.SELECT,Spaz.Menus.itemSelected);
	// 	}
	
	return menu;
}

//Creates the file menu
Spaz.Menus.createFileMenu = function(){
	var menu = new air.NativeMenu();
	menu.addItem(new air.NativeMenuItem("",true));//separator
	menu.addItem(new air.NativeMenuItem("Exit"));
	
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
	miReload.keyEquivalentModifiers.mnemonicIndex = 0;
	miReload.keyEquivalent = 'r';

	
	var miPrefs = new air.NativeMenuItem("Preferences…");
	miPrefs.name = 'prefs';
	miPrefs.keyEquivalentModifiers = new Array(runtime.flash.ui.Keyboard.COMMAND);
	miReload.keyEquivalentModifiers.mnemonicIndex = 0;
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
	menu.addItem(new air.NativeMenuItem("Spaz help"));
	menu.addItem(new air.NativeMenuItem("",true));//separator
	menu.addItem(new air.NativeMenuItem("Check for updates"));
	menu.addItem(new air.NativeMenuItem("Provide feedback"));
	menu.addItem(new air.NativeMenuItem("",true));//separator
	menu.addItem(new air.NativeMenuItem("About AIR Menus"));
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
