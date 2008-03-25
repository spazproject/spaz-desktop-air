var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Info
************/
if (!Spaz.Info) Spaz.Info = {};

Spaz.Info.getVersion = function() {

		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor
		var domParser = new DOMParser();
		appXML = domParser.parseFromString(appXML, "text/xml");
		var version = appXML.getElementsByTagName("version")[0].firstChild.nodeValue;
		return version;
};


Spaz.Info.getRuntimeInfo = function(){
	return ret ={
		os : air.Capabilities.os,
		version: air.Capabilities.version, 
		manufacturer: air.Capabilities.manufacturer,
		totalMemory: air.System.totalMemory
	};
}