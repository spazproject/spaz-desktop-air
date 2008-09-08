var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Debug
************/
if (!Spaz.Debug) Spaz.Debug = {};

Spaz.Debug.enable = function() {
	Spaz.Prefs.set('debug-enabled', true);
};

Spaz.Debug.disable = function() {
	Spaz.Prefs.set('debug-enabled', false);
};

Spaz.Debug.setEnable = function(state) {
	if (state) {
		Spaz.Debug.enable();
	} else {
		Spaz.Debug.disable();
	}
};

Spaz.Debug.dump = function(msg, type) {
	if ( Spaz.Prefs && Spaz.Prefs.get('debug-enabled') ) {
		
		if (!type) {
			type = 'info';
		}

		if (air.Introspector && air.Introspector.Console && air.Introspector.Console[type]) {
			air.Introspector.Console[type](msg);
		} else {
			air.trace(msg);
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


// Spaz.Debug.dump = function(msg, type) {
// 
// }


// alias
Spaz.dump = function(msg, type) {
	Spaz.Debug.dump(msg, type);
}


Spaz.Debug.showProps = function(obj, objName) {
	air.trace('dumping '+objName);
	var result = "";
	for (var i in obj) {
	   result += objName + "." + i + " = " + obj[i] + "\n";
	}
	air.trace(result);
}



Spaz.Debug.dumpHTML = function() {
	var docsDir = air.File.documentsDirectory;
	try {
		docsDir.browseForSave("Save HTML As");
		docsDir.addEventListener(air.Event.SELECT, Spaz.Debug.dumpHTMLSelectListener, false, 0, true);
	} catch (error) {
		Spaz.dump("Failed:"+error.message, 'error');
	}
};

Spaz.Debug.dumpHTMLSelectListener = function(event) {
	var newFile = event.target;
	Spaz.dump('got newFile '+newFile.url);
	
	var html = $('html')[0].outerHTML;
	html = html.replace(/app:\/\//, '');
	html = html.replace(/onclick="Spaz\.UI\.setSelectedTab\(this\)"/, '');
	
	Spaz.dump('got html '.html);

	var stream = new air.FileStream();
	Spaz.dump('made stream ');
	stream.open(newFile, air.FileMode.UPDATE);
	Spaz.dump('opened stream '+newFile.url);
	stream.writeUTFBytes(html);
	Spaz.dump('write utfbytes '+html);
	stream.close();
	Spaz.dump('close stream')

}


Spaz.Debug.insertDebugScripts = function() {
	air.trace("INSERT DEBUGGING SCRIPTS");
	var e = document.createElement("script");
	e.src = "assets/air/AIRIntrospector.js";
	e.type= "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(e);
	//<base href="app:/"/>
	//<script src="assets/jquery/jquery-profile.js" type="text/javascript" charset="utf-8"></script>
};