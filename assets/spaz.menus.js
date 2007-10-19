var Spaz; if (!Spaz) Spaz = {};
if (!Spaz.Menus) Spaz.Menus = {};


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
	air.trace("Selected item: " + event.target.label);
	Spaz.Debug.showProps(event.target, 'eventtarget');
	air.trace('event.target:' + event.target);
//	Spaz.Debug.showProps(Spaz.Menus, 'Spaz.Menus');
	console.open();
	console.log('event.target:');
	console.dir(event.target);
	console.log('Spaz.Menus:');
	console.dir(Spaz.Menus);
	
	//eventLog.innerHTML = "Selected item: " + event.target.label + "\n";
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
	var menu = new air.NativeMenu();
	menu.addItem(new air.NativeMenuItem("Reload current view"));
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
