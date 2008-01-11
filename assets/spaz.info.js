var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Info
************/
if (!Spaz.Info) Spaz.Info = {};

Spaz.Info.getVersion = function() {
	
	// var fs = new air.FileStream()
	// 	var appFile = Spaz.File.getApplicationFile();
	// 	if (appFile) {
		// fs.open(appFile, air.FileMode.READ);
		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor
		// Spaz.dump(appXML)
		// fs.close();
		
		var domParser = new DOMParser();
		appXML = domParser.parseFromString(appXML, "text/xml");
		// var appTag = appXML.getElementsByTagName("application")[0];
		var version = appXML.getElementsByTagName("version")[0].firstChild.nodeValue;
		// Spaz.dump(appTag.getAttribute("version"));
		// return appTag.getAttribute("version");
		return version;
	// } else {
	// 	Spaz.dump('appFile DNE');
	// 	return false;
	// }
};