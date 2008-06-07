var Spaz; if (!Spaz) Spaz = {};


if (!Spaz.Sys) Spaz.Sys = {};


Spaz.Sys.getVersion = function() {
		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor
		var domParser = new DOMParser();
		appXML = domParser.parseFromString(appXML, "text/xml");
		var version = appXML.getElementsByTagName("version")[0].firstChild.nodeValue;
		return version;
};



Spaz.Sys.initUserAgentString = function() {
	window.htmlLoader.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Spaz/' + Spaz.Sys.getVersion();
	// air.URLRequestDefaults.userAgent = air.HTMLLoader.userAgent
	air.trace(window.htmlLoader.userAgent)
	return window.htmlLoader.userAgent
};
Spaz.Sys.getUserAgent = function() {
	return window.htmlLoader.userAgent
};
Spaz.Sys.setUserAgent = function(uastring) {
	window.htmlLoader.userAgent = uastring
	// air.URLRequestDefaults.userAgent = uastring
	return window.htmlLoader.userAgent
};



Spaz.Sys.initNetworkConnectivityCheck = function() {
	var monitor;
	monitor = new air.URLMonitor(new air.URLRequest('http://twitter.com/statuses/user_timeline.json?id=spaztest&count=1'));
	monitor.addEventListener(air.StatusEvent.STATUS, announceStatus);
	monitor.pollInterval = 15*1000;
	monitor.start();
	
	function announceStatus(e) {
		Spaz.dump("Network status change. Current status: " + monitor.available);
	}
	
};


Spaz.Sys.getRuntimeInfo = function(){
	return ret ={
		os : air.Capabilities.os,
		version: air.Capabilities.version, 
		manufacturer: air.Capabilities.manufacturer,
		totalMemory: air.System.totalMemory
	};
}






Spaz.Sys.getClipboardText = function() {
	if(air.Clipboard.generalClipboard.hasFormat("text/plain")){
	    var text = air.Clipboard.generalClipboard.getData("text/plain");
		return text;
	} else {
		return '';
	}
}

Spaz.Sys.setClipboardText = function(text) {
	Spaz.dump('Copying "' + text + '" to clipboard');
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,text,false);
}


Spaz.Sys.getFileContents = function(path) {
	var f = new air.File(path);
	if (f.exists) {
		var fs = new air.FileStream();
		fs.open(f, air.FileMode.READ);
		var str = fs.readMultiByte(f.size, air.File.systemCharset);
		fs.close();
		return str;
	} else {
		return false;
	}

};


Spaz.Sys.openInBrowser = function(url) {
	Spaz.dump('opening '+url);
	var request = new air.URLRequest(url);
	try {            
	    air.navigateToURL(request);
	}
	catch (e) {
	    Spaz.dump(e.errorMsg)
	}
};



Spaz.Sys.loadChildInterface = function() {
	Spaz.Sys.ClassicSB = $("#classicSB")[0].contentWindow.childSandboxBridge;
	// Spaz.dump(classicSB)
	// eval = Spaz.Sys.ClassicSB.eval;
	
	// eval('alert("Funky!")');
};

/***********
Spaz.Bridge
************/
if (!Spaz.Bridge) Spaz.Bridge = {};

