/**
 * This is a wrapper library for the Growl notification
 * functionality enabled via the as3growl library
 */
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
	
	this.service = new window.runtime.com.adobe.growl.GrowlService(this.app);

	this._types = [];
	
	this.addNewType(SpazGrowl.NEW_MESSAGE_COUNT);
	this.addNewType(SpazGrowl.NEW_MESSAGE);
	this.addNewType(SpazGrowl.NEW_MESSAGE_REPLY);
	this.addNewType(SpazGrowl.NEW_MESSAGE_DM);
	this.addNewType(SpazGrowl.ERROR);
};


/**
 * constants for default notification names 
 */
SpazGrowl.NEW_MESSAGE_COUNT = 'SpazGrowl New Message Count';
SpazGrowl.NEW_MESSAGE       = 'SpazGrowl New Message';
SpazGrowl.NEW_MESSAGE_REPLY = 'SpazGrowl New Reply';
SpazGrowl.NEW_MESSAGE_DM    = 'SpazGrowl New Direct Message';
SpazGrowl.ERROR             = 'SpazGrowl Error';


SpazGrowl.prototype.connect = function() {
	this.service.connect(this._types);
};

SpazGrowl.prototype.register = function() {
	this.service.register(this._types);
};

SpazGrowl.prototype.addNewType = function(name, display_name) {
	if (!display_name) {
		display_name = name;
	}
	var nt = new window.runtime.com.adobe.growl.NotificationType();
	nt.enabled = true;
	nt.name = name;
	nt.displayName = display_name;
	this._types.push(nt);
};

/**
 *
 */
SpazGrowl.prototype.notify = function(title, msg, img, type, onClick) { 
	
	this.connect();
	this.register();
	
	if (!type) {
		type = "SpazGrowl notification"
	}
	
	if (!img) {
		img = this.app.iconPath;
	}
	
	// sch.dump('notification img:'+img)

	
	var n = new window.runtime.com.adobe.growl.Notification();
	n.name  = type;
	n.title = title;
	n.text  = msg;
	n.sticky= false;
	
	// sch.dump("Notification id : " + n.id);

	//testing x-headers
	var xHeaders = [new window.runtime.com.adobe.growl.Header("X-foo", "bar")];
	n.xHeaders = xHeaders;
	n.iconPath = img;

	this.service.notify(n);

	//todo: test this
	//g.connect();

	var click_event = window.runtime.com.adobe.growl.events.GrowlResponseEvent.NOTIFICATION_CLICK;

	this.service.addEventListener(click_event, onNotificationClick);
	
	var thisSG = this;
	
	function onIOError(e)
	{
		sch.dump("IOError");
	}

	function onNotificationClick(e)
	{
		sch.dump("Notification Clicked : " + e.notificationId);
		
		thisSG.service.removeEventListener( click_event, onNotificationClick );
		
		if (onClick) {
			onClick(e);
		}
	}

	function onRegisterAndSend()
	{
		this.service.registerAndSend(this.app, this._types, n);
	}

	function onParseResponseClick()
	{
		this.service.register(this.app, this._types);
	}

	function onNotify() {
		this.service.notify(n);
	}

	function onConnectPress()
	{
		this.service.connect();
	}

	
};