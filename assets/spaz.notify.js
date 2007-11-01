var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Notify
************/
if (!Spaz.Notify) Spaz.Notify = {};


Spaz.Notify.purr = null;

Spaz.Notify.iconBMP = null;

Spaz.Notify.params = null;

// Spaz.Notify.notify = function(msg) {
// 	Spaz.dump("init notifier");
// 	var notifier = new runtime.com.adobe.air.notification.Purr(5);
// 	Spaz.dump('notifier init-ed')
// 
// 	var title = "This is a title";
// 	// var message = "This is a message";
// 	var where = runtime.com.adobe.air.notification.AbstractNotification.BOTTOM_RIGHT;
// 	notifier.addTextNotificationByParams(title, msg, where, 5, null);
// }


Spaz.Notify.add  = function(message, title, where, duration, icon) {
	
	Spaz.dump("init notifier");
	Spaz.Notify.purr = new window.runtime.com.adobe.air.notification.Purr(1);


	if (title == null) {
		title = "Spaz";
	}
	if (message == null) {
		message = "lorem ipsum dolor…";
	}
	if (duration == null) {
		duration = 4;
	}
	switch (where) {
		case 'ne' :
			where = 'topRight'
			break;
		case 'nw' :
			where = 'topLeft'
			break;
		case 'se' :
			where = 'bottomRight'
			break;
		case 'sw' :
			where = 'bottomLeft'
			break;
		default:
			where = 'topRight'
			break;
	}
	if (icon == null) {
		icon = 'images/spaz-icon-alpha.png';
	}
	Spaz.Notify.params = {
		msgWhere: where,
		msgTitle: title,
		msgBody: message,
		msgDuration: duration,
		msgIconURL: icon
	};
	
	Spaz.Notify.loadIcon(icon);

	
	// if (icon != null) {
	// 	Spaz.Notify.loadIcon(icon);
	// 	Spaz.Notify.params = {
	// 		msgWhere: where,
	// 		msgTitle: title,
	// 		msgBody: msg,
	// 		msgDuration: duration,
	// 		msgIconURL: icon
	// 	};
	// } else {
	// 	Spaz.dump('title='+title+' message='+message+' where='+where+' duration='+duration+' icon'+icon);
	// 	Spaz.Notify.purr.addTextNotificationByParams(title, message, where, duration, null);
	// }
};

Spaz.Notify.$add = function() {
	Spaz.dump('$add');
	params = Spaz.Notify.params
	Spaz.dump('title='+params.msgTitle+' message='+params.msgBody+' where='+params.msgWhere+' duration='+params.msgDuration+' iconURL='+params.msgIconURL);
	// n = new window.runtime.com.adobe.air.notification.Notification(params.msgTitle, params.msgBody, params.msgWhere, params.msgDuration, params.msgIcon);
	// Spaz.Notify.purr.addNotification(n);
	Spaz.Notify.purr.addTextNotificationByParams(params.msgTitle,
													params.msgBody,
													params.msgWhere,
													params.msgDuration,
													params.msgIcon);
}

Spaz.Notify.loadIcon = function(url) {
	Spaz.dump('loadIcon');
	if (url == null) {
		url = 'images/spaz-icon-alpha.png';
	}
	Spaz.dump('iconURL:'+url);
	var iconLoader = new air.Loader();
	iconLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,
	                                        Spaz.Notify.iconLoadComplete);
	iconLoader.load(new air.URLRequest(url));
}
Spaz.Notify.iconLoadComplete = function(event) {
	Spaz.dump('iconLoadComplete');
	Spaz.Notify.params.msgIcon = event.target.content;
	Spaz.Notify.$add();
};
