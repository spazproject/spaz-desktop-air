var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Info
************/
if (!Spaz.Info) Spaz.Info = {};

Spaz.Info.getVersion = function() {
	var fs = new air.FileStream()
	var appFile = Spaz.File.getApplicationFile();
	if (appFile) {
		fs.open(appFile, air.FileMode.READ);
		var appXML = fs.readUTFBytes(fs.bytesAvailable);
		fs.close();
		
		var domParser = new DOMParser();
		appXML = domParser.parseFromString(appXML, "text/xml");
		var appTag = appXML.getElementsByTagName("application")[0];
		Spaz.dump(appTag.getAttribute("version"));
		return appTag.getAttribute("version");
	} else {
		Spaz.dump('appFile DNE');
		return false;
	}
};


Spaz.Info.getRuntimeInfo = function(){
	return ret ={
		os : air.Capabilities.os,
		version: air.Capabilities.version, 
		manufacturer: air.Capabilities.manufacturer,
		totalMemory: air.System.totalMemory
	};
}