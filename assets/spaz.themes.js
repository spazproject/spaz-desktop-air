if (!Spaz.Themes) Spaz.Themes = {};

// placeholder for themes object
Spaz.Themes.themes = {};

// initializer
Spaz.Themes.init = function() {
	Spaz.Themes.themes = Spaz.Themes.getThemePaths();
	for(x in Spaz.Themes.themes) {
		$('head').append('<link href="'+Spaz.Themes.themes[x].themecss+'" title="'+Spaz.Themes.themes[x].themename+'" rel="stylesheet" type="text/css" />');
	}
	
	// build the dropdown menu
	$('#theme-basetheme').empty();


	/**
	* Styleswitch stylesheet switcher built on jQuery
	* Under an Attribution, Share Alike License
	* By Kelvin Luck ( http://www.kelvinluck.com/ )
	**/
	$('link[@rel*=style][@title]').each(function(i){
		var title = this.getAttribute('title');
		$('#theme-basetheme').append('<option value="'+title+'">'+title+'</option>');
		Spaz.dump("css:"+this.title);
	});

	$('#theme-basetheme').val(Spaz.Prefs.get('theme-basetheme'));
	Spaz.Themes.setCurrentTheme();
};



Spaz.Themes.browseForUserCss = function() {
	Spaz.dump('Spaz.Themes.browseForUserCss');
	// var cssFilter = new air.FileFilter("StyleSheets", "~~.css;");
	// var imagesFilter = new air.FileFilter("Images", "~~.jpg;~~.gif;~~.png");
	// var docFilter = new air.FileFilter("Documents", "~~.pdf;~~.doc;~~.txt");
	var userFile = new air.File();
	userFile.browseForOpen("Choose User CSS File");
	userFile.addEventListener(air.Event.SELECT, Spaz.Themes.userCSSSelected);
}


Spaz.Themes.userCSSSelected = function(event) {
	Spaz.dump(event.target.url);
	var stylestr = Spaz.Themes.loadUserStylesFromURL(event.target.url)
	Spaz.dump(stylestr);
	Spaz.Themes.setUserStyleSheet(stylestr, event.target.url);
}


Spaz.Themes.setUserStyleSheet = function(stylestr, url) {
	Spaz.Prefs.get('theme-userstylesheet') = url;
	$('#UserCSSOverride').text(stylestr);
	$('#user-stylesheet').val(Spaz.Prefs.get('theme-userstylesheet'));
}



Spaz.Themes.loadUserStylesFromURL = function(fileurl) {
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
	} else {
		Spaz.UI.alert('chosen file '+ event.target/url +'does not exist')
		return false;
	}
}



/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/
Spaz.Themes.setCurrentTheme = function() {	
	Spaz.dump('current theme:' + Spaz.Prefs.get('theme-basetheme'));
	$('link[@rel*=style][@title]').each(function(i) {
		this.disabled = true;
		Spaz.dump(this.getAttribute('title') + " is now disabled");
		if (this.getAttribute('title') == Spaz.Prefs.get('theme-basetheme')) {
			this.disabled = false;
			Spaz.dump(this.getAttribute('title') + " is now enabled");
		}
	});

	$('img.tab-icon, #loading img, .status-actions img').each(function(i) {
		this.src = this.src.replace(/\{theme-dir\}/, 'themes/'+Spaz.Prefs.get('theme-basetheme'));
	});

}


Spaz.Themes.getThemePaths = function() {
	var appdir    = air.File.applicationDirectory;
	var themesdir = appdir.resolvePath('themes');
	var appStore  = air.File.applicationStorageDirectory;
	var userthemesdir = appStore.resolvePath('userthemes');
	
	// we load from both the built-in themes dir and the userthemes dir
	var list = themesdir.getDirectoryListing().concat(userthemesdir.getDirectoryListing())
	
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
				themeinfo: thisthemeinfo.url
			}
			
			// sanity check to make sure the themedir actually has something in it
			if (thisthemecss.exists) {
				themes.push(thistheme);
			}
		}
	}

	return themes;
}



Spaz.Themes.getPathByName = function(themename) {
	for (i = 0; i < Spaz.Themes.themes.length; i++) {
		if (Spaz.Themes.themes[i].themename == themename) {
			return Spaz.Themes.themes[i].themedir;
		}
	}
	return null;
}


