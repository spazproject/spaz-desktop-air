var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Data
*************/
if (!Spaz.Data) Spaz.Data = {};

$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true
		// cache:false
	}
);

/*
URLs for various thangs...
*/
// Timeline URLs
Spaz.Data.url_public_timeline  = "https://twitter.com/statuses/public_timeline.json";
Spaz.Data.url_friends_timeline = "https://twitter.com/statuses/friends_timeline.json";
Spaz.Data.url_user_timeline    = "https://twitter.com/statuses/user_timeline.json";
Spaz.Data.url_replies_timeline = "https://twitter.com/statuses/replies.json";
Spaz.Data.url_favorites        = "https://twitter.com/favorites.json";
Spaz.Data.url_dm_timeline      = "https://twitter.com/direct_messages.json";
Spaz.Data.url_dm_sent          = "https://twitter.com/direct_messages/sent.json";
Spaz.Data.url_friendslist      = "https://twitter.com/statuses/friends.json";
Spaz.Data.url_followerslist    = "https://twitter.com/statuses/followers.json";
Spaz.Data.url_featuredlist     = "https://twitter.com/statuses/featured.json";

// Action URLs
Spaz.Data.url_update           = "https://twitter.com/statuses/update.json";
Spaz.Data.url_destroy_status   = "https://twitter.com/statuses/destroy/{{ID}}.json";
Spaz.Data.url_follow           = "https://twitter.com/friendships/create/{{ID}}.json";
Spaz.Data.url_stop_follow      = "https://twitter.com/friendships/destroy/{{ID}}.json";
Spaz.Data.url_start_notifications = "https://twitter.com/notifications/follow/{{ID}}.json";
Spaz.Data.url_stop_notifications  = "https://twitter.com/notifications/remove/{{ID}}.json";
Spaz.Data.url_favorites_create = "https://twitter.com/favourings/create/{{ID}}.json";
Spaz.Data.url_favorites_destroy= "https://twitter.com/favourings/destroy/{{ID}}.json";
Spaz.Data.url_verify_password  = "https://twitter.com/account/verify_credentials.json";


// temp storage for a section's ajax queries
Spaz.Data.$ajaxQueueStorage = [];

// Errors recorded during ajax queries
Spaz.Data.$ajaxQueueErrors = [];

// counter for # of finished ajax queries in a section
Spaz.Data.$ajaxQueueFinished = 0;




/**
 * Uses jQuery ajax to verify password
 */
Spaz.Data.verifyPassword = function() {
	
	var user = $('#username').val();
	var pass = $('#password').val();
	
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
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			var json = JSON.parse(data);
			if (json.authorized) {
				Spaz.verified = true;
				air.trace('verified; setting current user');
				Spaz.Prefs.setCurrentUser();
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
		},
		processData:false,
		type:"POST",
		url:Spaz.Data.url_verify_password,
	})
	
	// Spaz.dump(xhr);
	
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
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			if (msg.length == 140) {
				Spaz.UI.playSoundWilhelm();
				Spaz.UI.statusBar("Wilhelm!");
			} else {
				Spaz.UI.playSoundUpdate();
				Spaz.UI.statusBar("Update succeeded");
			}
			try {
				var entry = eval('['+data+']');
				Spaz.UI.addItemToTimeline(entry, Spaz.Section.friends);
				Spaz.UI.cleanupTimeline(Spaz.Section.friends);
				
			} catch(e) {
				Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name 
				+ ". Error message: " + e.message)
			}
			
			
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
	
	// Spaz.dump(xhr);
}




/* delete a status */
Spaz.Data.destroyStatus = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			Spaz.UI.hideLoading();
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				Spaz.UI.statusBar("ERROR: Timeout");
				return;
			}
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			Spaz.UI.statusBar("Status deleted");
			//Spaz.Data.loadUserTimelineData('tab-user');
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
	
	// Spaz.dump(xhr);
}


Spaz.Data.makeFavorite = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
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
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			//Spaz.Data.loadUserTimelineData('tab-user');
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
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
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
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.friends.tab));
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
	
	// Spaz.dump(xhr);
};


Spaz.Data.stopFollowingUser = function(userid) {
	
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
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
			Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
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
			Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.friends.tab));
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
	
	// Spaz.dump(xhr);
};





Spaz.Data.getDataForTimeline = function(section, force) {
	
	var username = Spaz.Prefs.getUser();
	if (!username || username == 'null' || username == 'undefined' || username == 'false') {
		if (confirm('Username not set. Enter this in Preferences?')) {
			Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.prefs.tab));
			Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
			Spaz.UI.prefsCPG.openPanel(0);
			Spaz.dump('set selected tab to PREFS');
		} else {
			Spaz.dump('user chose not to enter username')
		}
		Spaz.dump('hiding loading');
		Spaz.UI.hideLoading();
		return;
	}
	
	
	Spaz.dump('now:'+getTimeAsInt());
	Spaz.dump('then:'+section.lastcheck);
	Spaz.dump('difference:'+(getTimeAsInt() - section.lastcheck));
	Spaz.dump('section.mincachetime:'+section.mincachetime);
	
	if (force || (getTimeAsInt() - section.lastcheck) > section.mincachetime ) {
		section.lastcheck = getTimeAsInt();
		
		for (var i = 0; i < section.urls.length; i++) {
			Spaz.dump('section.urls['+i+']: '+ section.urls[i])
			Spaz.Data.getDataForUrl(section.urls[i], section);
			// data = data.concat(thisdata);
		}
	} else {
		Spaz.dump('Not loading data - section.mincachetime has not expired');
	}

}


Spaz.Data.onAjaxComplete = function(section, url, xhr, msg) {

	Spaz.Data.$ajaxQueueFinished++;

	if (xhr.readyState < 3) { // XHR is not yet ready. don't try to access response headers

		// alert("ERROR: Timeout");
		Spaz.dump("Error:Timeout on "+url);
		// Spaz.Data.onAjaxComplete(url, false);
		
	} else {

		Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
		Spaz.dump("STATUS:\n"+xhr.status);
		Spaz.dump("DATA:\n"+xhr.responseText);
		Spaz.dump("COMPLETE: " + msg);

		if (xhr.status == 400) {
			Spaz.dump("ERROR: 400 error - Exceeded request limit. Response from Twitter:\n"+xhr.responseText);
			Spaz.Data.$ajaxQueueErrors.push("Exceeded request limit. Only 70 API reqs are allowed per hour");
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}

		else if (xhr.status == 401) {
			Spaz.dump("ERROR: 401 error - Not Authenticated. Check your username and password.  Response from Twitter:\n"+xhr.responseText);
			Spaz.Data.$ajaxQueueErrors.push("401 error - Not Authenticated. Check your username and password.");
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}


		else if (xhr.responseText.length < 4) {
			Spaz.dump("Error:response empty from "+url);
			Spaz.Data.$ajaxQueueErrors.push("Empty response "+url)
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}

		try {
			var data = eval(xhr.responseText);
			if (!data || !data[0]) {
				Spaz.dump("Error: no data returned from "+url);
				Spaz.Data.$ajaxQueueErrors.push("Empty response "+url)
				// return;
			} else {
				Spaz.Data.$ajaxQueueStorage = Spaz.Data.$ajaxQueueStorage.concat(data);
			}

		} catch(e) {
			Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name 
			+ ". Error message: " + e.message)
			//Spaz.Data.$ajaxQueueErrors.push("An exception occurred when eval'ing the returned data");
		}
	
		Spaz.dump('Spaz.Data.$ajaxQueueFinished:'+Spaz.Data.$ajaxQueueFinished);
		Spaz.dump('section.urls.length:'+section.urls.length);
		Spaz.dump('Spaz.Data.$ajaxQueueStorage.length:'+Spaz.Data.$ajaxQueueStorage.length);
	
	}
	
	if (Spaz.Data.$ajaxQueueFinished >= section.urls.length) {
	
		Spaz.dump('setting $finished to 0');
		Spaz.Data.$ajaxQueueFinished = 0;

		Spaz.dump('adding entries');
		for (var i in Spaz.Data.$ajaxQueueStorage) {
			section.addItem(Spaz.Data.$ajaxQueueStorage[i]);
		}

		Spaz.dump('cleaning up timeline');
		section.cleanup();

		Spaz.dump('hiding loading');
		Spaz.UI.hideLoading();
	
		if (Spaz.Data.$ajaxQueueErrors.length > 0) {
			var errors = Spaz.Data.$ajaxQueueErrors.join("\n");
			Spaz.UI.alert(errors, "Error");
			Spaz.dump(errors);
			Spaz.Data.$ajaxQueueErrors = [];
		}
	
		Spaz.dump('emptying storage');
		Spaz.Data.$ajaxQueueStorage = [];
	}
}



// this retrieves data from a URL
Spaz.Data.getDataForUrl = function(url, section) {
	
	Spaz.dump('getting:'+url);

	Spaz.dump('section.timeline:'+section.timeline);
	
	Spaz.UI.statusBar("Checking for new data…");
	Spaz.UI.showLoading();
	
	// var xhr = $.ajax(
		
		
	var xhr = $.ajax({
		mode:'queue',
		
		
		complete:function(xhr, msg){
			section.onAjaxComplete(url,xhr,msg);
		},
		error:function(xhr, msg, exc) {
			if (xhr && xhr.responseText) {
				Spaz.dump("Error:"+xhr.responseText+" from "+url);
			} else {
				Spaz.dump("Error:Unknown from "+url);
			}
			
			// Spaz.UI.
		},
		// success:function(data) {
		// 	// alert("SUCCESS");
		// },
		beforeSend:function(xhr){
			var user = Spaz.Prefs.getUser();
			var pass = Spaz.Prefs.getPass();
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			xhr.setRequestHeader("Cookie", '');
		},
		processData:false,
		type:"GET",
		url:url,
		data:null
	});
	
}







Spaz.Data.loadDataForTab = function(tab, force, page) {
	if (!page || page < 1) {
		page = 1;
	}
	Spaz.dump('Loading data for tab:'+tab.id);
	var section = Spaz.Section.getSectionFromTab(tab)
	Spaz.dump('SECTION:'+section);
	Spaz.dump('load data for tab '+tab.id);
	switch (tab.id) {
		case 'tab-prefs':
			break;
		default:
			section.build(force);
			break;
	}
	return false
};




