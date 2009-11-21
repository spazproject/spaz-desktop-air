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
	var userThemesDir = appStore.resolvePath(USERDIR_THEMES);
	userThemesDir.createDirectory()

	var userPluginsDir = appStore.resolvePath(USERDIR_PLUGINS);
	userPluginsDir.createDirectory()

	var userSmileysDir = appStore.resolvePath(USERDIR_SMILEYS);
	userSmileysDir.createDirectory()

	var userSoundsDir = appStore.resolvePath(USERDIR_SOUND);
	userSoundsDir.createDirectory()

	sch.dump(userThemesDir.nativePath);
	sch.dump(userPluginsDir.nativePath);
	sch.dump(userSmileysDir.nativePath);
	sch.dump(userSoundsDir.nativePath);
};

/**
 * Bootstraps the app
 */
Spaz.initialize = function() {

	sch.dump('root init begin');
	
	// create user themes and plugins dirs if necessary
	Spaz.createUserDirs();

	// if (Spaz.Sys.isLinux()) {
	// 	$('body').show();
	// 	$('body').css('opacity', 1);
	// 	$('#container').css('-khtml-border-radius','0'); /* this is webkit-specific and gives us rounded corners*/
	// 	$('#container').css('top',   '0px;'); /* This has an effective 8px padding to show us the app dropshadow */
	// 	$('#container').css('left',  '0px;'); /* using all-four-sides positioning lets it expand properly on resizing */
	// 	$('#container').css('bottom','0px;');
	// 	$('#container').css('right', '0px;');
	// }

	// alert("OS:"+air.Capabilities.os);

	/***************************
	 * Load prefs
	 **************************/
	sch.dump('init prefs');
	Spaz.Prefs.init();

	sch.dump('init Sections');
	Spaz.Section.init();

	// turn on debugging
	if (Spaz.Prefs.get('debug-enabled')) {
		Spaz.Debug.insertDebugScripts();
	}

	// Database initialization
	sch.dump("database initialization");
	Spaz.DB.init();
	
	sch.dump('JazzRecord initialization');
	JazzRecord.adapter = new JazzRecord.AirAdapter({dbFile: "spaz_jr.db"});
	if (Spaz.Prefs.get('debug-enabled')) {
		JazzRecord.debug = true;
	}
	JazzRecord.depth = 0;
	JazzRecord.migrate();
	JazzRecord.addIndex('tweets', 'twitter_id');
	JazzRecord.addIndex('twusers', 'twitter_id');
	JazzRecord.addIndex('twusers', 'screen_name');

	// Docking initialization
	sch.dump("docking initialization");
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


	Spaz.Windows.makeSystrayIcon()


	// ***************************************************************
	// Keyboard shortcut handling
	// ***************************************************************
	Spaz.Controller.setKeyboardShortcuts();


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

	window.nativeWindow.visible = true;

	if (Spaz.Prefs.get('window-minimizeatstartup')) {
		Spaz.Windows.windowMinimize()
	}

	$('body').fadeIn(1000);

	Spaz.UI.tabbedPanels = new Spry.Widget.TabbedPanels("tabs");

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
		'#mainMenuRoot'
	);

	$('#view-friends').menu({
			copyClassAttr: true,
			addExpando: true,
			onClick: $.Menu.closeAll
		},
		'#view-friends-menu'
	);

	// $('.panelmenu form input[title="filter"]').hint();

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
	Spaz.Controller.initIntercept();

	/*
		Start check for updates process
	*/
	if (Spaz.Prefs.get('checkupdate')) {
		Spaz.Update.go();
	}


	if (Spaz.Prefs.get('network-autoadjustrefreshinterval')) {
		Spaz.Data.getRateLimitInfo(Spaz.Prefs.setRateLimit);
	}


	Spaz.Timelines.init();


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
	
	/*
		set-up post panel
	*/
	Spaz.postPanel = new SpazPostPanel({
		on_submit:function() {
			this.disable();
			var status = sch.trim(this.getMessageText());
			var twit = new SpazTwit(Spaz.Prefs.getUser(), Spaz.Prefs.getPass());
			var source = Spaz.Prefs.get('twitter-source');
			var irt_id = this.irt_status_id;
			twit.update(status, source, irt_id);
		}
	});


	/*
		About popbox
	*/
	$('#about-version').text("v"+Spaz.Sys.getVersion());


	/*
		initialinze URL shortener
	*/
	var initUrlShortener = function() {
		
		var method;
		
		// get the pref
		var service = Spaz.Prefs.get('url-shortener');
		sch.dump("service is "+ service);
	
	        if (service == 'shortie') {
	            $('#shorten-custom-hidden').css({display: 'block', visibility: 'visible'});
	        }
	
		// populate the dropdown
		for (method in Spaz.Shortlink.services) {
			sch.dump(method)
	
			if (method[0] != '$') {
				if (method == service) {
					$('#url-shortener').append('<option value="'+method+'" selected="selected">'+method+'</option>');
				} else {
					$('#url-shortener').append('<option value="'+method+'">'+method+'</option>');
				}
			}
		}
		
		// $('#url-shortener').bind('change', function() {
		// 	sch.dump($('#url-shortener').val());
		// 	Spaz.Prefs.set('url-shortener', $('#url-shortener').val());
		// });
		
	        $('#url-shortener').bind('change', function() {
	
			sch.dump($('#url-shortener').val());
			Spaz.Prefs.set('url-shortener', $('#url-shortener').val());
	            if ($('#url-shortener').val() != 'shortie') {
	                $('#shorten-custom-hidden').css({display: 'none', visibility: 'hidden'});
	            } else {
	                $('#shorten-custom-hidden').css({display: 'block', visibility: 'visible'});
	            }
		});
		
		$('#shorten-original-link').focus();
		$('#shorten-original-link').val('http://');


		// if(air.Clipboard.generalClipboard.hasFormat(air.ClipboardFormats.TEXT_FORMAT)) {
		// 	sch.dump('Found text in clipboard');
		// 	
		//     var cliptext = air.Clipboard.generalClipboard.getData(air.ClipboardFormats.TEXT_FORMAT);
		// 	if (/^https?:\/\//.test(cliptext)) { // if it starts with http://, we assume this is an URL and put it in the form field
		// 		sch.dump('Found url in clipboard');
		// 		$('#shorten-original-link').val(cliptext);
		// 		Spaz.Shortlink.services[service](cliptext);
		// 	}
		// 	$('#shorten-original-link').select();
		// }
					
		$('#shortenLink-form').bind('submit', function() {
	  	var service = Spaz.Prefs.get('url-shortener');
			sch.dump("service is "+ service);
	            var custom = $('#shorten-custom-link').val();
	            if (custom != '') {
			    Spaz.Shortlink.services[service]($('#shorten-original-link').val(), custom);
	            } else {
			    Spaz.Shortlink.services[service]($('#shorten-original-link').val());
	            }
		});
		
		// sch.dump(air.NativeApplication.nativeApplication.spazPrefs);
	};

	initUrlShortener();

	/*
		initialize Image uploader popbox
	*/
	var SpazImageUploader = new Spaz.ImageUploader();
	SpazImageUploader.init();

	Spaz.dump('ended document.ready()');
}