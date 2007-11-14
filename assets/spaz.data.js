var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Data
*************/
if (!Spaz.Data) Spaz.Data = {};



/*
URLs for various thangs...
*/
// Timeline URLs
// Spaz.Data.url_public_timeline  = "https://twitter.com/statuses/public_timeline.json";
// Spaz.Data.url_friends_timeline = "https://twitter.com/statuses/friends_timeline.json";
// Spaz.Data.url_user_timeline    = "https://twitter.com/statuses/user_timeline.json";
// Spaz.Data.url_replies_timeline = "https://twitter.com/statuses/replies.json";
// Spaz.Data.url_favorites        = "https://twitter.com/favorites.xml";
// Spaz.Data.url_dm_timeline      = "https://twitter.com/direct_messages.xml";
Spaz.Data.url_dm_sent          = "https://twitter.com/direct_messages/sent.xml";
Spaz.Data.url_friendslist      = "https://twitter.com/statuses/friends.xml";
Spaz.Data.url_followerslist    = "https://twitter.com/statuses/followers.xml";
Spaz.Data.url_featuredlist     = "https://twitter.com/statuses/featured.xml";

// Action URLs
Spaz.Data.url_update           = "http://twitter.com/statuses/update.xml";
Spaz.Data.url_destroy_status   = "https://twitter.com/statuses/destroy/{{ID}}.xml";
Spaz.Data.url_follow           = "https://twitter.com/friendships/create/{{ID}}.xml";
Spaz.Data.url_stop_follow      = "https://twitter.com/friendships/destroy/{{ID}}.xml";
Spaz.Data.url_start_notifications = "https://twitter.com/notifications/follow/{{ID}}.json";
Spaz.Data.url_stop_notifications  = "https://twitter.com/notifications/remove/{{ID}}.json";
Spaz.Data.url_favorites_create = "https://twitter.com/favourings/create/{{ID}}.json";
Spaz.Data.url_favorites_destroy= "https://twitter.com/favourings/destroy/{{ID}}.json";
Spaz.Data.url_verify_password  = "https://twitter.com/account/verify_credentials";


Spaz.Data.makeDataSets = function() {
//DONE: get user over the bridge
	// Spaz.dump('making data sets with username ' + Spaz.Bridge.getUser());
// 	Spaz.Data.makePublicTimelineDS();
// //	Spaz.dump('made public timeline');
// 	Spaz.Data.makeFriendsTimelineDS();
// //	Spaz.dump('made friends timeline');
// 	Spaz.Data.makeRepliesTimelineDS();
// //	Spaz.dump('made replies timeline');
// 	Spaz.Data.makeDMTimelineDS();
// //	Spaz.dump('made dm timeline');
// 	Spaz.Data.makeUserTimelineDS();
//	Spaz.dump('made user timeline');
	Spaz.Data.makeFriendsDS();
//	Spaz.dump('made friends list');
	Spaz.Data.makeFollowersDS();
//	Spaz.dump('made followers list');	
	// Spry.Data.initRegions();
	// Spaz.dump('initRegions');
}
// Spaz.Data.makeFriendsTimelineDS = function() {
// 	Spaz.Data.ds_friends = new Spry.Data.XMLDataSet(null, "/statuses/status", { subPaths: [ "user" ]});
// 	// Spaz.Data.ds_friends = new Spry.Data.XMLDataSet();
// 	// Spaz.Data.ds_friends.setXPath("/statuses/status");
// }
// Spaz.Data.makePublicTimelineDS = function() {
// 	Spaz.Data.ds_public = new Spry.Data.XMLDataSet(null, "/statuses/status", { subPaths: [ "user" ]});
// 	// Spaz.Data.ds_public = new Spry.Data.XMLDataSet();
// }
// Spaz.Data.makeRepliesTimelineDS = function() {
// 	Spaz.Data.ds_replies = new Spry.Data.XMLDataSet(null, "/statuses/status", { subPaths: [ "user" ]});
// }
// Spaz.Data.makeUserTimelineDS = function() {
// 	Spaz.Data.ds_user = new Spry.Data.XMLDataSet(null, "/statuses/status", { subPaths: [ "user" ]});
// }
// Spaz.Data.makeDMTimelineDS = function() {
// 	Spaz.Data.ds_dms = new Spry.Data.XMLDataSet(null, "/direct-messages/direct_message",
// 		{ subPaths: [ "sender" ]});
// }
Spaz.Data.makeFriendsDS = function() {	
	Spaz.Data.ds_friendslist = new Spry.Data.XMLDataSet(null, "/users/user", { subPaths: [ "status" ], sortOnLoad:"screen_name", sortOrderOnLoad:"ascending"});
}
Spaz.Data.makeFollowersDS = function() {
	Spaz.Data.ds_followerslist = new Spry.Data.XMLDataSet(null, "/users/user", { subPaths: [ "status" ], sortOnLoad:"screen_name", sortOrderOnLoad:"ascending" });
}

// Spaz.Data.loadFriendsTimelineData = function(tabid, page) {
// 	Spaz.Data.loadTwitterData(Spaz.Data.url_friends_timeline, Spaz.Data.ds_friends, tabid, page);
// }
// Spaz.Data.loadPublicTimelineData = function(tabid, page) {
// 	Spaz.Data.loadTwitterData(Spaz.Data.url_public_timeline, Spaz.Data.ds_public, tabid, page);
// }
// Spaz.Data.loadRepliesTimelineData = function(tabid, page) {
// 	Spaz.Data.loadTwitterData(Spaz.Data.url_replies_timeline, Spaz.Data.ds_replies, tabid, page);
// }
// Spaz.Data.loadUserTimelineData = function(tabid, page) {
// 	Spaz.Data.loadTwitterData(Spaz.Data.url_user_timeline, Spaz.Data.ds_user, tabid, page);	
// };
// Spaz.Data.loadDMTimelineData = function(tabid, page) {
// 	Spaz.Data.loadTwitterData(Spaz.Data.url_dm_timeline, Spaz.Data.ds_dms, tabid, page);
// };
Spaz.Data.loadFriendsData = function(tabid, page) {
	Spaz.Data.loadTwitterData(Spaz.Data.url_friendslist, Spaz.Data.ds_friendslist, tabid, page);
}
Spaz.Data.loadFollowersData = function(tabid, page) {
	Spaz.Data.loadTwitterData(Spaz.Data.url_followerslist, Spaz.Data.ds_followerslist, tabid, page);
}
Spaz.Data.loadAllData = function() {
	// Spaz.Data.loadFriendsTimelineData();
	// Spaz.Data.loadPublicTimelineData();
	// Spaz.Data.loadRepliesTimelineData();
	// Spaz.Data.loadUserTimelineData();
	// Spaz.Data.loadDMTimelineData();
	Spaz.Data.loadFriendsData();
	Spaz.Data.loadFollowersData();
	Spry.Data.initRegions();
	Spry.Data.updateAllRegions();
};


/**
 * Uses jQuery ajax to verify password
 */
Spaz.Data.verifyPassword = function() {
	
	var user = $('#prefs-username').val();
	var pass = $('#prefs-password').val();
	
	Spaz.dump('user:'+user+' pass:********');
	
	Spaz.UI.statusBar("Verifying username and password");	
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			Spaz.UI.statusBar('Error verifying password');
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
			}
			
		},
		success:function(data){
			$('#logger').val(data);
			if (data == 'Authorized') {
				Spaz.verified = true;
				Spaz.dump('verified; setting current user');
				Spaz.Bridge.setCurrentUser();
				Spaz.UI.statusBar("Verification succeeded");
				Spaz.UI.flashStatusBar();
			} else {
				Spaz.verified = false;
				Spaz.dump('verification failed');
				Spaz.UI.statusBar("Verification failed");
				Spaz.UI.flashStatusBar();
			}
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them.
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		url:Spaz.Data.url_verify_password,
	})
	
	// Spaz.dump(xhr, 'dir');
	
}

/* send a status update */
Spaz.Data.update = function(msg, username, password) {
	var user = username;
	var pass = password;
	
	Spaz.dump('user:'+user+' pass:********');
	
	Spaz.UI.statusBar("Sending update");
	Spaz.UI.showLoading();
	
	$('#entrybox').attr('disabled', true);
	$('#updateButton').attr('disabled', true);
	var oldButtonLabel = $('#updateButton').val();
	$('#updateButton').val('Sending...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("Update ERROR: Timeout");
				Spaz.UI.statusBar("Update ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR");
			$('#entrybox').attr('disabled', false);
			$('#updateButton').attr('disabled', false);
			$('#updateButton').val(oldButtonLabel);
			
			if (xhr.readyState < 3) {
				Spaz.dump("Update ERROR: Timeout");
				Spaz.UI.statusBar("Update ERROR: Timeout")
				return;
			}
			
			if (xhr.status != 200) { // sanity check
	 			Spaz.dump("ERROR: " + rstr);
				Spaz.UI.statusBar("Update failed");
				Spaz.UI.flashStatusBar();				
			} else {
				
			}
		},
		success:function(data){
			Spaz.dump('SUCCESS:'+data);
			$('#entrybox').attr('disabled', false);
			$('#updateButton').attr('disabled', false);
			$('#entrybox').val('');
			Spaz.dump('Emptied #entrybox');
			$('#updateButton').val(oldButtonLabel);
			Spaz.dump('reset #updateButton label');
			Spaz.UI.playSoundUpdate();
			Spaz.UI.statusBar("Update succeeded");
			
			Spaz.UI.entryBox.reset();
			Spaz.dump('reset entryBox (Spry)');
			$('#entrybox')[0].blur();
			Spaz.dump('Blurred entryBox (DOM)');
			//Spaz.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", '');
			// have to kill referer header to post 
		},
		processData:false,
		type:"POST",
		url:Spaz.Data.url_update,
		data:"&source="+Spaz.sourceStr+"&status="+encodeURIComponent(msg),
//		data:"&status="+encodeURIComponent(msg),
	});
	
	// Spaz.dump(xhr, 'dir');
}

/* delete a status */
Spaz.Data.destroyStatus = function(postid) {
	var user = Spaz.Bridge.getUser();
	var pass = Spaz.Bridge.getPass();
	
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout");
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("Error destroying status");
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
		},
		success:function(data){
			Spaz.dump(data);
			Spaz.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.url_destroy_status.replace(/{{ID}}/, postid),
	});
	
	// Spaz.dump(xhr, 'dir');
}


Spaz.Data.makeFavorite = function(postid) {
	var user = Spaz.Bridge.getUser();
	var pass = Spaz.Bridge.getPass();
	
	Spaz.UI.showLoading();
	
	Spaz.UI.statusBar('Adding fav: ' + postid);
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("Error adding favorite " + postid);
			Spaz.dump(Spaz.Data.url_favorites_create.replace(/{{ID}}/, postid));
			Spaz.UI.statusBar('Error adding fav: ' + postid);
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			Spaz.dump(data);
			Spaz.UI.statusBar('Added fav: ' + postid);
			//Spaz.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.url_favorites_create.replace(/{{ID}}/, postid),
	});
};


Spaz.Data.followUser = function(userid) {
	var user = Spaz.Bridge.getUser();
	var pass = Spaz.Bridge.getPass();
	
	Spaz.dump('user:'+user+' pass:********');
		
	Spaz.UI.statusBar('Start following: ' + userid)
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			Spaz.UI.statusBar('Error following ' + userid + ": " + xhr.responseText);
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			Spaz.dump(data);
			Spaz.UI.setSelectedTab(document.getElementById('tab-friendslist'));
			Spaz.UI.reloadCurrentTab();
			Spaz.UI.statusBar("Now following " + userid);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.url_follow.replace(/{{ID}}/, userid),
	});
	
	// Spaz.dump(xhr, 'dir');
};


Spaz.Data.stopFollowingUser = function(userid) {
	
	var user = Spaz.Bridge.getUser();
	var pass = Spaz.Bridge.getPass();
	
	Spaz.dump('user:'+user+' pass:********');
	
	Spaz.UI.statusBar('Stop following: ' + userid)
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			Spaz.dump("COMPLETE: " + rstr);
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			Spaz.UI.statusBar('Error while ending follow of ' + userid + ": " + xhr.responseText);
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			Spaz.dump(data);
			Spaz.UI.setSelectedTab(document.getElementById('tab-friendslist'));
			Spaz.UI.reloadCurrentTab();
			Spaz.UI.statusBar("Stop following " + userid);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.url_stop_follow.replace(/{{ID}}/, userid),
	});
	
	// Spaz.dump(xhr, 'dir');
};


Spaz.Data.loadTwitterData = function(section, page) {
	air.trace(section.url);
	
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	Spaz.dump('user:'+user+' pass:********');

	// set page
	if (page) {
		page = parseInt(page);
		if (page < 1) { page = 1; }
	} else {
		page = 1;
	}

	// put ms timestamp in data to create unique request
	var now = new Date();
	var nowms = now.getTime();
	var data  = '&_=' + nowms;

	// caching problems with "page 1" means we can't pass page=1 without missing updates
	if (page != 1) {
		data = data + "&page="+page;
	}
	Spaz.dump("Loading page "+page+" for "+section.tab);

	var passed = nowms - section.lastcheck;
	if (passed <= section.mincachetime) {
		air.trace("Cancel loading -- minimum cache time ("+section.mincachetime+" ms) has not expired ("+passed+" passed)");
		return;
	} else {
		air.trace("Continue loading -- minimum cache time ("+section.mincachetime+" ms) HAS expired ("+passed+" passed)");
	}


	Spaz.UI.statusBar("Loading " + section.url.replace(/http(s)?:\/\/(www\.)?twitter\.com\//, '') + " page " + page);
	Spaz.UI.showLoading();

	Spaz.dump('loadTwitterData: tab '+section.tab);

	if (user === undefined || user === "undefined" || user==''
			|| user == false || user == 'false'
			|| user == null || user == 'null') {
		Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
		Spaz.UI.statusBar("Not yet validated - set username and password");
		Spaz.UI.hideLoading();
		return false;
	}

	if (section.tab) {
		Spaz.dump('jumping to tab ' + section.tab);
		Spaz.UI.tabbedPanels.showPanel(section.tab);
	} else {
		Spaz.dump('not jumping to tab');
	}

	var xhr = $.ajax({
		complete:function(xhr, msg){
			Spaz.UI.hideLoading();
			section.lastcheck = new Date().getTime();
			air.trace("set section.lastcheck to "+section.lastcheck);
			if (xhr.readyState < 3) { // XHR is not yet ready. don't try to access response headers
				Spaz.dump(section.url + ": ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			//Spaz.dump(xhr, 'dir');
			Spaz.dump(section.url + ": COMPLETE: " + msg);

			if (xhr.status == 400) {
				Spaz.dump("ERROR: 400 error - Probably exceeded request limit");
				Spaz.UI.statusBar('Error: May have exceeded request limit');
				Spaz.Bridge.notify('May have exceeded request limit', 'Error');
				return;
			}

			data = eval(xhr.responseText);
			var timelineid = section.tab.replace(/tab/, 'timeline');

			if (!data[0]) {
				Spaz.dump('No data returned');
				Spaz.UI.statusBar('No data returned - Twitter may be acting up');
			} else if (section.lastid == 0 || (section.lastid < data[0].id) ) {
				section.lastdata = data; // set new lastdata
				Spaz.UI.createTimeline(section.timeline, section.lastdata);
				Spaz.dump('old: ' + section.lastid);
				Spaz.dump('new: ' + section.lastdata[0].id);
				section.lastid = section.lastdata[0].id; // set new lastid
				Spaz.UI.playSoundNew();
				Spaz.UI.statusBar('Updates found');
				var newest = section.lastdata[0];
				if (newest.user.screen_name) {
					air.trace('notifying '+newest.user.profile_image_url);
					Spaz.Bridge.notify(newest.text, newest.user.screen_name, null, null, newest.user.profile_image_url);
				} else if (newest.sender.screen_name) {
					air.trace('notifying '+newest.user.profile_image_url);
					Spaz.Bridge.notify(newest.text, newest.sender.screen_name, null, null, newest.sender.profile_image_url);
				}
			} else {
				Spaz.UI.resetStatusBar();
			}

		},
		error:function(xhr, msg, exc) {
			Spaz.dump("ERROR");
			Spaz.UI.statusBar('Error loading ' + section.url.replace(/https:\/\/(www\.)?twitter\.com/, ''));
			Spaz.UI.flashStatusBar();

			if (xhr.readyState < 3) {
				Spaz.dump(section.url + ": ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
			} else if (xhr.status == 400) {
				Spaz.dump(section.url + ": ERROR: 400 error - Probably exceeded request limit");
				Spaz.UI.statusBar('Error: May have exceeded request limit');
			}
		},
		success:function(data) {
			Spaz.dump(section.url + ": SUCCESS");
			Spaz.UI.setCurrentPage($('#'+section.tab)[0], page);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			xhr.setRequestHeader("Cookie", '');
//			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 1999 00:00:00 GMT');
		},
		processData:false,
		type:"GET",
		url:section.url,
		data:data
	});
	
	
};



/**
 * Loads Twitter data via XML, and optionally switches to a particular tab
 */
Spaz.Data.loadTwitterXML = function(url, ds, tabid, page) {
	/**
	XHR stuff
	status
	statusText
	readyState
	responseXML
	responseText
	open(), debugopen(), addEventListener(), setRequestHeader(), send(), getAllResponseHeaders(), getResponseHeader(), abort(), overrideMimeType(), removeEventListener(), dispatchEvent()
	onreadystatechange
	onload
	**/
	
	var user = Spaz.Bridge.getUser();
	var pass = Spaz.Bridge.getPass();
	
	Spaz.dump('user:'+user+' pass:********');
	
	if (ds.data.length > 0) {
		var oldFirstStatus = ds.data[0].id;
	}
	
	if (page) {
		page = parseInt(page);
		if (page < 1) { page = 1; }
	} else {
		page = 1;
	}
	
	// put ms timestamp in data to create unique request
	var now = new Date();
	var nowms = now.getTime();
	var data  = '&_=' + nowms;
	
	// caching problems with "page 1" means we can't pass page=1 without missing updates
	if (page != 1) {
		data = data + "&page="+page;
	}
	
	
	Spaz.dump("Loading page "+page+" for "+tabid);
	
	Spaz.UI.statusBar("Loading " + url.replace(/http(s)?:\/\/(www\.)?twitter\.com\//, '') + " page " + page);
	Spaz.UI.showLoading();
	
	Spaz.dump('loadTwitterXML: tab '+tabid);

	if (user === undefined || user === "undefined" || user==''
			|| user == false || user == 'false'
			|| user == null || user == 'null') {
		Spaz.UI.tabbedPanels.showPanel('tab-prefs');
		Spaz.UI.statusBar("Not yet validated - set username and password");
		Spaz.UI.hideLoading();
		return false;
	}
	
	if (tabid) {
		Spaz.dump('jumping to tab ' + tabid);
		Spaz.UI.tabbedPanels.showPanel(tabid);
	} else {
		Spaz.dump('not jumping to tab');
	}
	
	var xhr = $.ajax({
		complete:function(xhr, msg){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump(url + ": ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump("DATA:\n"+xhr.responseText);
			//Spaz.dump(xhr, 'dir');
			Spaz.dump(url + ": COMPLETE: " + msg);
			
			if (xhr.status == 400) {
				Spaz.dump("ERROR: 400 error - Probably exceeded request limit");
				Spaz.UI.statusBar('Error: May have exceeded request limit');
				Spaz.Bridge.notify('May have exceeded request limit', 'Error');
				return;
			}
			
			var thisRegion = Spaz.Data.getRegionForDs(ds);
			
			data = createXMLFromString(xhr.responseText);
			Spaz.dump("XML retrieved from " + url);
			Spaz.dump("Setting data to DS from " + url);
			
			thisRegion.clearContent();
			//ds.setDataFromDoc(xhr.responseText);
			ds.setDataFromDoc(data);
							
			if (!ds.data[0]) {
				Spaz.dump('No data returned');
				Spaz.UI.statusBar('No data returned - Twitter may be acting up');
			} else if (!oldFirstStatus || (oldFirstStatus != ds.data[0].id) ) {
				Spaz.dump('old: ' + oldFirstStatus);
				Spaz.dump('new: ' + ds.data[0].id);
				Spaz.UI.playSoundNew();
				Spaz.UI.statusBar('Updates found');
				// console.open();
				// console.dir(ds.data[0]);
				// Spaz.Bridge.notify('New updates found', 'New updates');
				var newest = ds.data[0];
				if (newest['user/screen_name']) {
					Spaz.Bridge.notify(newest['text'], newest['user/screen_name'], null, null, newest['user/profile_image_url']);
				} else if (newest['sender/screen_name']) {
					Spaz.Bridge.notify(newest['text'], newest['sender/screen_name'], null, null, newest['sender/profile_image_url']);
				}
			} else {
				Spaz.UI.resetStatusBar();
			}
			// }
			// if (msg == "notmodified") {
			// 	Spry.Data.updateRegion(thisRegion.name);
			// 	Spaz.UI.statusBar('Ready (no changes)');
			// }
		},
		error:function(xhr, msg, exc) {
			Spaz.dump("ERROR");
			Spaz.UI.statusBar('Error loading ' + url.replace(/http:\/\/(www\.)?twitter\.com/, ''));
			Spaz.UI.flashStatusBar();
			
			if (xhr.readyState < 3) {
				Spaz.dump(url + ": ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
			} else if (xhr.status == 400) {
				Spaz.dump(url + ": ERROR: 400 error - Probably exceeded request limit");
				Spaz.UI.statusBar('Error: May have exceeded request limit');
			}
		},
		success:function(data) {
			Spaz.dump(url + ": SUCCESS");
			Spaz.UI.setCurrentPage($('#'+tabid)[0], page);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			xhr.setRequestHeader("Cookie", '');
//			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 1999 00:00:00 GMT');
		},
		processData:false,
		type:"GET",
		url:url,
		data:data
	});
	
	// Spaz.dump('XHR:'+xhr);
	// Spaz.dump(xhr, 'dir');

}






Spaz.Data.shortenLink = function() {
	var origlink = encodeURI($('#shorten-original-link').val());
	
	Spaz.dump('OrigLink:'+origlink);
	
	Spaz.UI.statusBar('Shortening URL: ' + origlink);
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout")
				return;
			}
			Spaz.dump('Response-headers:');
			Spaz.dump(xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump('XHR Object:');
			Spaz.dump(xhr, 'dir');
			Spaz.dump("COMPLETE: " + rstr);
			Spaz.dump(xhr.responseText);
			Spaz.UI.statusBar("Shortened URL:"+xhr.responseText);
			$('#shorten-short-link').val(xhr.responseText);
			$('#shorten-short-link').focus();
			$('#shorten-short-link').select();
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			Spaz.UI.statusBar('Error trying to shorten link');
			Spaz.UI.flashStatusBar();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			// Spaz.dump(data);
			// Spaz.UI.statusBar("Shortened URL");
			// $('#shorten-short-link').val(data);
		},
		beforeSend:function(xhr){},
		processData:false,
		type:"GET",
		url:'http://urltea.com/api/text/',
		data:"&url="+origlink
	});
};

Spaz.Data.getDsForTab = function(tab) {
	switch (tab.id) {
		case 'tab-friends':
			return Spaz.Data.ds_friends;
			break;
		case 'tab-replies':
			return Spaz.Data.ds_replies;
			break;
		case 'tab-dms':
			return Spaz.Data.ds_dms;
			break;
		case 'tab-user':
			return Spaz.Data.ds_user;
			break;
		case 'tab-public':
			return Spaz.Data.ds_public;
			break;
		case 'tab-friendslist':
			return Spaz.Data.ds_friendslist;
			break;
		case 'tab-followerslist':
			return Spaz.Data.ds_followerslist;
			break;
	}	
	return false;
}


Spaz.Data.loadDataForTab = function(tab, auto, page) {
	if (!page || page < 1) {
		page = 1;
	}
	air.trace('Tab:'+tab.id);
	var sectionStr = tab.id.replace(/tab-/, '');
	air.trace('section:'+sectionStr);
	var section = Spaz.Section[sectionStr];
	air.trace(section);
	Spaz.dump('load data for tab '+tab.id);
	switch (tab.id) {
		case 'tab-friendslist':
			if (!auto) {
				Spaz.Data.loadTwitterData(section, page);
				// Spaz.Data.loadFriendsData(tab.id, page);
			}
			break;
		case 'tab-followerslist':
			if (!auto) {
				Spaz.Data.loadTwitterData(section, page);
				// Spaz.Data.loadFollowersData(tab.id, page);
			}
			break;
		case 'tab-prefs':
			break;
		default:
			Spaz.Data.loadTwitterData(section, page);
			break;
	}
	return false
};


Spaz.Data.getRegionForDs = function(ds) {
	if (ds.observers[0]) {
		Spaz.dump('Region #'+ds.observers[0].name);
		return ds.observers[0];
	} else {
		Spaz.dump("no region could be found");
		return false
	}
}




/******
Properties for datasets
xpath: /statuses/status
doc: [object Document]
subPaths: user
observers: [object Object]
suppressNotifications: 0
name: ""
internalID: 5
curRowID: 0
data
[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]
unfilteredData: null
dataHash: [object Object]
columnTypes
[object Object]
filterFunc: null
filterDataFunc: null
distinctOnLoad: false
distinctFieldsOnLoad: null
sortOnLoad: null
sortOrderOnLoad: ascending
keepSorted: false
dataWasLoaded: true
pendingRequest: null
lastSortColumns
lastSortOrder
""
loadIntervalID: 0
url: null
dataSetsForDataRefStrings
hasDataRefStrings: false
useCache: true
requestInfo
[object Object]
FUNCTIONS:
constructor(), getDataRefStrings(), getDocument(), getXPath(), setXPath(), convertXPathsToPathTree(), flattenSubPaths(), loadDataIntoDataSet(), xhRequestProcessor(), sessionExpiredChecker(), setRequestInfo(), recalculateDataSetDependencies(), attemptLoadData(), onCurrentRowChanged(), onPostSort(), onDataChanged(), loadData(), cancelLoadData(), getURL(), setURL(), setDataFromDoc(), setSessionExpiredChecker(), onRequestResponse(), onRequestError(), onRequestSessionExpired(), getData(), getUnfilteredData(), getLoadDataRequestIsPending(), getDataWasLoaded(), setDataFromArray(), filterAndSortData(), getRowCount(), getRowByID(), getRowByRowNumber(), getCurrentRow(), setCurrentRow(), getRowNumber(), getCurrentRowNumber(), getCurrentRowID(), setCurrentRowNumber(), findRowsWithColumnValues(), setColumnType(), getColumnType(), applyColumnTypes(), distinct(), getSortColumn(), getSortOrder(), sort(), filterData(), filter(), startLoadInterval(), stopLoadInterval(), addObserver(), removeObserver(), notifyObservers(), enableNotifications(), disableNotifications(

******/




// Spaz.Data.makeTabObjects = function() {
// 	Spaz.TabFriends = {
// 		url		: Spaz.Data.url_friends_timeline,
// 		ds		: Spaz.Data.ds_friends,
// 		region	: $('#friends_timeline'),
// 		page	: 1,
// 	}
// 	
// 	Spaz.TabReplies = {}
// 	
// 	Spaz.Tab
// }
// 
// Spaz.Data.pageUp = function(tab) {
// 	
// }
// 
// Spaz.Data.getCurrentPage = function(tab) {
// 	
// }