var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Windows) Spaz.Windows = {};

Spaz.Windows.windowExitCalled = false;


Spaz.Windows.onWindowActive = function (event) {
	sch.debug('Window ACTIVE');
  // if ($('body').focus()) {}
  $('body').addClass('active');
}


Spaz.Windows.onWindowDeactivate = function(event) {
	Spaz.UI.hideTooltips();
	$('body').removeClass('active');
};


Spaz.Windows.windowMinimize = function() {
	window.nativeWindow.minimize();
	if (Spaz.Prefs.get('window-minimizetosystray') && air.NativeApplication.supportsSystemTrayIcon) {
		window.nativeWindow.visible = false;
	}
	return false;
};


Spaz.Windows.windowRestore = function() {
	sch.debug('restoring window');
	sch.debug('current window state:'+window.nativeWindow.displayState);
	//sch.debug('id:'+air.NativeApplication.nativeApplication.id);


	// if (window.nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
	// 	sch.debug('restoring window');
	//  		nativeWindow.restore();
	//  	}
	sch.debug('restoring window');
	window.nativeWindow.restore();

	sch.debug('activating window');
	window.nativeWindow.activate();
	// sch.debug('ordering-to-front window');
	// window.nativeWindow.orderToFront();
	if (air.NativeApplication) {
		sch.debug('activating application');
		air.NativeApplication.nativeApplication.activate();
	}
};


Spaz.Windows.onAppExit = function(event) 
{
	sch.dump('Spaz.Windows.windowExitCalled is '+Spaz.Windows.windowExitCalled);
	// 
	// if (Spaz.Windows.windowExitCalled == false) {
	// 	sch.dump('windowClose was not called');
	// 	Spaz.Windows.windowClose();
	// 	return;
	// }

	Spaz.Prefs.savePrefs();
	
	if (event) {
		sch.dump('onAppExit triggered by event')
		// event.preventDefault();
		// event.stopImmediatePropagation();
	}
	
	window.nativeWindow.removeEventListener(air.Event.CLOSING, Spaz.Windows.onWindowClose);
	window.nativeWindow.removeEventListener(air.Event.EXITING, Spaz.Windows.windowClose);
	// air.NativeApplication.nativeApplication.removeEventListener(air.Event.EXITING, Spaz.Windows.onAppExit); 
	sch.dump("i'm exiting the app!");

	// alert('onAppExit');

	

	if (Spaz.Prefs.get('sound-enabled')) {
		Spaz.Sounds.playSoundShutdown(function() {
			air.NativeApplication.nativeApplication.exit();
		});
	} else {
		sch.dump('sound not playing');
		air.NativeApplication.nativeApplication.exit();
	}
	
}


Spaz.Windows.onWindowClose = function(event) {
	sch.dump("i'm closing a window!");
	Spaz.Prefs.savePrefs();
};


/**
* Called when the user closes the main window.
*/
Spaz.Windows.windowClose = function() {
	Spaz.Prefs.savePrefs();
	$('#container').addClass('animation-fadeout');
	sch.dump('calling windowClose');
	Spaz.Windows.windowExitCalled = true;
	Spaz.Windows.onAppExit();
};


Spaz.Windows.makeSystrayIcon = function() {
	if(air.NativeApplication.supportsSystemTrayIcon) { // system tray on windows
		sch.debug('Making Windows system tray menu')
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
	Spaz.Windows.windowRestore();
	// // TODO replace this with call to Spaz.Windows.windowRestore()
	// sch.debug('clicked on systray');
	// sch.debug(nativeWindow.displayState);
	// sch.debug('id:'+air.NativeApplication.nativeApplication.id);
	// 
	// if (nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED) {
	// 	sch.debug('restoring window');
	//  		nativeWindow.restore();
	//  	}
	//  	sch.debug('activating application');
	//  	air.NativeApplication.nativeApplication.activate() // bug fix by Mako
	// sch.debug('activating window');
	// nativeWindow.activate();
	// sch.debug('ordering-to-front window');
	// nativeWindow.orderToFront();
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
	sch.debug("making window visible");
	window.nativeWindow.visible = true;
}
Spaz.Windows.makeWindowHidden = function(){
	sch.debug("making window hidden");
	window.nativeWindow.visible = false;
}
Spaz.Windows.setWindowOpacity = function(value) {
    percentage = parseInt(value);
    if (isNaN(percentage)) {
        percentage = 100;
    }
    if (percentage < 25) {
        percentage = 25;
    }
    var val = parseInt(percentage) / 100;
    if (isNaN(val)) {
        val = 1;
    } else if (val >= 1) {
        val = 1;
    } else if (val <= 0) {
        val = 1;
    }
	window.htmlLoader.alpha = val;
}
Spaz.Windows.windowMove = function(){
	nativeWindow.startMove();
}
Spaz.Windows.windowResize = function(){
	nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
}


Spaz.Windows.resetPosition = function() {
	nativeWindow.x = Spaz.Prefs.defaultPreferences['window-x'];
	nativeWindow.y = Spaz.Prefs.defaultPreferences['window-y'];
	sch.dump(Spaz.Prefs.defaultPreferences['window-x'] +"x"+Spaz.Prefs.defaultPreferences['window-y']);
	sch.dump(nativeWindow.x +"x"+nativeWindow.y);
	Spaz.Windows.onWindowMove();
	
	nativeWindow.width  = Spaz.Prefs.defaultPreferences['window-width'];
	nativeWindow.height = Spaz.Prefs.defaultPreferences['window-height'];
	sch.dump(Spaz.Prefs.defaultPreferences['window-width'] +"x"+Spaz.Prefs.defaultPreferences['window-height']);
	sch.dump(nativeWindow.width +"x"+nativeWindow.height);
	Spaz.Windows.onWindowResize();
}


Spaz.Windows.onWindowResize = function() {
	if(Spaz.Windows.onWindowResize.prefsTimeout){
		clearTimeout(Spaz.Windows.onWindowResize.prefsTimeout);
		delete Spaz.Windows.onWindowResize.prefsTimeout;
	}
	Spaz.Windows.onWindowResize.prefsTimeout = setTimeout(function(){
		Spaz.Prefs.set('window-width',  nativeWindow.width);
		Spaz.Prefs.set('window-height', nativeWindow.height);
	}, 500);
};

Spaz.Windows.onWindowMove = function() {
	if(Spaz.Windows.onWindowMove.prefsTimeout){
		clearTimeout(Spaz.Windows.onWindowMove.prefsTimeout);
		delete Spaz.Windows.onWindowMove.prefsTimeout;
	}
	Spaz.Windows.onWindowMove.prefsTimeout = setTimeout(function(){
		Spaz.Prefs.set('window-x', nativeWindow.x);
		Spaz.Prefs.set('window-y', nativeWindow.y);
	}, 500);
};

/**
 * turns the drop shadow on if passed truthy val, else turns it off
 * @param {Boolean} state true or false 
 */
Spaz.Windows.enableDropShadow = function(state) {
	if (state) { // && !Spaz.Sys.isLinux()) {
	    window.htmlLoader.filters = window.runtime.Array(
			new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
	    );
	} else {
		window.htmlLoader.filters = null;
	}
};


/**
 * turns on restore on activate if passed truthy val, else turns it off
 * @param {Boolean} state true or false 
 */
Spaz.Windows.enableRestoreOnActivate = function(state) {
	if (state) {
		air.NativeApplication.nativeApplication.addEventListener('activate', Spaz.Windows.windowRestore);
	} else {
		air.NativeApplication.nativeApplication.removeEventListener('activate', Spaz.Windows.windowRestore);
	}
};


Spaz.Windows.enableMinimizeOnBackground = function(state) {
	if (state) {
		air.NativeApplication.nativeApplication.addEventListener('deactivate', Spaz.Windows.windowMinimize);
	} else {
		air.NativeApplication.nativeApplication.removeEventListener('deactivate', Spaz.Windows.windowMinimize);
	}
};
