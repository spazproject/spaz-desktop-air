var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.File
************/
if (!Spaz.File) Spaz.File = {};

Spaz.File.getApplicationFile = function() {
	var appFile = air.File.applicationDirectory;
	// for debugging environment
	appFile = appFile.resolvePath("application.xml");
	if (!appFile.exists) {
		appFile = air.File.applicationDirectory;
		// for "compiled" environment
		appFile = appFile.resolvePath("META-INF/AIR/application.xml");
	}
	
	if (!appFile.exists) {
		Spaz.dump("appFile not found");
		return false
	} else {
		return appFile
	}
};



Spaz.File.browseForUserCss = function() {
	Spaz.dump('Spaz.File.browseForUserCss');
	// var cssFilter = new air.FileFilter("StyleSheets", "~~.css;");
	// var imagesFilter = new air.FileFilter("Images", "~~.jpg;~~.gif;~~.png");
	// var docFilter = new air.FileFilter("Documents", "~~.pdf;~~.doc;~~.txt");
	var userFile = new air.File();
	userFile.browseForOpen("Choose User CSS File");
	userFile.addEventListener(air.Event.SELECT, Spaz.File.$userCSSSelected);
}


Spaz.File.$userCSSSelected = function(event) {
	//TODO: cannot access files outside sandbox
	//alert('User CSS not yet working');
	Spaz.dump(event.target.url);
	var stylestr = Spaz.File.loadUserStylesFromURL(event.target.url)
	Spaz.dump(stylestr);
	Spaz.File.setUserStyleSheet(stylestr, event.target.url);
}


Spaz.File.loadUserStylesFromURL = function(fileurl) {
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
		//Spaz.File.setUserStyleSheet(stylestr);
	} else {
		alert('chosen file '+ event.target/url +'does not exist')
		return false;
	}
}


Spaz.File.getThemePaths = function() {
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


