var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Prefs
************/
if (!Spaz.Prefs) Spaz.Prefs = {};

Spaz.Prefs.file; // The preferences file
Spaz.Prefs.XML; // The XML data
Spaz.Prefs.stream; // The FileStream object used to read and write Spaz.Prefs.file data.
Spaz.Prefs.user = '';
Spaz.Prefs.pass = '';
Spaz.Prefs.refreshInterval = 120000; // 2 minutes in msecs
Spaz.Prefs.windowOpacity   = 100;

Spaz.Prefs.load = function() {

	Spaz.Prefs.file = air.File.applicationStorageDirectory;
	Spaz.Prefs.file = Spaz.Prefs.file.resolvePath("preferences.xml"); 
	
	// load and process XML prefs file
	Spaz.Prefs.readXML();

}
/**
* Called when the application is first rendered, and when the user clicks the Save button.
* If the preferences file *does* exist (the application has been run previously), the method 
* sets up a FileStream object and reads the XML data, and once the data is read it is processed. 
* If the file does not exist, the method calls the Spaz.Prefs.saveData() method which creates the file. 
*/
Spaz.Prefs.readXML = function()
{
	Spaz.Prefs.stream = new air.FileStream();
	if (Spaz.Prefs.file.exists) {
		Spaz.Prefs.stream.open(Spaz.Prefs.file, air.FileMode.READ);
		Spaz.Prefs.processXMLData();
	} else {
		Spaz.Prefs.saveData();
	}
}

/**
* Called after the data from the prefs file has been read. The readUTFBytes() reads
* the data as UTF-8 text, and the XML() function converts the text to XML. The x, y,
* width, and height properties of the main window are then updated based on the XML data.
*/
Spaz.Prefs.processXMLData = function()
{
	Spaz.Prefs.XML = Spaz.Prefs.stream.readUTFBytes(Spaz.Prefs.stream.bytesAvailable);
	Spaz.Prefs.stream.close();
	var domParser = new DOMParser();
	Spaz.Prefs.XML = domParser.parseFromString(Spaz.Prefs.XML, "text/xml");

	// position window
	var windowState = Spaz.Prefs.XML.getElementsByTagName("windowState")[0];
	window.moveTo(windowState.getAttribute("x"), windowState.getAttribute("y"));
	window.resizeTo(windowState.getAttribute("width"), windowState.getAttribute("height"));
	Spaz.Prefs.checkWindowOpacity(windowState.getAttribute("alpha"));
	

	// load userdata
	// var userData = Spaz.Prefs.XML.getElementsByTagName("user")[0];
	// 	Spaz.Prefs.user = userData.getAttribute("username");
	// 	Spaz.Prefs.pass = userData.getAttribute("password");
	Spaz.Prefs.user = Spaz.Prefs.loadUsername();
	Spaz.Prefs.pass = Spaz.Prefs.loadPassword();
	
	// load theme data
	var themeData = Spaz.Prefs.XML.getElementsByTagName("theme")[0];
	if (themeData) {
		Spaz.Bridge.setUI('currentTheme', themeData.getAttribute("basetheme"));
		Spaz.Bridge.setUI('userStyleSheet', themeData.getAttribute("userstylesheet"));
		if (themeData.getAttribute("usemarkdown")) {
			Spaz.Bridge.setUI('useMarkdown', parseInt(themeData.getAttribute("usemarkdown")));
		}
		var info = Spaz.Bridge.getUIInfo();
		Spaz.dump("Spaz.UI.currentTheme:"+info.currentTheme);
		Spaz.dump("Spaz.UI.userStyleSheet:"+info.userStyleSheet);
		Spaz.dump("Spaz.UI.useMarkdown:"+info.useMarkdown);
	}
	
	var soundData = Spaz.Prefs.XML.getElementsByTagName("sound")[0];
	if (soundData) {
		Spaz.Bridge.setUI('playSounds', parseInt(soundData.getAttribute('enabled')));
		var info = Spaz.Bridge.getUIInfo();
		Spaz.dump('Spaz.UI.playSounds: ' + info.playSounds)
	}


	var checkupdateData = Spaz.Prefs.XML.getElementsByTagName("checkupdate")[0];
	if (checkupdateData) {
		//TODO: enable spaz.update
		Spaz.Update.checkUpdate = parseInt(checkupdateData.getAttribute('enabled'));
		Spaz.dump('Spaz.Update.checkUpdate: ' + Spaz.Update.checkUpdate)
	}

	//if (!Spaz.UI.currentTheme) {Spaz.UI.currentTheme = null;}
	
	// load refresh info
	var networkData = Spaz.Prefs.XML.getElementsByTagName("network")[0];
	if (networkData) {
		Spaz.Prefs.refreshInterval = parseInt(networkData.getAttribute("refreshinterval"));
	}
	if (isNaN(Spaz.Prefs.refreshInterval)) {Spaz.Prefs.refreshInterval = 120000;}
	if (Spaz.Prefs.refreshInterval < 60000) { Spaz.Prefs.refreshInterval = 60000 } // minimum 1 minute
	Spaz.dump('Spaz.Prefs.refreshInterval:'+Spaz.Prefs.refreshInterval);
}

/**
* Called when the user closes the window.
*/
Spaz.Prefs.windowClosingHandler = function() 
{
	nativeWindow.removeEventListener("closing", Spaz.Prefs.windowClosingHandler);
	Spaz.Prefs.saveData();
	air.Shell.shell.exit();
}
/**
 * Called in the windowClosingHandler() method. Constructs XML data and saves the 
 * data to the preferences.xml file.
 */
Spaz.Prefs.saveData = function()
{
	Spaz.Prefs.createXMLData();
	Spaz.Prefs.writeXMLData();
	Spaz.Prefs.saveUsername();
	Spaz.Prefs.savePassword();
}
/**
* Creates the XML object with data based on the window state and the 
* current time.
*/
Spaz.Prefs.createXMLData = function()
{
	var info = Spaz.Bridge.getUIInfo();
	var cr = air.File.lineEnding;
	Spaz.Prefs.XML  = "<?xml version='1.0' encoding='utf-8'?>" + cr
					+ "<preferences>" + cr 
					+ "    <windowState" + cr
					+ "        width = '" + window.outerWidth.toString() + "'" + cr
					+ "        height = '" + window.outerHeight.toString() + "'" + cr
					+ "        x = '" + window.screenLeft.toString() + "'" + cr
					+ "        y = '" + window.screenTop.toString() + "'" + cr
					+ "        alpha = '" + Spaz.Prefs.windowOpacity + "'" + "/>" + cr
					+ "    <user " + cr
					// + "        username = '"+Spaz.Prefs.user+"'" + cr
					// + "        password = '"+Spaz.Prefs.pass+"'" +cr
					+ "	       />" + cr
					+ "    <network refreshinterval = '"+Spaz.Prefs.refreshInterval.toString()+"'"+cr
					+ "        />" + cr
					+ "    <theme "+ cr
					+ "        usemarkdown = '"+info.useMarkdown.toString()+"'" + cr
					+ "        userstylesheet = '"+info.userStyleSheet+"'" + cr
					+ "        basetheme = '"+info.currentTheme+"'"+ "/>" + cr
					+ "    <sound enabled = '"+info.playSounds.toString()+"'" + cr
					+ "         />" + cr
					+ "    <checkupdate enabled = '"+Spaz.Update.checkUpdate.toString()+"'" + cr
					+ "         />" + cr
					+ "    <saveDate>"
					+            new Date().toString() 
					+     "</saveDate>" + cr
					+ "</preferences>";
	Spaz.dump('Made XML for prefs');
}

/**
* Called when the user resizes the window. The method replaces line ending 
* characters with the platform-specific line ending character. Then sets up 
* and uses the stream object to write the data.
*/
Spaz.Prefs.writeXMLData = function()
{
	Spaz.Prefs.stream = new air.FileStream();
	Spaz.Prefs.stream.open(Spaz.Prefs.file, air.FileMode.WRITE);
	Spaz.Prefs.stream.writeUTFBytes(Spaz.Prefs.XML);
	Spaz.Prefs.stream.close();
	Spaz.Prefs.saveUsername();
	Spaz.Prefs.savePassword();
	Spaz.dump('Saved prefs');
}


Spaz.Prefs.saveUsername = function() {
	var bytes = new air.ByteArray();
	bytes.writeUTFBytes(Spaz.Prefs.user);
	air.EncryptedLocalStore.setItem('twitter_username_1', bytes);
};

Spaz.Prefs.loadUsername = function() {
	var storedValue = air.EncryptedLocalStore.getItem('twitter_username_1');
	if (storedValue) {
		return storedValue.readUTFBytes(storedValue.length);
	} else {
		return false;
	}
};

Spaz.Prefs.savePassword = function() {
	var bytes = new air.ByteArray();
	bytes.writeUTFBytes(Spaz.Prefs.pass);
	air.EncryptedLocalStore.setItem('twitter_password_1', bytes);
};

Spaz.Prefs.loadPassword = function() {
	var storedValue = air.EncryptedLocalStore.getItem('twitter_password_1');
	if (storedValue) {
		return storedValue.readUTFBytes(storedValue.length);
	} else {
		return false;
	}
};

Spaz.Prefs.setPrefs = function() {
	Spaz.Bridge.verifyPassword();
}

Spaz.Prefs.setCurrentUser = function() {
	Spaz.Prefs.user = $('#prefs-username').val();
	Spaz.Prefs.pass = $('#prefs-password').val();
	
	Spaz.dump('set new username and pass ('+Spaz.Prefs.user+')');
	
	Spaz.Prefs.saveData();
	
	Spaz.dump('saved data');
}

Spaz.Prefs.checkRefreshPeriod = function(val) {
	val = parseInt(val);
	if (val < 1) {
		val = 1;
	} else if (val > 60) {
		val = 60;
	}
	
	// convert msecs to minutes
	Spaz.Prefs.refreshInterval = val*60000;
	Spaz.Bridge.setPrefsFormVal('prefs-refresh-interval', val);
}

Spaz.Prefs.checkWindowOpacity = function(percentage) {
	//alert(percentage+"%");
	percentage = parseInt(percentage);
	if (isNaN(percentage)) {
		percentage = 100;
	}
	if (percentage < 25) {
		percentage = 25;
	}
	var val = parseInt(percentage)/100;
	if (isNaN(val)){
		val = 1;
	} else if (val >= 1) {
		val = 1;
	} else if (val <= 0) {
		val = 1;
	}
	
	window.htmlControl.alpha = val;
	
	Spaz.Prefs.windowOpacity = percentage;
	Spaz.Bridge.setPrefsFormVal('prefs-opacity-percentage', Spaz.Prefs.windowOpacity);
}