if (!Spaz.Themes) Spaz.Themes = {};

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
	//TODO: cannot access files outside sandbox
	//alert('User CSS not yet working');
	Spaz.dump(event.target.url);
	var stylestr = Spaz.Themes.loadUserStylesFromURL(event.target.url)
	Spaz.dump(stylestr);
	Spaz.Themes.setUserStyleSheet(stylestr, event.target.url);
}


Spaz.Themes.setUserStyleSheet = function(stylestr, url) {
	Spaz.UI.userStyleSheet = url;
	$('#UserCSSOverride').text(stylestr);
	// $('#UserCSSOverride').attr('href', url);
	$('#prefs-user-stylesheet').val(Spaz.UI.userStyleSheet);
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
		//Spaz.Bridge.setUserStyleSheet(stylestr);
	} else {
		alert('chosen file '+ event.target/url +'does not exist')
		return false;
	}
}


Spaz.Themes.getThemePaths = function() {
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