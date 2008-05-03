/* this is based on code taken from the Adobe AIR prelease forums, used with permission */

/*
	1. Get current app version
	2. Go online and get newest app version
	3. compare
	4. if new, download new version
	5. update to new version
*/

var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Update) Spaz.Update = {};

Spaz.Update.descriptorUrl = 'http://funkatron.com/apps/spaz/AIR/UpdateDescriptor.json';

Spaz.Update.descriptorUrlTests = 'http://funkatron.com/apps/spaz/AIR/UpdateDescriptorTests.json';

Spaz.Update.info = {};


function dump (msg) {
	air.Introspector.Console.info(msg);
}



Spaz.Update.go = function() {
	
	Spaz.Update.info.currentVersion = Spaz.Update.getCurrentVersion();
	
	Spaz.Update.getNewestVersion();
	
};



/**
 * Retrieves the version of the currently running app
 * @returns the version string
 * @type String
 */
Spaz.Update.getCurrentVersion = function() {

	return Spaz.Sys.getVersion();
	
};






/**
 * Retrieves the newest version string of the app from Spaz.Update.descriptorUrl
 * @returns the version string
 * @type String
 * @see Spaz.Update.descriptorUrl
 */
Spaz.Update.getNewestVersion = function() {
	
	$.ajax({
		url: Spaz.Update.descriptorUrl,
		type: "GET",
		dataType: "json",
	
		complete: function(xhr, rstr) {
			// dump('Complete');
			// dump(xhr);
		},
	
		success: function(data) {
			dump('Success');
			dump(data);
			for(key in data) {
				Spaz.Update.info[key] = data[key]
			}
			
			Spaz.Update.compareVersions(Spaz.Update.info.currentVersion, Spaz.Update.info.newestVersion);
		},
	
		error: function(xhr, rstr) {
			dump('Error');
			dump(xhr);
		},
	});
	
};

/**
 * Compares the current and newest version strings, and returns OLDER, SAME, or NEWER
 * @param String current the current version string
 * @param String newest the newest version string
 * @returns a string: 'OLDER', 'SAME', or 'NEWER'
 * @type String
 */
Spaz.Update.compareVersions = function(current, newest) {
	
	var siteV = {};
	var currV = {};
	
	var newpieces = newest.split('.');
	dump(newpieces);
	siteV.major = parseInt(newpieces[0]);
	siteV.minor = parseInt(newpieces[1]);
	siteV.micro = parseInt(newpieces[2]);
	siteV.builddate = parseInt(newpieces[3]);
	
	dump(siteV);
	
	var curpieces = current.split('.');
	dump(curpieces);
	currV.major = parseInt(curpieces[0]);
	currV.minor = parseInt(curpieces[1]);
	currV.micro = parseInt(curpieces[2]);
	currV.builddate = parseInt(curpieces[3]);
	
	dump(currV);
	
	Spaz.Update.info.status = 'SAME';
	if (siteV.major > currV.major) {
		Spaz.Update.info.status = 'NEWER';
	} else if (siteV.major < currV.major) {
		Spaz.Update.info.status = 'OLDER';
	} else { // minor could still be bigger
		
		if (siteV.minor > currV.minor) {
			Spaz.Update.info.status = 'NEWER';
		} else if (siteV.minor < currV.minor) {
			Spaz.Update.info.status = 'OLDER';
		} else { // micro could still be bigger
			
			if (siteV.micro > currV.micro) {
				Spaz.Update.info.status = 'NEWER';
			} else if (siteV.micro < currV.micro) {
				Spaz.Update.info.status = 'OLDER';
			} else {
				if (siteV.builddate > currV.builddate) {
					Spaz.Update.info.status = 'NEWER';
				} else if (siteV.builddate < currV.builddate) {
					Spaz.Update.info.status = 'OLDER';
				} else {
					Spaz.Update.info.status = 'SAME';
				}
			}
		}	
	}
	
	dump(Spaz.Update.info)
	
	switch (Spaz.Update.info.status) {
		case 'NEWER':
			Spaz.Update.downloadNewest(Spaz.Update.info.newestUrl)
			break;
		case 'OLDER':
			dump('Your version is newer that the one online!');
			break;
		case 'SAME':
			dump('Your have the newest version available');
			break;
	}
};



Spaz.Update.downloadNewest = function(url) {
	
	var urlReq = new air.URLRequest(url);
	var urlStream = new air.URLStream();
	var fileData = new air.ByteArray();
	urlStream.addEventListener(air.Event.COMPLETE, loaded);
	dump("Downloading...");
	urlStream.load(urlReq);
	
	function loaded(event) {
		dump("Loaded...");
		urlStream.readBytes(fileData, 0, urlStream.bytesAvailable);
		writeAirFile();
	}
	
	function writeAirFile() {
		dump("Writing File...");
		var file = air.File.applicationStorageDirectory.resolvePath("Spaz-Newest.air");
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.WRITE);
		fileStream.writeBytes(fileData, 0, fileData.length);
		fileStream.close();
		dump("The AIR file is written.");
		Spaz.Update.info.airfile = file;
		
		Spaz.Update.applyUpdate();
	}
	
	return false;
};


Spaz.Update.applyUpdate = function() {
	
	airUpdater = new air.Update()
	
	airUpdater.update(Spaz.Update.info.airfile, Spaz.Update.info.newestVersion);
	
	return false;
}