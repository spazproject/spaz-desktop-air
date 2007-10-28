var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Bridge
************/
if (!Spaz.Bridge) Spaz.Bridge = {};

//check if we are in root sandbox
if(typeof runtime!='undefined'){
	Spaz.Bridge.$child = null;
	
	Spaz.Bridge.$init = function(iframe){
	
		var bridge = {};
		
		//link every function from Spaz.Bridge to parentSandboxBridge
		//this will enable calling them from child iframe
		//do not link private functions (like this one - function name starts with $ sign)
		
		for(var i in Spaz.Bridge){
			if(i[0]!='$')
			{
				bridge[i]=Spaz.Bridge[i];
			}
		}
		
		iframe.contentWindow.parentSandboxBridge = bridge;
		
		Spaz.Bridge.$iframe = iframe;
	
	}
	
	Spaz.Bridge.triggerRemoteLoad = function(){
		//now we know remote content is linked (or loaded)
		//that means we have childSandboxBridge object initialized
	
		var bridge = Spaz.Bridge.$iframe.contentWindow.childSandboxBridge;
		
		for(var i in bridge){
			Spaz.Bridge[i]=bridge[i];
		}
	
		//add some events
		
		if(Spaz.Debug.enabled){
			Spaz.Bridge.insertDebugScripts();
		}
		
		window.nativeWindow.addEventListener(air.Event.CLOSING, Spaz.Bridge.$windowClosingHandler); 
		window.nativeWindow.addEventListener(air.Event.ACTIVATE, Spaz.Bridge.windowActiveHandler);
		
		// load prefs!!!
		Spaz.Prefs.load();
		
		Spaz.Update.updater = new Spaz.Update(Spaz.Info.getVersion(), Spaz.Update.descriptorURL, 'updateCheckWindow');
	}
	
	
	
	
	Spaz.Bridge.navigateToURL = function (url){
		window.runtime.flash.net.navigateToURL(new window.runtime.flash.net.URLRequest(url));
	}
	
	
	Spaz.Bridge.playSound = function(url, callback) {
		Spaz.dump('Spaz.Bridge.playSound callback:'+callback);
		Spaz.dump("loading " + url);
		var req = new air.URLRequest(url);
		var s = new air.Sound(req);
		s.play();
		Spaz.dump("playing " + url);
		if (callback) {
			s.addEventListener(air.Event.SOUND_COMPLETE, callback);
		} else {
			//s.addEventListener(air.Event.SOUND_COMPLETE, Spaz.Bridge.$onSoundPlaybackComplete);
		}
		s.addEventListener(air.Event.SOUND_COMPLETE, Spaz.Bridge.makeWindowVisible);
		
	}
	
	
	Spaz.Bridge.$onSoundPlaybackComplete = function(event) {
		Spaz.dump("The sound has finished playing.");
	}

	
	Spaz.Bridge.browseForUserCss = function() {
		// var cssFilter = new air.FileFilter("StyleSheets", "~~.css;");
		// var imagesFilter = new air.FileFilter("Images", "~~.jpg;~~.gif;~~.png");
		// var docFilter = new air.FileFilter("Documents", "~~.pdf;~~.doc;~~.txt");
		var userFile = new air.File();
		userFile.browseForOpen("Choose User CSS File");
		userFile.addEventListener(air.Event.SELECT, Spaz.Bridge.$userCSSSelected);
	}

	Spaz.Bridge.$userCSSSelected = function(event) {
		//TODO: cannot access files outside sandbox
		alert('User CSS not yet working');
		Spaz.dump(event.target.url);
		Spaz.Bridge.setUserStyleSheet(event.target.url);
	}
	
	
	Spaz.Bridge.getThemePaths = function() {
		var appdir    = air.File.applicationResourceDirectory;
		var themesdir = appdir.resolvePath('themes');
		
		var list = themesdir.getDirectoryListing();
		var themes = new Array();
		for (i = 0; i < list.length; i++) {
			if (list[i].isDirectory) {
				
				var thisthemedir = list[i];
				var thisthemename= thisthemedir.name;
				var thisthemecss = thisthemedir.resolvePath('theme.css');
				var thisthemejs  = thisthemedir.resolvePath('theme.js');
				var thisthemeinfo= thisthemedir.resolvePath('info.js');

				// we need relative paths for the child sandbox
				var thistheme = {
					themename: thisthemename,
					themedir : appdir.getRelativePath(thisthemedir,true),
					themecss : appdir.getRelativePath(thisthemecss,true),
					themejs  : appdir.getRelativePath(thisthemejs,true),
					themeinfo: appdir.getRelativePath(thisthemeinfo,true)

				}

				themes.push(thistheme);
			}
		}

		return themes;
	}
	
	
	
	Spaz.Bridge.getRuntimeInfo = function(){
		return ret ={
			os : air.Capabilities.os,
			version: air.Capabilities.version, 
			manufacturer: air.Capabilities.manufacturer,
			totalMemory: air.System.totalMemory
		};
	}
	
	Spaz.Bridge.trace = function (msg){
		// var args = [];
		// 	
		// 	for(var i=0, l=arguments.length;i<l;i++)
		// 	{
		// 		args.push(arguments[i]);
		// 	}
		// 	
		// 	air.trace.apply(this, args);
		air.trace('Spaz.Bridge.trace:'+msg);
	}
	
	Spaz.Bridge.dump = function(msg, type){
		
		Spaz.Debug.dump(msg, type);
		
	}
	
	Spaz.Bridge.getUser = function(){
		if (Spaz.Prefs.user == false) {
			return '';
		}
		return Spaz.Prefs.user;
	}
	
	Spaz.Bridge.getPass = function(){
		if (Spaz.Prefs.pass == false) {
			return '';
		}
		return Spaz.Prefs.pass;
	}
	
	Spaz.Bridge.getRefreshInterval = function(){
		return Spaz.Prefs.refreshInterval;
	}
	
	Spaz.Bridge.parentWindowClosingHandler = function(){
		Spaz.Prefs.windowClosingHandler();
	
	}
	
	Spaz.Bridge.$windowClosingHandler = function(event){
		if (event) {
			//TODO: I disabled this
			//Cmd-q doesn't work with this tweak
			//event.preventDefault();
		}
		
		if(Spaz.Bridge.windowClosingHandler) {
			Spaz.Bridge.windowClosingHandler();
		}
			
	}
	
	Spaz.Bridge.setPrefs = function(){
		Spaz.Prefs.setPrefs();
		
	}

	Spaz.Bridge.setCurrentUser = function(){
		Spaz.Prefs.setCurrentUser();
	}
	
	Spaz.Bridge.checkRefreshPeriod = function(time){
		Spaz.Prefs.checkRefreshPeriod ( time );
	}
	
	Spaz.Bridge.checkWindowOpacity = function(percentage) {
		//alert(percentage);
		Spaz.Prefs.checkWindowOpacity(percentage);
	}
	
	Spaz.Bridge.setDebugEnable = function(state){
		Spaz.Debug.setEnable(state);
	}
	
	Spaz.Bridge.getVersion = function(){
		return Spaz.Info.getVersion();
	}
	
	Spaz.Bridge.startResize = function(){
		nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
	}
	
	Spaz.Bridge.startMove = function(){
		nativeWindow.startMove();
	}
	
	Spaz.Bridge.checkForUpdate = function(){
		Spaz.Update.updater.checkForUpdate();
	}
	
	
	Spaz.Bridge.startDownloadNewVersion = function(){
		Spaz.Update.updater.startDownloadNewVersion();
	}
	
	$ = function(id){
		return {
			val:function(){
				return Spaz.Bridge.val(id);
			}
		};
	}
	
	$.cookie = function(arg1, arg2){
		//return Spaz.Bridge.cookie(arg1, arg2);	
		alert('Cookie access deprecated');
	}
	
	Spaz.Bridge.setCheckUpdateState = function(state){
		Spaz.Update.setCheckUpdateState (state);
	}
	
	Spaz.Bridge.getCheckUpdate = function(){
		return Spaz.Update.checkUpdate==1;
	}


	Spaz.Bridge.makeWindowVisible = function(){
		Spaz.dump("making window visible");
		window.nativeWindow.visible = true;
	}
	Spaz.Bridge.makeWindowHidden = function(){
		Spaz.dump("making window hidden");
		window.nativeWindow.visible = false;
	}
	Spaz.Bridge.setWindowOpacity = function(percentage) {
		var val  = parseInt(percentage)/100;
		window.htmlControl.alpha = val;
	}

	// Window behaviors
	Spaz.Bridge.setMinimizeOnBackground = function(enable) {
		if (enable) {
			air.Shell.shell.addEventListener('deactivate', function() {
				window.nativeWindow.minimize();
			})
		}	
	};

	Spaz.Bridge.setRestoreOnActivate = function(enable) {
		if (enable) {
			air.Shell.shell.addEventListener('activate', function() {
				window.nativeWindow.restore();
			})
		}
	}

	Spaz.Bridge.displayContextMenu = function(event) {
		Spaz.Menus.displayContextMenu(event);
	}
	
	


	Spaz.Bridge.getClipboardText = function() {
		if(air.Clipboard.generalClipboard.hasFormat("text/plain")){
		    var text = air.Clipboard.generalClipboard.getData("text/plain");
			return text;
		} else {
			return '';
		}
	}

	Spaz.Bridge.setClipboardText = function(text) {
		//Spaz.dump('Current clipboard:'+Spaz.Bridge.getClipboardText());
		Spaz.dump('Copying "' + text + '" to clipboard');
		//air.Clipboard.generalClipboard.clear();
		//Spaz.dump('Cleared generalClipboard');
		//var rs = air.Clipboard.generalClipboard.setData(text, "text/plain", false);
		air.System.setClipboard(text);
		// if (!rs) {
// 			Spaz.dump('Copy to clipboard failed!');
// 		} else {
// 			Spaz.dump('Copy to clipboard succeeded!');
// 		}
		//Spaz.dump('Current clipboard:'+Spaz.Bridge.getClipboardText());
	}








	
}else{
	
/****************************************************
 we are in child iframe
/****************************************************/
	
	Spaz.Bridge.$init = function(callback){
		var bridge = {};
		
		//link every function from Spaz.Bridge to childSandboxBridge
		//this will enable calling them from parent iframe
		//do not link private functions (like this one - function name starts with $ sign)
		
		for(var i in Spaz.Bridge){
			if(i[0]!='$'){
				bridge[i]=Spaz.Bridge[i];
			}
		}
		
		childSandboxBridge = bridge;
		
		Spaz.Bridge.$callback = callback;
		
		//check if we got root loaded
		Spaz.Bridge.$checkParent();
		
		// this lets the Parent access the firebug console
		Spaz.Bridge.console = console;
		
	}
	
	Spaz.Bridge.$checkParent = function(){
		if(!parentSandboxBridge){
			setTimeout(Spaz.Bridge.$checkParent, 1);
		}else{
			//copy any function to Spaz.Bridge
			var bridge = parentSandboxBridge;
			
			for(var i in bridge){
				Spaz.Bridge[i]=bridge[i];
			}
			
			air = { trace: Spaz.Bridge.trace };

			//everything is ready - let root know about it
			bridge.triggerRemoteLoad();
			
			var callback = Spaz.Bridge.$callback;
			Spaz.Bridge.$callback = null;
			if(callback)
				callback();
		}
	}
	
	Spaz.Bridge.setUserStyleSheet = function(url) {
		Spaz.UI.userStyleSheet = url;
		$('#UserCSSOverride').attr('href',Spaz.UI.userStyleSheet);
		$('#prefs-user-stylesheet').val(Spaz.UI.userStyleSheet);
	}
	
	Spaz.Bridge.windowActiveHandler = function(){
		Spaz.UI.windowActiveHandler();
	}
	
	Spaz.Bridge.windowClosingHandler = function(event){
		if (event&&event.preventDefault) {
			event.preventDefault();
		}

		Spaz.UI.playSoundShutdown();

		Spaz.Bridge.parentWindowClosingHandler();
	}
	
	Spaz.Bridge.getUpdateInfo = function(){
		return {
			checkUpdate: Spaz.Update.checkUpdate
		};
	}
	Spaz.Bridge.getUIInfo = function(){
		return {
			userStyleSheet:		Spaz.UI.userStyleSheet,
			currentTheme:		Spaz.UI.currentTheme,
			playSounds:			Spaz.UI.playSounds,
			useMarkdown:		Spaz.UI.useMarkdown,
			hideAfterDelay:		Spaz.UI.hideAfterDelay,
			restoreOnUpdates:	Spaz.UI.restoreOnUpdates,
			minimizeToSystray:	Spaz.UI.minimizeToSystray,
			minimizeOnBackground:Spaz.UI.minimizeOnBackground,
			restoreOnActivate: 	Spaz.UI.restoreOnActivate,
		};
	}
	
	Spaz.Bridge.setUI = function(id, value){
		if("currentTheme, userStyleSheet, playSounds, useMarkdown, hideAfterDelay, restoreOnUpdates, minimizeToSystray, minimizeOnBackground, restoreOnActivate".indexOf(id)>-1){
			Spaz.UI[id]=value;
			Spaz.dump('setUI: Spaz.UI['+id+']='+value);
		}
	}
	
	Spaz.Bridge.val = function(id){
		return $(id).val();
	}
	
	Spaz.Bridge.cookie = function (arg1, arg2){
		// return $.cookie(arg1, arg2);
		alert('Cookie access deprecated')
	}
	
	Spaz.Bridge.verifyPassword = function(){
		Spaz.Data.verifyPassword();
	}

	Spaz.Bridge.consoleDump = function(msg, type){
		Spaz.Debug.$dump(msg, type);
	}
	
	Spaz.Bridge.insertDebugScripts = function(){
		var script = document.createElement('script');
		script.src = 'SpryAssets/SpryDebug.js';
		script.language = 'JavaScript';
		script.id = "debug-js";
		document.body.appendChild(script);
		
		var link = document.createElement('link');
		link.href = "SpryAssets/SpryDebug.css";
		link.rek = 'stylesheet';
		link.type = 'text/css';
		link.id = 'debug-css';
		document.body.appendChild(link);
		
		$('html').attr('debug', 'true');
	}
	
	Spaz.Bridge.updaterSetupUI = function(){
		Spaz.Update.updater.setupUI();
	}
	
	
	Spaz.Bridge.updaterSetupUIDiv = function(uiDiv){
		Spaz.Update.updater.uiDiv = uiDiv;
	}
	
	Spaz.Bridge.updaterHideUI = function(uiDiv){
		Spaz.Update.updater.uiDiv.style.display = "none";
	}
	
	Spaz.Bridge.updaterHandleUpgrade = function(str){
		Spaz.Update.updater.handleUpgrade(str);
	}
	
	Spaz.Bridge.updaterHandleDowngrade = function(){
		Spaz.Update.updater.handleDowngrade();
	}
	
	Spaz.Bridge.updaterHandleNoUpgrade = function(){
		Spaz.Update.updater.handleNoUpgrade();
	}
	
	Spaz.Bridge.hideLoading = function(){
		Spaz.UI.hideLoading();
	}
	
	Spaz.Bridge.statusBar = function(str){
		Spaz.UI.statusBar ( str);
	}
	
	Spaz.Bridge.setPrefsFormVal = function(id, val) {
		$('#'+id).val(val);
	}
	
	// BEGIN NATIVEMENU HOOKS
	Spaz.Bridge.menuReload = function() {
		Spaz.dump('in Spaz.Bridge.menuReload');
		Spaz.UI.reloadCurrentTab();
		Spaz.restartReloadTimer();
	};
	
	
	Spaz.Bridge.menuPrefs  = function() {
		Spaz.dump('in Spaz.Bridge.menuPrefs');
		Spaz.UI.setSelectedTab(7);
		Spaz.UI.tabbedPanels.showPanel(7);
	};
	
	
	Spaz.Bridge.menuAbout = function() {
		Spaz.UI.showAbout();
	}
	
	Spaz.Bridge.menuHelp = function() {
		Spaz.UI.showHelp();
	}
	
	Spaz.Bridge.menuFeedback = function() {
		Spaz.UI.prepReply('spaz');
	}
	
	// END NATIVEMENU HOOKS
	
	// Spaz.Bridge.menuCheckForUpdates = function() {
	// 	
	// }
	
	
	
}