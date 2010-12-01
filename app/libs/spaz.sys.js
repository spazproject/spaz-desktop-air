var Spaz; if (!Spaz) Spaz = {};


if (!Spaz.Sys) Spaz.Sys = {};


Spaz.Sys.getVersion = function() {
		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor
		var domParser = new DOMParser();
		appXML = domParser.parseFromString(appXML, "text/xml");
		var version = appXML.getElementsByTagName("versionNumber")[0].firstChild.nodeValue;
		return version;
};



Spaz.Sys.initUserAgentString = function() {
	window.htmlLoader.userAgent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Spaz/' + Spaz.Sys.getVersion();
	// air.URLRequestDefaults.userAgent = air.HTMLLoader.userAgent
	sch.dump(window.htmlLoader.userAgent)
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

Spaz.Sys.isWindows = function() {
	return (air.Capabilities.os.search(/Windows/gi) > -1);
};
Spaz.Sys.isMac = function() {
	return (air.Capabilities.os.search(/Mac OS/gi) > -1);
};
Spaz.Sys.isLinux = function() {
	return (air.Capabilities.os.search(/Linux/gi) > -1);
};


Spaz.Sys.initNetworkConnectivityCheck = function() {
	sch.debug('initNetworkConnectivityCheck disabled');

	// var monitor;
	// 
	// var test_url = Spaz.Data.getAPIURL('test');
	// 
	// monitor = new air.URLMonitor( new air.URLRequest( test_url ) );
	// monitor.addEventListener(air.Event.NETWORK_CHANGE, announceStatus);
	// monitor.pollInterval = 30*1000;
	// monitor.start();
	// 
	// function announceStatus(e) {
	// 	sch.debug("Network status change. Current status: " + monitor.available);
	// 	sch.dump("Network status change. Current status: " + monitor.available);
	// }
};


Spaz.Sys.initMemcheck = function() {
	sch.debug('Memcheck disabled');

	// t = new air.Timer(15*1000, 0);
	// t.addEventListener(air.TimerEvent.TIMER, memCheckGC);
	// t.start();
	// 
	// // sch.dump("Running!"+t.running);
	// 
	// function memCheckGC(e) {
	// 	// sch.dump("memcheck event");
	// 	sch.debug("air.System.totalMemory:"+air.System.totalMemory);
	// 	// air.System.gc();
	// 	// sch.dump("post mem:"+air.System.totalMemory);
	// }
};


Spaz.Sys.getRuntimeInfo = function(){
	return ret ={
		os : air.Capabilities.os,
		version: air.Capabilities.version, 
		manufacturer: air.Capabilities.manufacturer,
		totalMemory: air.System.totalMemory,
		
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
	sch.debug('Copying "' + text + '" to clipboard');
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


/*
	@TODO: should really wrap the business end of this in a try/catch
*/
Spaz.Sys.setFileContents = function(path, content, serialize) {
	
	if (serialize) {
		content = JSON.stringify(content);
	}
	
	sch.debug('setFileContents for '+path+ ' to "' +content+ '"');
	
	var f = new air.File(path);
	var fs = new air.FileStream();
	fs.open(f, air.FileMode.WRITE);
	fs.writeUTFBytes(content);
	fs.close();
};



Spaz.Sys.openInBrowser = function(url) {
	sch.debug('opening '+url);
	var request = new air.URLRequest(url);
	try {            
	    air.navigateToURL(request);
	}
	catch (e) {
	    sch.debug(e.errorMsg)
	}
};



Spaz.Sys.openAppStorageFolder = function() {
	air.File.applicationStorageDirectory.openWithDefaultApplication(); 
};


Spaz.Sys.loadChildInterface = function() {
	Spaz.Sys.ClassicSB = $("#classicSB")[0].contentWindow.childSandboxBridge;
	// sch.debug(classicSB)
	// eval = Spaz.Sys.ClassicSB.eval;
	
	// eval('alert("Funky!")');
};

/***********
Spaz.Bridge
************/
if (!Spaz.Bridge) Spaz.Bridge = {};

