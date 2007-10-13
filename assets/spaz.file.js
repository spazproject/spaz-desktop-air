var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.File
************/
if (!Spaz.File) Spaz.File = {};

Spaz.File.getApplicationFile = function() {
	var appFile = air.File.applicationResourceDirectory;
	// for debugging environment
	appFile = appFile.resolvePath("application.xml");
	if (!appFile.exists) {
		appFile = air.File.applicationResourceDirectory;
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

