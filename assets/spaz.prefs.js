var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Prefs) Spaz.Prefs = {};

Spaz.Prefs.defaultPreferences = {
	'usemarkdown':true,

	'window-x':250,
	'window-y':250,
	'window-width':275,
	'window-height':600,
	'window-alpha':100,
	'window-hideafterdelay':true,
	'window-restoreonupdates':true,
	'window-shownotificationpopups':true,
	'window-minimizetosystray':true,
	'window-minimizeonbackground':false,
	'window-restoreonactivate':true,
	
	'window-notificationposition':'topRight',
	'window-notificationhidedelay':6000,
	
	'window-showcontextmenus':true,
	'window-tooltiphidedelay':8000,
	
	'theme-userstylesheet':null,
	'theme-basetheme':'spaz',

	'sound-enabled':true,
	
	'network-refreshinterval'  : 300000,
	'network-airhandlehttpauth': false,
	
	'debug-enabled':false,
	
	
	'sound-update'	: '/assets/sounds/TokyoTrainStation/Csnd.mp3',
	'sound-startup'	: '/assets/sounds/TokyoTrainStation/On.mp3',
	'sound-shutdown': '/assets/sounds/TokyoTrainStation/Off.mp3',
	'sound-new'		: '/assets/sounds/TokyoTrainStation/New.mp3',
	'sound-wilhelm'	: '/assets/sounds/wilhelm.mp3',
	
	
	
	'checkupdate':true,
}






// this maps methods to pref keys that should be
// called when they are changed
Spaz.Prefs.changeMethods = {
	'usemarkdown':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#usemarkdown').attr('checked', value);
		},
		change: function(value) {

		}
	},

	'window-x':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
		},
		change: function(value) {
		}
	},
	'window-y':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly

		},
		change: function(value) {

		}
	},
	'window-width':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly

		},
		change: function(value) {

		}
	},
	'window-height':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly

		},
		change: function(value) {

		}
	},
	'window-alpha':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#window-alpha').val(parseInt(value));
		},
		change: function(value) {
			//alert(percentage+"%");
			percentage = parseInt(value);
			if (isNaN(percentage)) {
				percentage = 100;
			}
			if (percentage < 25) {
				percentage = 25;
			}
			var val = parseInt(percentage)/100;
			if (isNaN(val)){
				val = 1;
			} else if (val >= 1) {
				val = 1;
			} else if (val <= 0) {
				val = 1;
			}

			window.htmlLoader.alpha = val;
		}
	},
	'window-hideafterdelay':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
		},
		change: function(value) {
		}
	},
	'window-restoreonupdates':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
		},
		change: function(value) {
		}
	},
	'window-shownotificationpopups':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#window-shownotificationpopups').attr('checked', value);
		},
		change: function(value) {
		}
	},
	'window-minimizetosystray':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#window-minimizetosystray').attr('checked', value);
		},
		change: function(value) {

		}
	},
	'window-minimizeonbackground':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#window-minimizeonbackground').attr('checked', value);
		},
		change: function(value) {
			if (value) {
				air.NativeApplication.nativeApplication.addEventListener('deactivate', function() {
					//window.nativeWindow.minimize();
					Spaz.Windows.windowMinimize();
				})
			}
		}
	},
	'window-restoreonactivate':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#window-restoreonactivate').attr('checked', value);
		},
		change: function(value) {
			if (value) {
				air.NativeApplication.nativeApplication.addEventListener('activate', function() {
					//window.nativeWindow.restore();
					Spaz.Windows.windowRestore();
				})
			}
		}
	},


	'theme-userstylesheet':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#theme-userstylesheet').val(Spaz.Prefs.get('theme-userstylesheet'));
		},
		change: function(value) {
			if (value) {
				$('#UserCSSOverride').text(Spaz.Themes.loadUserStylesFromURL(value));
			}
		}
	},
	'theme-basetheme':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly

		},
		change: function(value) {

		}
	},

	'sound-enabled':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#sound-enabled').attr('checked', value);
		},
		change: function(value) {
		}
	},

	'network-refreshinterval'  : {
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#network-refreshinterval').val(parseInt(value)/60000);
		},
		change: function(value) {

		}
	},
	'network-airhandlehttpauth': {
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#network-airhandlehttpauth').attr('checked', value);
		},
		change: function(value) {
			air.trace('Setting HTTPAuth handling to '+value)
			window.htmlLoader.authenticate = value;
		}
	},


	'checkupdate':{
		setUI: function(value){  // this is called when the prefs are first loaded to set the UI properly
			$('#checkupdate').attr('checked', value);
		},
		change: function(value) {

		}
	}
}







Spaz.Prefs.init = function() {
	Spaz.Prefs.preferences = Spaz.Prefs.defaultPreferences;
	Spaz.Prefs.loadPrefs();
	Spaz.Prefs.initUI();
}


Spaz.Prefs.loadPrefs = function() {
	var prefsFile = air.File.applicationStorageDirectory;
	prefsFile = prefsFile.resolvePath("preferences.json");
	
	var fs = new air.FileStream();
	
	if (prefsFile.exists) {
		fs.open(prefsFile, air.FileMode.READ);
		var prefsJSON = fs.readUTFBytes(prefsFile.size);
		air.trace(prefsJSON)
		Spaz.Prefs.preferences = JSON.parse(prefsJSON);
	} else {
		fs.open(prefsFile, air.FileMode.WRITE);
		fs.writeUTFBytes(JSON.stringify(Spaz.Prefs.defaultPreferences));
		Spaz.Prefs.preferences = Spaz.Prefs.defaultPreferences;
	}
	fs.close()
	
	air.trace(Spaz.Prefs.loadUsername());
	air.trace(Spaz.Prefs.loadPassword());
		
};



Spaz.Prefs.initUI = function() {
	for(pkey in Spaz.Prefs.preferences) {
		//air.trace(pkey);
		if (Spaz.Prefs.changeMethods[pkey]) {
			if (Spaz.Prefs.changeMethods[pkey].setUI) {
				Spaz.Prefs.changeMethods[pkey].setUI(Spaz.Prefs.get(pkey));
			}
			if (Spaz.Prefs.changeMethods[pkey].change) {
				Spaz.Prefs.changeMethods[pkey].change(Spaz.Prefs.get(pkey));
			}
		}
		$('#username').val(Spaz.Prefs.getUser());
		//air.trace('set #username val to'+$('#username').val());
		$('#password').val(Spaz.Prefs.getPass());
	}
};



Spaz.Prefs.savePrefs = function() {
	var jsonPrefs = JSON.stringify(Spaz.Prefs.preferences);
	air.trace(jsonPrefs);

	var prefsFile = air.File.applicationStorageDirectory;
	prefsFile = prefsFile.resolvePath("preferences.json");
	
	var fs = new air.FileStream();
	
	fs.open(prefsFile, air.FileMode.WRITE);
	fs.writeUTFBytes(JSON.stringify(Spaz.Prefs.preferences));
	fs.close();
	
	Spaz.Prefs.saveUsername();
	Spaz.Prefs.savePassword();
};


Spaz.Prefs.resetPrefs = function() {
	Spaz.Prefs.preferences = Spaz.Prefs.defaultPreferences;
	Spaz.Prefs.savePrefs();
};


Spaz.Prefs.get = function(key) {
	// air.trace("Getting pref key '"+key+"'");
	// air.trace("Value is "+Spaz.Prefs.preferences[key]);
	return Spaz.Prefs.preferences[key];
};


Spaz.Prefs.set = function(key, value) {
	//air.trace("Setting pref key '"+key+"'="+value);
	Spaz.Prefs.preferences[key] = value;
};



/**
* Called when the user closes the window.
*/
Spaz.Prefs.windowClosingHandler = function() 
{
	nativeWindow.removeEventListener("closing", Spaz.Prefs.windowClosingHandler);
	Spaz.Prefs.savePrefs();
	air.NativeApplication.nativeApplication.exit();
}


Spaz.Prefs.saveUsername = function() {
	if (Spaz.Prefs.user) {
		air.trace('saving username: '+Spaz.Prefs.user);
		var bytes = new air.ByteArray();
		bytes.writeUTFBytes(Spaz.Prefs.user);
		air.EncryptedLocalStore.setItem('twitter_username_1', bytes);
	}
};

Spaz.Prefs.loadUsername = function() {
	Spaz.dump('loading username');
	var storedValue = air.EncryptedLocalStore.getItem('twitter_username_1');
	if (storedValue) {
		Spaz.Prefs.user = storedValue.readUTFBytes(storedValue.length);
		return Spaz.Prefs.user;
	} else {
		air.trace('Username COULD NOT BE LOADED');
		return false;
	}
};

Spaz.Prefs.savePassword = function() {
	if (Spaz.Prefs.pass) {
		air.trace('saving password: ********');
		var bytes = new air.ByteArray();
		bytes.writeUTFBytes(Spaz.Prefs.pass);
		air.EncryptedLocalStore.setItem('twitter_password_1', bytes);
	}
};

Spaz.Prefs.loadPassword = function() {
	Spaz.dump('loading password');
	var storedValue = air.EncryptedLocalStore.getItem('twitter_password_1');
	if (storedValue) {
		Spaz.Prefs.pass = storedValue.readUTFBytes(storedValue.length);
		return Spaz.Prefs.pass;
	} else {
		air.trace('Password COULD NOT BE LOADED');
		return false;
	}
};

Spaz.Prefs.setPrefs = function() {
	Spaz.Data.verifyPassword();
}

Spaz.Prefs.setCurrentUser = function() {
	air.trace($('#username').val() + ':' + $('#password').val())
	Spaz.Prefs.user = $('#username').val();
	Spaz.Prefs.pass = $('#password').val();
	
	Spaz.dump('set new username and pass ('+Spaz.Prefs.user+')');
	
	Spaz.Prefs.saveUsername();
	Spaz.Prefs.savePassword();
	
	Spaz.dump('saved data');
}


Spaz.Prefs.setHandleHTTPAuth = function(state) {
	Spaz.dump(state);
	if (state) {
		Spaz.Prefs.handleHTTPAuth = 1
		window.htmlLoader.shouldAuthenticate = true;
	} else {
		Spaz.Prefs.handleHTTPAuth = 0;
		window.htmlLoader.shouldAuthenticate = false;
	}
	Spaz.dump(Spaz.Prefs.handleHTTPAuth);
	Spaz.dump(window.htmlLoader.shouldAuthenticate);
}

Spaz.Prefs.setDebugEnable = function(state){
	Spaz.Debug.setEnable(state);
}


Spaz.Prefs.checkRefreshPeriod = function(val) {
	val = parseInt(val);
	if (val < 1) {
		val = 1;
	} else if (val > 60) {
		val = 60;
	}
	
	// convert msecs to minutes
	Spaz.Prefs.set('network-refreshinterval', val*60000);
	//Spaz.UI.setPrefsFormVal('prefs-refresh-interval', val);
}


Spaz.Prefs.checkWindowOpacity = function(percentage) {
	//alert(percentage+"%");
	percentage = parseInt(percentage);
	if (isNaN(percentage)) {
		percentage = 100;
	}
	if (percentage < 25) {
		percentage = 25;
	}
	var val = parseInt(percentage)/100;
	if (isNaN(val)){
		val = 1;
	} else if (val >= 1) {
		val = 1;
	} else if (val <= 0) {
		val = 1;
	}
	
	window.htmlLoader.alpha = val;
	
	Spaz.Prefs.set('window-alpha', percentage);
	// Spaz.UI.setPrefsFormVal('prefs-opacity-percentage', Spaz.Prefs.windowOpacity);
}









Spaz.Prefs.getUser = function(){
	if (Spaz.Prefs.user == 'false') {
		return '';
	}
	return Spaz.Prefs.user;
}

Spaz.Prefs.getPass = function(){
	if (Spaz.Prefs.pass == 'false') {
		return '';
	}
	return Spaz.Prefs.pass;
}

Spaz.Prefs.getRefreshInterval = function(){
	return Spaz.Prefs.get('network-refreshinterval');
	// return 1000*5;
}

Spaz.Prefs.getHandleHTTPAuth = function() {
	return Spaz.Prefs.get('network-airhandlehttpauth');
}
