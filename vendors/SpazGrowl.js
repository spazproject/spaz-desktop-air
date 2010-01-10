SpazGrowl = function(appname) {
	this.appname = appname || null;
}

/**
 * constants for default notification names 
 */
SpazGrowl.NEW_MESSAGE_COUNT = 'SpazGrowl New Message Count';
SpazGrowl.NEW_MESSAGE       = 'SpazGrowl New Message';
SpazGrowl.NEW_MESSAGE_REPLY = 'SpazGrowl New Reply';
SpazGrowl.NEW_MESSAGE_DM    = 'SpazGrowl New Direct Message';
SpazGrowl.ERROR             = 'SpazGrowl Error';

/**
 * This only will work under AIR 2.0 for now 
 */
SpazGrowl.prototype.notify= function(title, message, opts) {

	if (!opts) { opts = {}; }
	
	sch.debug(title);
	sch.debug(message);
	sch.debug(opts);
	
	var priority    = opts.priority    || 0;
	var sticky      = opts.sticky      || false;
	var imgpath     = opts.imgpath     || null;
	var identifier  = opts.identifier  || null;
	
	if(air.NativeProcess.isSupported) {
		/*
			growlnotify ships with Spaz in the bin directory
			
			Also, this pretty much ensures this can only work on OS X
		*/
		var exec = air.File.applicationDirectory;
		exec = exec.resolvePath('bin');
		exec = exec.resolvePath('growlnotify');
		
		var npsi = new air.NativeProcessStartupInfo();
		npsi.executable = exec;
		var args = new runtime.Vector["<String>"]();
		
		
		/*
			app name
		*/
		if (this.appname) {
			args.push("-n");
			args.push(this.appname);			
		}

		/*
			set title
		*/
		args.push(title);
		
		/*
			message
		*/
		args.push("-m");
		args.push(message);
		
		/*
			icon image path
		*/
		// if (imgpath) {
		// 	args.push("--image");
		// 	args.push( new air.File(imgpath).nativePath );
		// } else {
			args.push("--image");
			args.push( air.File.applicationDirectory
							.resolvePath('images')
							.resolvePath('spaz-icon-alpha.png')
							.nativePath
			);
		// }
		
		/*
			make sticky
		*/
		if (sticky) {
			args.push('-s');
		}
		
		if (identifier) {
			args.push('-d');
			args.push(identifier);
		}
		
		npsi.arguments = args;
		
		var np = new air.NativeProcess();
		sch.debug(npsi.executable);
		sch.debug(npsi.arguments);
		np.start(npsi);
		
	} else {
		sch.dump('NATIVE PROCESSES NOT SUPPORTED')
	}

};