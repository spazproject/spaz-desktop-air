var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Bridge
************/
if (!Spaz.Bridge) Spaz.Bridge = {};

//check if we are in root sandbox
if(typeof runtime!='undefined'){
	
	Spaz.dump('parent bridge');	
	Spaz.Bridge.$child = null;	


	Spaz.Bridge.$init = function(iframe){

		var bridge = {};
		
		//link every function from Spaz.Bridge to parentSandboxBridge
		//this will enable calling them from child iframe
		//do not link private functions (like this one - function name starts with $ sign)
		
		for(var i in Spaz.Bridge){
			if(i[0]!='$')
			{
				Spaz.dump('Mapping Parent Bridge Func '+i);
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
			Spaz.dump('Mapping Child Bridge Func '+i);
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


	Spaz.Bridge.getCapabilities = function(key) {
		return air.Capabilities[key];
	}


	Spaz.Bridge.navigateToURL = function (url) {
		var request = new air.URLRequest(url);
		try {            
		    air.navigateToURL(request);
		}
		catch (e) {
		    Spaz.dump(e.errorMsg)
		}
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
			s.addEventListener(air.Event.SOUND_COMPLETE, Spaz.Bridge.$onSoundPlaybackComplete);
		}
		s.addEventListener(air.Event.SOUND_COMPLETE, Spaz.Bridge.makeWindowVisible);
		
	}
	
	
	Spaz.Bridge.$onSoundPlaybackComplete = function(event) {
		Spaz.dump("The sound has finished playing.");
	}

	
	Spaz.Bridge.browseForUserCss = function() {
		Spaz.dump('Spaz.Bridge.browseForUserCss');
		// var cssFilter = new air.FileFilter("StyleSheets", "~~.css;");
		// var imagesFilter = new air.FileFilter("Images", "~~.jpg;~~.gif;~~.png");
		// var docFilter = new air.FileFilter("Documents", "~~.pdf;~~.doc;~~.txt");
		var userFile = new air.File();
		userFile.browseForOpen("Choose User CSS File");
		userFile.addEventListener(air.Event.SELECT, Spaz.Bridge.$userCSSSelected);
	}
	

	Spaz.Bridge.$userCSSSelected = function(event) {
		//TODO: cannot access files outside sandbox
		//alert('User CSS not yet working');
		Spaz.dump(event.target.url);
		var stylestr = Spaz.Bridge.loadUserStylesFromURL(event.target.url)
		Spaz.dump(stylestr);
		Spaz.Bridge.setUserStyleSheet(stylestr, event.target.url);
	}
	
	
	Spaz.Bridge.loadUserStylesFromURL = function(fileurl) {
		var usercssfile = new air.File(fileurl);
		Spaz.dump('NativePath:' + usercssfile.nativePath);
		
		var stream = new air.FileStream();
		if (usercssfile.exists) {
			Spaz.dump('opening stream')
			stream.open(usercssfile, air.FileMode.READ);
			Spaz.dump('readUTFBytes')
			stylestr = stream.readUTFBytes(stream.bytesAvailable);
			Spaz.dump(stylestr)
			return stylestr;
			//Spaz.Bridge.setUserStyleSheet(stylestr);
		} else {
			alert('chosen file '+ event.target/url +'does not exist')
			return false;
		}
	}
	
	
	Spaz.Bridge.getThemePaths = function() {
		var appdir    = air.File.applicationDirectory;
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
				
				// sanity check to make sure the themedir actually has something in it
				if (thisthemecss.exists) {
					themes.push(thistheme);
				}
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
		// 	Spaz.dump.apply(this, args);

		// air.Introspector.Console.log(msg)

		var now = new Date().toUTCString();
		air.trace('['+now+']Spaz.Bridge.trace:'+msg);
	}
	
	Spaz.Bridge.dump = function(msg, type){
		
		Spaz.Debug.dump(msg, type);
		
	}
	
	Spaz.Bridge.getUser = function(){
		if (Spaz.Prefs.user == 'false') {
			return '';
		}
		return Spaz.Prefs.user;
	}
	
	Spaz.Bridge.getPass = function(){
		if (Spaz.Prefs.pass == 'false') {
			return '';
		}
		return Spaz.Prefs.pass;
	}
	
	Spaz.Bridge.getRefreshInterval = function(){
		return Spaz.Prefs.refreshInterval;
		// return 1000*5;
	}
	
	Spaz.Bridge.getHandleHTTPAuth = function() {
		return Spaz.Prefs.handleHTTPAuth;
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
	
	Spaz.Bridge.setHandleHTTPAuth = function(state) {
		Spaz.Prefs.setHandleHTTPAuth(state);
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


	Spaz.Bridge.minimizeWindow = function() {
		window.nativeWindow.minimize();
		if (Spaz.Bridge.getUIInfo().minimizeToSystray && Spaz.Bridge.supportsSystrayIcon()) {
			window.nativeWindow.visible = false;
		}
		return false;
	}
	
	Spaz.Bridge.restoreWindow = function() {
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
		window.htmlLoader.alpha = val;
	}
	
	Spaz.Bridge.supportsSystrayIcon = function() {
		return air.NativeApplication.supportsSystemTrayIcon;
	};

	// Window behaviors
	Spaz.Bridge.setMinimizeOnBackground = function(enable) {
		if (enable) {
			air.NativeApplication.nativeApplication.addEventListener('deactivate', function() {
				//window.nativeWindow.minimize();
				Spaz.Bridge.windowMinimize();
			})
		}	
	};

	Spaz.Bridge.setRestoreOnActivate = function(enable) {
		if (enable) {
			air.NativeApplication.nativeApplication.addEventListener('activate', function() {
				//window.nativeWindow.restore();
				Spaz.Bridge.windowRestore();
			})
		}
	}

	Spaz.Bridge.displayContextMenu = function(event) {
		Spaz.Menus.displayContextMenu(event);
	}
	
	

	Spaz.Bridge.dumpHTML = function() {
		var docsDir = air.File.documentsDirectory;
		try {
			docsDir.browseForSave("Save HTML As");
			docsDir.addEventListener(air.Event.SELECT, Spaz.Bridge.dumpHTMLSelectListener);
		} catch (error) {
			Spaz.dump("Failed:"+error.message, 'error');
		}
	};
	
	Spaz.Bridge.dumpHTMLSelectListener = function(event) {
		var newFile = event.target;
		alert('got newFile '+newFile.url);
		var str = Spaz.Bridge.getChildFrameHTML();
		alert('got string '.str);

		var stream = new air.FileStream();
		alert('made stream ');
		stream.open(newFile, air.FileMode.UPDATE);
		alert('opened stream '+newFile.url);
		stream.writeUTFBytes(str);
		alert('write utfbytes '+str);
		stream.close();
		alert('close stream')

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


	Spaz.Bridge.notify = function(message, title, where, duration, icon) {		
		if (Spaz.Bridge.getUIInfo().showNotificationPopups) {
			Spaz.Notify.add(message, title, where, duration, icon);
		} else {
			Spaz.dump('not showing notification popup - Spaz.UI.showNotificationPopups disabled');
		}
	}


	
}else{
	
/****************************************************
 we are in child iframe
/****************************************************/
	
	// Spaz.dump('child bridge');	
	
	Spaz.Bridge.$init = function(callback){
		var bridge = {};
		
		// console.open()
		// console.log('child iframe Spaz.Bridge.init');
		
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

			try {
				//everything is ready - let root know about it
				Spaz.Bridge.triggerRemoteLoad();

				var callback = Spaz.Bridge.$callback;
				Spaz.Bridge.$callback = null;
				if(callback)
					callback();
			} catch(e) {
				//Spaz.dump('there was an error calling Spaz.Bridge.triggerRemoteLoad. Setting timeout again');
				setTimeout(Spaz.Bridge.$checkParent, 1);
			}
		}
	}
	
	Spaz.Bridge.setUserStyleSheet = function(stylestr, url) {
		Spaz.UI.userStyleSheet = url;
		$('#UserCSSOverride').text(stylestr);
		// $('#UserCSSOverride').attr('href', url);
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
			showNotificationPopups:Spaz.UI.showNotificationPopups,
		};
	}
	
	Spaz.Bridge.setUI = function(id, value){
		if("currentTheme, userStyleSheet, playSounds, useMarkdown, hideAfterDelay, restoreOnUpdates, minimizeToSystray, minimizeOnBackground, restoreOnActivate, showNotificationPopups".indexOf(id)>-1){
			Spaz.UI[id]=value;
			Spaz.dump('setUI: Spaz.UI['+id+']='+value);
		}
	}
	
	Spaz.Bridge.windowMinimize = function() {
		Spaz.UI.windowMinimize();
	}
	
	Spaz.Bridge.windowRestore = function() {
		Spaz.dump('in Spaz.Bridge.windowRestore (from Parent)');
		Spaz.UI.windowRestore();
	}
	
	
	
	Spaz.Bridge.val = function(id){
		Spaz.dump('getting $('+id+').val()');
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
	
	Spaz.Bridge.menuClearTimeline = function() {
		Spaz.dump('in Spaz.Bridge.menuClearTimeline');
		Spaz.UI.clearCurrentTimeline();
		Spaz.UI.reloadCurrentTab();
		Spaz.restartReloadTimer();
	};
	
	Spaz.Bridge.menuPrefs  = function() {
		Spaz.dump('in Spaz.Bridge.menuPrefs');
		Spaz.UI.setSelectedTab(document.getElementById('tab-prefs'));
		Spaz.UI.tabbedPanels.showPanel('tab-prefs');
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
	
	Spaz.Bridge.getChildFrameHTML= function() {
		var html = $('html')[0].outerHTML;
		html = html.replace(/app:\/\//, '');
		html = html.replace(/onclick="Spaz\.UI\.setSelectedTab\(this\)"/, '');
		return html;
	};
	// END NATIVEMENU HOOKS
	
	// Spaz.Bridge.menuCheckForUpdates = function() {
	// 	
	// }
	
	
	
}