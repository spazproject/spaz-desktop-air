SpazGrowl = function(appname, iconpath) {
	
	if (!appname) {
		appname = 'SpazGrowl';
	}
	
	if (!iconpath) {
		iconpath = null;
	}
	
	this.app = new runtime.com.adobe.growl.Application();
	this.app.name = appname;
	this.app.iconPath = iconpath;
	
};


SpazGrowl.prototype.notify = function(title, msg, img, type, onClick) { 
	
	if (!type) {
		type = "SpazGrowl notification"
	}
	
	if (!img) {
		img = this.app.iconPath;
	}
	
	air.trace('notification img:'+img)

	
	var n = new window.runtime.com.adobe.growl.Notification();
	n.name =  type;
	n.title = title;
	n.text =  msg;
	n.sticky = false;
	
	air.trace("Notification id : " + n.id);

	//testing x-headers
	var xHeaders = [new window.runtime.com.adobe.growl.Header("X-foo", "bar")];

	n.xHeaders = xHeaders;

	n.iconPath = img;

	var nt = new window.runtime.com.adobe.growl.NotificationType();
	nt.enabled = true;
	nt.name = n.name;
	nt.displayName = type;

	var g = new window.runtime.com.adobe.growl.GrowlService(this.app);
	// g.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
	g.connect([nt]);
	g.register([nt]);
	g.notify(n);

	//todo: test this
	//g.connect();

	g.addEventListener(window.runtime.com.adobe.growl.events.GrowlResponseEvent.NOTIFICATION_CLICK, onNotificationClick);
	
	function onIOError(e)
	{
		air.trace("IOError");
	}

	function onNotificationClick(e)
	{
		air.trace("Notification Clicked : " + e.notificationId);
		
		g.removeEventListener(window.runtime.com.adobe.growl.events.GrowlResponseEvent.NOTIFICATION_CLICK, onNotificationClick);
		
		if (onClick) {
			onClick(e);
		}
	}

	function onRegisterAndSend()
	{
		g.registerAndSend(a, [nt], n);
	}

	function onParseResponseClick()
	{
		g.register(a, [nt]);
	}

	function onNotify()
	{
		g.notify(n);
	}

	function onConnectPress()
	{
		g.connect();
	}

	
};