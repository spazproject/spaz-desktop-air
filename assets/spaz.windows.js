var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Windows) Spaz.Windows = {};


Spaz.Windows.onWindowActive = function () {
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

/**
* Called when the user closes the window.
*/
Spaz.Windows.onAppExit = function(event) 
{
	Spaz.dump("i'm exiting the app!");

	event.preventDefault();

	$('#container').fadeOut(500);
	Spaz.Prefs.savePrefs();
	Spaz.UI.playSoundShutdown(function() {
		// alert('from the shutdown callback!')
		// window.NativeWindow.close();
		air.NativeApplication.nativeApplication.exit();
	});
}

Spaz.Windows.onWindowClose = function(event) {
	Spaz.dump("i'm closing a window!");
};

Spaz.Windows.windowClose = function() {
	Spaz.dump('calling windowClose');
	var exitingEvent = new air.Event(air.Event.EXITING,true,true);
	air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent);
	
	// if (force) {
	// 	air.trace('forcing window close');
	// 	window.nativeWindow.close();
	// } else {
	// 	var closingEvent = new air.Event(air.Event.CLOSING,true,true);
	// 	air.trace('dispatching closingEvent');
	// 	window.nativeWindow.dispatchEvent(closingEvent);		
	// }
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