if (!Spaz.Themes) Spaz.Themes = {};

// placeholder for themes object
Spaz.Themes.themes = {};

Spaz.Themes.validThemes = ['spaz', 'Leopaz', 'Terminal64'];


// initializer
Spaz.Themes.init = function() {
	Spaz.Themes.themes = Spaz.Themes.getThemePaths();
	for(x in Spaz.Themes.themes) {
		if (Spaz.Themes.validThemes.indexOf(Spaz.Themes.themes[x].themename) != -1)
		$('head').append('<link href="'+Spaz.Themes.themes[x].themecss+'" title="'+Spaz.Themes.themes[x].themename+'" rel="stylesheet" type="text/css" />');
	}

	// build the dropdown menu
	$('#theme-basetheme').empty();


	/**
	* Styleswitch stylesheet switcher built on jQuery
	* Under an Attribution, Share Alike License
	* By Kelvin Luck ( http://www.kelvinluck.com/ )
	**/
	$('link[rel*=style][title]').each(function(i){
		var title = this.getAttribute('title');
		$('#theme-basetheme').append('<option value="'+title+'">'+title+'</option>');
		sch.debug("css:"+this.title);
	});

	$('#theme-basetheme').val(Spaz.Prefs.get('theme-basetheme'));
	Spaz.Themes.setCurrentTheme();

	// load theme JS files
	var themeObj = Spaz.Themes.getThemeObject(Spaz.Prefs.get('theme-basetheme'));
	if (themeObj) {
		$('#themeinfo').attr('src', themeObj.themeinfo);
		$('#themejs').attr('src', themeObj.themejs);
	}
	

	// make the element to contain user CSS
	$('head').append('<style type="text/css" media="screen" id="UserCSSOverride"></style>');

	// load the user.css file
	Spaz.Themes.loadUserCSS();
};

Spaz.Themes.browseForUserCss = function() {
	var cssFilter = new air.FileFilter("StyleSheets", "*.css;");
	var userFile = new air.File();
	userFile.browseForOpen("Choose a CSS file", [cssFilter]);
	userFile.addEventListener(air.Event.SELECT, Spaz.Themes.userCSSSelected);
};

Spaz.Themes.userCSSSelected = function(event) {
	sch.debug(event.target.url);
	var stylestr = Spaz.Themes.loadUserStylesFromURL(event.target.url);
	sch.debug(stylestr);
	Spaz.Themes.setUserStyleSheet(stylestr, event.target.url);
};

Spaz.Themes.setUserStyleSheet = function(stylestr, url) {
	Spaz.Prefs.set('theme-userstylesheet', url);
	$('#UserCSSOverride').text(stylestr);
	// $('#user-stylesheet').val(Spaz.Prefs.get('theme-userstylesheet'));

	// save the userstylesheet to the user's css file
	var csspath = Spaz.Themes.getUserCSSFile().url;
	Spaz.Sys.setFileContents(csspath, stylestr);
};


Spaz.Themes.loadUserCSS = function() {

	var usercssfile = Spaz.Themes.getUserCSSFile();

	if (usercssfile.exists) {
		$('#UserCSSOverride').text(Spaz.Themes.loadUserStylesFromURL(usercssfile.url));
	}

};


Spaz.Themes.getUserCSSFile = function() {
	return air.File.applicationStorageDirectory.resolvePath('user.css');
};


Spaz.Themes.loadUserStylesFromURL = function(fileurl) {
	return Spaz.Sys.getFileContents(fileurl);
};


Spaz.Themes.loadThemeInfo = function(fileurl) {
	var json = Spaz.Sys.getFileContents(fileurl);
	if (json) {
		return sch.deJSON(json);
	} else {
		return false;
	}
};



Spaz.Themes.clearUserStyleSheet = function() {
	Spaz.Prefs.set('theme-userstylesheet', '');
	$('#UserCSSOverride').text('');
};




/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/
Spaz.Themes.setCurrentTheme = function() {
	
	
	sch.debug('current theme:' + Spaz.Prefs.get('theme-basetheme'));
	$('link[rel*=style][title]').each(function(i) {
		this.disabled = true;
		sch.debug(this.getAttribute('title') + " is now disabled");
		if (this.getAttribute('title') == Spaz.Prefs.get('theme-basetheme')) {
			this.disabled = false;
			sch.debug(this.getAttribute('title') + " is now enabled");
		}
	});

	// change the paths for embedded imgs
	$('img.tab-icon, #loading img, .status-actions img').each(function(i) {
		this.src = this.src.replace(/\{theme-dir\}/, Spaz.Prefs.get('theme-basetheme'));
	});

};


Spaz.Themes.getThemePaths = function() {
	var appdir    = air.File.applicationDirectory;
	var themesdir = appdir.resolvePath('themes');
	var appStore  = air.File.applicationStorageDirectory;
	var userthemesdir = appStore.resolvePath(USERDIR_THEMES);

	// we load from both the built-in themes dir and the userthemes dir
	var list = themesdir.getDirectoryListing().concat(userthemesdir.getDirectoryListing());

	var themes = new Array();
	for (i = 0; i < list.length; i++) {
		if (list[i].isDirectory) {

			var thisthemedir = list[i];
			var thisthemename= thisthemedir.name;
			var thisthemecss = thisthemedir.resolvePath('theme.css');
			var thisthemejs  = thisthemedir.resolvePath('theme.js');
			var thisthemeinfo= thisthemedir.resolvePath('info.js');


			var thistheme = {
				themename: thisthemename,
				themedir : thisthemedir.url,
				themecss : thisthemecss.url,
				themejs  : thisthemejs.url,
				themeinfo: Spaz.Themes.loadThemeInfo(thisthemeinfo.url)
			};

			// sanity check to make sure the themedir actually has something in it
			if (thisthemecss.exists) {
				themes.push(thistheme);
			}
		}
	}

	return themes;
};


Spaz.Themes.getThemeObject = function(themename) {
	for (i = 0; i < Spaz.Themes.themes.length; i++) {
		// sch.dump(JSON.stringify(Spaz.Themes.themes[i]))
		if (Spaz.Themes.themes[i].themename == themename) {
			// sch.dump('same');
			return Spaz.Themes.themes[i];
		}
	}
	return false;
};


Spaz.Themes.getPathByName = function(themename) {
	// sch.dump('Looking for:'+themename);
	var themeObj = Spaz.Themes.getThemeObject(themename);
	if (themeObj) {
		return themeObj.thisthemedir;
	} else {
		return false;
	}
};
