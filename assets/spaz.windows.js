var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Windows) Spaz.Windows = {};


Spaz.Windows.windowActiveHandler = function () {
	Spaz.dump('Window ACTIVE');
	if ($('body').focus()) {
	}
	
}

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
Spaz.Windows.onNativeMove = function(){
	nativeWindow.startMove();
}
Spaz.Windows.onResize = function(){
	nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
}