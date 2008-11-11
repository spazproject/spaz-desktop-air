var Spaz;
if (!Spaz) Spaz = {};

// Spaz.verified = false;
Spaz.startReloadTimer = function() {
    var refreshInterval = Spaz.Prefs.getRefreshInterval();
    Spaz.dump('started timer with refresh of ' + refreshInterval + ' msecs');
    reloadID = window.setInterval(Spaz.UI.autoReloadCurrentTab, refreshInterval);
    return reloadID;
}


Spaz.stopReloadTimer = function() {
    if (reloadID) {
        window.clearInterval(reloadID);
        Spaz.dump('stopped timer');
    }

}

Spaz.restartReloadTimer = function() {
    Spaz.dump('trying to restart timer');
    Spaz.stopReloadTimer();
    Spaz.startReloadTimer();
}



Spaz.createUserDirs = function() {
    var appStore = air.File.applicationStorageDirectory;
    var userThemesDir = appStore.resolvePath("userthemes/");
    userThemesDir.createDirectory()

    var userPluginsDir = appStore.resolvePath("userplugins/");
    userPluginsDir.createDirectory()

    var userSmileysDir = appStore.resolvePath("usersmileys/");
    userSmileysDir.createDirectory()


    air.trace(userThemesDir.nativePath);
    air.trace(userPluginsDir.nativePath);
    air.trace(userSmileysDir.nativePath);
};




/**
 * Bootstraps the app
 */
Spaz.initialize = function() {

    air.trace('root init begin');

    // create user themes and plugins dirs if necessary
    Spaz.createUserDirs();

    /***************************
	 * Load prefs 
	 **************************/
    air.trace('init prefs');
    Spaz.Prefs.init();

    air.trace('init Sections');
    Spaz.Section.init();

    // turn on debugging
    if (Spaz.Prefs.get('debug-enabled')) {
        Spaz.Debug.insertDebugScripts();
    }

    // Database initialization
    air.trace("database initialization");
    Spaz.DB.init();

    // Docking initialization
    air.trace("docking initialization");
    Spaz.Dock.init();

    air.NativeApplication.nativeApplication.autoExit = true;

    window.htmlLoader.manageCookies = false;
    window.htmlLoader.paintsDefaultBackground = false;
    window.htmlLoader.cacheResponse = true;
    window.htmlLoader.useCache = true;
    Spaz.Sys.initUserAgentString();

    air.URLRequestDefaults.manageCookies = false;
    air.URLRequestDefaults.cacheResponse = true;
    air.URLRequestDefaults.useCache = true;

    // apply dropshadow to window
    air.trace('Applying Flash Filter Dropshadow');
    window.htmlLoader.filters = window.runtime.Array(
    new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
    );
    // new window.runtime.flash.filters.ColorMatrixFilter(([-1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
    // make the systray icon if on Windows
    Spaz.Windows.makeSystrayIcon()


    // ***************************************************************
    // Keyboard shortcut handling
    // ***************************************************************
    Spaz.Keyboard.setShortcuts();


    // insert theme CSS links
    Spaz.Themes.init();


    /*************************** 
	 * Apply prefs 
	 **************************/
    window.moveTo(Spaz.Prefs.get('window-x'), Spaz.Prefs.get('window-y'));
    window.resizeTo(Spaz.Prefs.get('window-width'), Spaz.Prefs.get('window-height'));
    $('#username').val(Spaz.Prefs.getUser());
    $('#password').val(Spaz.Prefs.getPass());

    //DONE: Check for Update
    if (Spaz.Prefs.get('checkupdate')) {
        Spaz.dump('Starting check for update');
        // Spaz.Update.updater.checkForUpdate();
        Spaz.dump('Ending check for update');
    }



    /************************
	 * Other stuff to do when document is ready
	 ***********************/
    Spaz.UI.playSoundStartup();
    Spaz.dump('Played startup sound');

    Spaz.Windows.makeWindowVisible();
    Spaz.dump('Made window visible');

    $('body').fadeIn(1000);



    Spaz.UI.tabbedPanels = new Spry.Widget.TabbedPanels("tabs");


    Spaz.UI.entryBox = new Spry.Widget.ValidationTextarea("entrybox",
    {
        maxChars: 140,
        counterType: "chars_remaining",
        counterId: 'chars-left',
        hint: Spaz.Prefs.get('entryboxhint'),
        useCharacterMasking: true
    }
    );

    Spaz.UI.prefsCPG = new Spry.Widget.CollapsiblePanelGroup("prefsCPG",
    {
        contentIsOpen: false,
        duration: 200
    }
    );


    $('#header-label').menu({
        copyClassAttr: true,
        addExpando: true,
        onClick: $.Menu.closeAll
    },
    '#mainMenuRoot');

	$('.panelmenu form input[title="filter"]').hint();

    $('.TabbedPanelsTab').each(function(i) {
        this.title = this.title + '<br />Shortcut: <strong>CMD or CTRL+' + (parseInt(i) + 1) + '</strong>';
    });
    Spaz.dump('Set shortcut info in tab titles');


    /*
		set-up window and app events
	*/
    window.nativeWindow.addEventListener(air.Event.EXITING, Spaz.Windows.onWindowClose);
    // air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, Spaz.Windows.onAppExit);
    window.nativeWindow.addEventListener(air.Event.CLOSING, Spaz.Windows.onWindowClose);
    window.nativeWindow.addEventListener(air.Event.ACTIVATE, Spaz.Windows.onWindowActive);
    window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.RESIZE, Spaz.Windows.onWindowResize);
    window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.MOVE, Spaz.Windows.onWindowMove);
    window.nativeWindow.addEventListener(air.Event.DEACTIVATE, Spaz.Windows.onWindowDeactivate);

    /*
		Initialize native menus
	*/
    Spaz.Menus.initAll();

    /*
		Set up event delegation stuff
	*/
    Spaz.Intercept.init();

    /*
		Start check for updates process
	*/
    if (Spaz.Prefs.get('checkupdate')) {
        Spaz.Update.go();
    }


    if (Spaz.Prefs.get('network-autoadjustrefreshinterval')) {
        Spaz.Data.getRateLimitInfo(Spaz.Prefs.setRateLimit);
    }






    if (Spaz.Prefs.get('timeline-loadonstartup')) {
        $('#tab-friends').trigger('click');
    }


	/*
		set-up usernameCompleter
	*/
	Spaz.uc = new usernameCompleter({
		'usernames':Spaz.Cache.getScreenNamesAsTags(),
		'displayDiv':'#suggestions',
		'textarea':'#entrybox',
		'maxMatches':15
	})

    Spaz.dump('ended document.ready()');





}






