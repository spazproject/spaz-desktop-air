var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Windows) Spaz.Windows = {};

Spaz.Windows.windowExitCalled = false;


Spaz.Windows.onWindowActive = function (event) {
	Spaz.dump('Window ACTIVE');
	if ($('body').focus()) {
	}
	
}


Spaz.Windows.onWindowDeactivate = function(event) {
	Spaz.UI.hideTooltips();
};


Spaz.Windows.windowMinimize = function() {
	window.nativeWindow.minimize();
	if (Spaz.Prefs.get('window-minimizetosystray') && air.NativeApplication.supportsSystemTrayIcon) {
		window.nativeWindow.visible = false;
	}
	return false;
};


Spaz.Windows.windowRestore = function() {
	Spaz.dump('restoring window');
	Spaz.dump('current window state:'+window.nativeWindow.displayState);
	//Spaz.dump('id:'+air.NativeApplication.nativeApplication.id);


	// if (window.nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
	// 	Spaz.dump('restoring window');
	//  		nativeWindow.restore();
	//  	}
	Spaz.dump('restoring window');
	window.nativeWindow.restore();

	Spaz.dump('activating window');
	window.nativeWindow.activate();
	// Spaz.dump('ordering-to-front window');
	// window.nativeWindow.orderToFront();
	if (air.NativeApplication) {
		Spaz.dump('activating application');
		air.NativeApplication.nativeApplication.activate();
	}
};


Spaz.Windows.onAppExit = function(event) 
{
	air.trace('Spaz.Windows.windowExitCalled is '+Spaz.Windows.windowExitCalled);
	// 
	// if (Spaz.Windows.windowExitCalled == false) {
	// 	air.trace('windowClose was not called');
	// 	Spaz.Windows.windowClose();
	// 	return;
	// }

	$('body').fadeOut(500);
	Spaz.Prefs.savePrefs();
	
	if (event) {
		air.trace('onAppExit triggered by event')
		// event.preventDefault();
		// event.stopImmediatePropagation();
	}
	
	window.nativeWindow.removeEventListener(air.Event.CLOSING, Spaz.Windows.onWindowClose);
	window.nativeWindow.removeEventListener(air.Event.EXITING, Spaz.Windows.windowClose);
	// air.NativeApplication.nativeApplication.removeEventListener(air.Event.EXITING, Spaz.Windows.onAppExit); 
	air.trace("i'm exiting the app!");

	// alert('onAppExit');

	

	if (Spaz.Prefs.get('sound-enabled')) {
		Spaz.UI.playSoundShutdown(function() {
			// alert('from the shutdown callback!')
			// window.NativeWindow.close();
			air.NativeApplication.nativeApplication.exit();
		});
	} else {
		air.trace('sound not playing');
		air.NativeApplication.nativeApplication.exit();
	}
	
}


Spaz.Windows.onWindowClose = function(event) {
	air.trace("i'm closing a window!");
};


/**
* Called when the user closes the main window.
*/
Spaz.Windows.windowClose = function() {
		air.trace('calling windowClose');
		Spaz.Windows.windowExitCalled = true;
		Spaz.Windows.onAppExit();
};


Spaz.Windows.makeSystrayIcon = function() {
	if(air.NativeApplication.supportsSystemTrayIcon) { // system tray on windows
		Spaz.dump('Making Windows system tray menu')
		air.NativeApplication.nativeApplication.icon.tooltip = "Spaz loves you";
		// air.NativeApplication.nativeApplication.icon.menu = Spaz.Menus.createRootMenu();
		var systrayIconLoader = new air.Loader();
		systrayIconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
		                                                       Spaz.Menus.iconLoadComplete);
		systrayIconLoader.load(new air.URLRequest("images/spaz-icon-alpha_16.png"));
		air.NativeApplication.nativeApplication.icon.addEventListener('click', Spaz.Windows.onSystrayClick);
	}
};


Spaz.Windows.onSystrayClick = function(event) {
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


Spaz.Windows.openHTMLUtilityWindow = function(url) {
	
	var options = new air.NativeWindowInitOptions();
	options.systemChrome = air.NativeWindowSystemChrome.STANDARD;
	options.type = air.NativeWindowType.UTILITY;

	var windowBounds = new air.Rectangle(200,250,300,400);
	var newWindow = air.HTMLLoader.createRootWindow(true, options, true, windowBounds);
	newWindow.load(new runtime.flash.net.URLRequest(url));
	
}

Spaz.Windows.makeWindowVisible = function(){
	Spaz.dump("making window visible");
	window.nativeWindow.visible = true;
}
Spaz.Windows.makeWindowHidden = function(){
	Spaz.dump("making window hidden");
	window.nativeWindow.visible = false;
}
Spaz.Windows.setWindowOpacity = function(percentage) {
	var val  = parseInt(percentage)/100;
	window.htmlLoader.alpha = val;
}
Spaz.Windows.windowMove = function(){
	nativeWindow.startMove();
}
Spaz.Windows.windowResize = function(){
	nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
}


Spaz.Windows.onWindowResize = function() {
	Spaz.Prefs.set('window-width', nativeWindow.width);
	Spaz.Prefs.set('window-height', nativeWindow.height);
};
Spaz.Windows.onWindowMove = function() {
	Spaz.Prefs.set('window-x', nativeWindow.x);
	Spaz.Prefs.set('window-y', nativeWindow.y);	
};