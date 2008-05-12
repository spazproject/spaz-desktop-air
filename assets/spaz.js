var Spaz; if (!Spaz) Spaz = {};

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
	
	// turn on debugging
	if (Spaz.Prefs.get('debug-enabled')) {
		Spaz.Debug.insertDebugScripts();
	}

	air.NativeApplication.nativeApplication.autoExit = true;

	window.htmlLoader.manageCookies = false;
	window.htmlLoader.paintsDefaultBackground = false;
	window.htmlLoader.cacheResponse = false;
	window.htmlLoader.useCache = false;
	
	air.URLRequestDefaults.manageCookies = false;
	air.URLRequestDefaults.cacheResponse = false;
	air.URLRequestDefaults.useCache = false;
	
	
	// apply dropshadow to window
	air.trace('Applying Flash Filter Dropshadow');
	window.htmlLoader.filters = window.runtime.Array(
		new window.runtime.flash.filters.DropShadowFilter(3,90,0,.8,6,6)
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
	air.trace("CHECKING FOR UPDATES IS TURNED OFF DURING PREFS REWRITE")
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
		{ maxChars:140,
		counterType:"chars_remaining",
		counterId:'chars-left',
		hint:entryBoxHint,
		useCharacterMasking:true }
	);

	Spaz.UI.prefsCPG = new Spry.Widget.CollapsiblePanelGroup("prefsCPG",
		{ contentIsOpen:false, duration:200 }
	);


	$('#header-label').menu( { copyClassAttr:true, addExpando:true, onClick:$.Menu.closeAll }, '#mainMenuRoot');



	$('.TabbedPanelsTab').each( function(i) {
		this.title = this.title + '<br />Shortcut: <strong>CMD or CTRL+'+(parseInt(i)+1)+'</strong>';
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
		Start check for updates process
	*/
	if (Spaz.Prefs.get('checkupdate')) {
		Spaz.Update.go();
	}
	
	
	// ***************************************************************
	// Event delegation handling
	// ***************************************************************
	$('body').intercept('mouseover', {
			'.user-screen-name[title]':function() {
				Spaz.UI.showTooltip(this, $(this).attr('title'));
			},
			'.user-image[title]':function() {
				Spaz.UI.showTooltip(this, $(this).attr('title'));
			},
			'a.inline-link':function() {
				Spaz.UI.showTooltip(this, "Open "+$(this).attr('href')+" in a browser window", $(this).attr('href'));
			},
			'a[title]':function() {
				Spaz.UI.showTooltip(this, $(this).attr('title'), $(this).attr('href'));
				// air.trace(this.outerHTML);
			},
			'a[user-screen_name]':function() {
				Spaz.UI.showTooltip(this, $(this).attr('title'), $(this).attr('href'));
			}
		})
		.intercept('mouseout', {
			'[title]':function() {
				Spaz.UI.hideTooltips();
			}
		})
		.intercept('click', {
			'#friendslist-showfriends':function() {
				$('#timeline-followers').fadeOut();
				$('#timeline-friendslist').fadeIn();
			},
			'#friendslist-showfollowers':function() {
				$('#timeline-friendslist').fadeOut();
				$('#timeline-followers').fadeIn();
			},
			'#mainMenu-help':function() {
				Spaz.UI.showHelp();
			},
			'#mainMenu-about':function() {
				Spaz.UI.showAbout();
			},
			'#mainMenu-file-toggle': function(){
				Spaz.UI.toggleTimelineFilter();
			},
			'#mainMenu-file-reloadCurrentView': function(){
				Spaz.UI.reloadCurrentTab(true);
				Spaz.restartReloadTimer();
			},
			'#mainMenu-file-clearReloadCurrentView': function(){
				Spaz.UI.clearCurrentTimeline();
				Spaz.UI.reloadCurrentTab(true);
				Spaz.restartReloadTimer();
			},
			'#mainMenu-sendDM': function() {
				Spaz.UI.prepDirectMessage('');
			},
			'#mainMenu-sendReply': function() {
				Spaz.UI.prepReply('');
			},
			'#mainMenu-followSpaz': function(attribute){
				Spaz.Data.followUser('spaz');
			},
			'a[href]':function() {
				var url = $(this).attr('href');
				openInBrowser(url);
				return false;
			},
			'.user-screen-name':function() {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.user-image':function() {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.status-action-fav':function() {
				Spaz.Data.makeFavorite($(this).attr('entry-id'))
			},
			'.status-action-dm':function() {
				Spaz.UI.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'.status-action-reply':function() {
				Spaz.UI.prepReply($(this).attr('user-screen_name'));
			},
			'.status-action-del':function() {
				Spaz.Data.destroyStatus($(this).attr('entry-id'))
			},
			'.directory-action-follow': function(){
				Spaz.Data.followUser($(this).attr('user-screen_name'));
			},
			'.directory-action-unfollow': function(){
				Spaz.Data.stopFollowingUser($(this).attr('user-screen_name'));
			},
			'.directory-user-location': function() {
				Spaz.UI.showLocationOnMap($(this).text());
			},
			'.timeline-entry':function() {
				$('div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
				$(this).addClass('ui-selected');
			},
			'.timeline-entry *':function() { // this one needs to be last so the more specific ones above take precedence
				$('div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
				var entry = $(this).parents('.timeline-entry');
				entry.addClass('ui-selected');
			},
			'a':function() {
				Spaz.dump(this.outerHTML);
			}
			// '#header-label':function() {
			//	Spaz.UI.showMainMenu($(this));
			// },
		})
		.intercept('contextmenu', {
			// 'div.timeline-entry .user, div.timeline-entry .user-image, div.timeline-entry .user-screen-name':function() {
			'.user,.user-image,.user-screen-name,a[user-screen_name]':function() {
				air.trace(this.outerHTML);
				var screen_name = $(this).attr('user-screen_name');
				Spaz.UI.showUserContextMenu($(this), screen_name);
			},
			'a[href]':function() {
				var url = $(this).attr('href');
				Spaz.UI.showLinkContextMenu($(this), url);
			},
		})
	// end intercept

	Spaz.UI.setSelectedTab($('#tab-friends')[0]);
	
	Spaz.dump('ended document.ready()');
}


/*
makes relative time out of "Sun Jul 08 19:01:12 +0000 2007" type string
Borrowed from Mike Demers (slightly altered)
https://twitter.pbwiki.com/RelativeTimeScripts
*/
function get_relative_time(time_value) {
	var parsed_date = new Date;
	parsed_date.setTime(Date.parse(time_value));
	var now = new Date;
	var delta = parseInt( (now.getTime() - parsed_date.getTime()) / 1000);

	if(delta < 60) {
		return 'less than a minute ago';
	} else if(delta < 120) {
		return 'about a minute ago';
	} else if(delta < (45*60)) {
		return (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (90*60)) {
		return 'about an hour ago';
	} else if(delta < (24*60*60)) {
		if (parseInt(delta / 3600) == 1) {
			return 'about 2 hours ago';
		} else {
			return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
		}
	} else if(delta < (48*60*60)) {
		return '1 day ago';
	} else {
		return (parseInt(delta / 86400)).toString() + ' days ago';
	}
}


function httpTimeToInt(entryDate) {
	var parsedDate = new Date;
	parsedDate.setTime(Date.parse(entryDate));
	return parsedDate.getTime();
	// var now = new Date;
}


function getTimeAsInt() {
	var now = new Date;
	return now.getTime();
}


function openInBrowser(url) {
	Spaz.Sys.openInBrowser(url);
}



function createXMLFromString (string) {
  var xmlParser, xmlDocument;
  try {
	xmlParser = new DOMParser();
	xmlDocument = xmlParser.parseFromString(string, 'text/xml');
	return xmlDocument;
  }
  catch (e) {
	output("Can't create XML document.");
	return null;
  }
}



// Return a boolean value telling whether
// the first argument is a string. 
function isString() {
	if (typeof arguments[0] == 'string') return true;
	if (typeof arguments[0] == 'object') {
		var criterion = arguments[0].constructor.toString().match(/string/i);
		return (criterion != null);
	}
	return false;
}

// http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C720080D723
function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1)
	  return false;
   else
	  return true;
}