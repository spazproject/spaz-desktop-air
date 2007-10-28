var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Debug
************/
if (!Spaz.Debug) Spaz.Debug = {};
//check if we are in root sandbox
if(typeof runtime!='undefined'){
	Spaz.Debug.markerExists = function() {
		//Not allowed to write in app resource - use app storage
		var debugMarker = air.File.applicationStorageDirectory;
		debugMarker = debugMarker.resolvePath("DEBUG_SPAZ");
		return debugMarker.exists;
	}
	
	
	Spaz.Debug.enable = function() {
		//Not allowed to write in app resource - use app storage
		var debugMarker = air.File.applicationStorageDirectory;
		// for debugging environment
		debugMarker = debugMarker.resolvePath("DEBUG_SPAZ");
		if (!debugMarker.exists) {
			var markerStream = new air.FileStream();
			markerStream.open(debugMarker, air.FileMode.WRITE);
			markerStream.writeUTFBytes('debug');
			markerStream.close();
		}
	};
	
	Spaz.Debug.disable = function() {
		if (Spaz.Debug.markerExists() ) {
			var debugMarker = air.File.applicationStorageDirectory;
			debugMarker = debugMarker.resolvePath("DEBUG_SPAZ");
			debugMarker.deleteFile();
		}
	};
	
	Spaz.Debug.setEnable = function(state) {
		if (state) {
			Spaz.Debug.enable();
		} else {
			Spaz.Debug.disable();
		}
	};
	
	Spaz.Debug.dump = function(msg, type) {
		//Spaz.dump('debug:'+debug);
		if (!type) {
			type = 'info';
		}
	
		if ( Spaz.Debug.enabled ) {
			if (Spaz.Bridge && Spaz.Bridge.consoleDump) {
				Spaz.Bridge.consoleDump(msg, type);
			}
			Spaz.Debug.logToFile(msg);
		}
	}
	
	
	Spaz.Debug.logToFile = function(msg) {
		var cr = air.File.lineEnding;
		var file   = air.File.documentsDirectory;
		file       = file.resolvePath("spaz-debug.log");
		var stream = new air.FileStream();
		stream.open(file, air.FileMode.APPEND);
		now = new Date();
		stream.writeUTFBytes(now.toString() + ' : ' + msg + cr);
		stream.close();
	}
	
	
	Spaz.Debug.dumpHTML = function(){
		var docsDir = air.File.documentsDirectory;
		try {
			docsDir.browseForSave("Save HTML As");
			docsDir.addEventListener(air.Event.SELECT, Spaz.Debug.dumpHTMLSelectListener);
		} catch (error) {
			Spaz.dump("Failed:"+error.message, 'error');
		}
	}
	
	Spaz.Debug.dumpHTMLSelectListener = function(event) {
		var newFile = event.target ;
		var str = $('html')[0].outerHTML;
		if (!newFile.exists)
		{
			var stream = new air.FileStream();
			stream.open(newFile, air.FileMode.UPDATE);
			stream.writeUTFBytes(str);
			stream.close();
		}
	}
	
	Spaz.Debug.enabled = Spaz.Debug.markerExists();
	
}else{
	//define links to actual spaz.debug in root
	
	Spaz.Debug.dump = function(msg, type) {
		Spaz.Bridge.dump(msg, type);
	}
	
	Spaz.Debug.$dump = function(msg, type) {
		//Spaz.dump('debug:'+debug);
		if (!type) {
			type = 'info';
		}

		if (typeof debug!='undefined' && debug.log) {
			if (isString(msg)) {
				switch (type) {
					case 'info':
						console.info(msg);
						break;
					case 'debug':
						console.debug(msg);
						break;
					case 'warn':
						console.warn(msg);
						break;
					case 'error':
						console.error(msg);
						break;
					case 'trace':
						console.trace(msg);
						break;
					case 'dir':
						console.dir(msg);
						break;
					case 'dirxml':
						console.dirxml(msg);
						break;
				}	
				air.trace('(string):'+msg);
			} else {
				console.dir(msg);
				air.trace('(obj):'+msg);
			}
		} else {
			air.trace(msg);
		}
	}

	
	Spaz.Debug.dumpHTML = function(){
	//TODO:
	/*	var docsDir = air.File.documentsDirectory;
		try {
			docsDir.browseForSave("Save HTML As");
			docsDir.addEventListener(air.Event.SELECT, Spaz.Debug.dumpHTMLSelectListener);
		} catch (error) {
			Spaz.dump("Failed:"+error.message, 'error');
		}
	*/	
	alert($('html')[0].outerHTML);
	}
	
}

// alias
Spaz.dump = function(msg) {
	Spaz.Debug.dump(msg);
}


Spaz.Debug.showProps = function(obj, objName) {
	air.trace('dumping '+objName);
	var result = "";
	for (var i in obj) {
	   result += objName + "." + i + " = " + obj[i] + "\n";
	}
	air.trace(result);
}
