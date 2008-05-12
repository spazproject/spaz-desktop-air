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


/**
temp storage for a section's ajax queries
 */
Spaz.Data.$ajaxQueueStorage = [];

/**
Errors recorded during ajax queries
 */
Spaz.Data.$ajaxQueueErrors = [];

/**
counter for # of finished ajax queries in a section
 */
Spaz.Data.$ajaxQueueFinished = 0;




/**
 * Verifies the username and password in the prefs fields against the Twitter API
 * @returns void
 */
Spaz.Data.verifyPassword = function() {
	
	var user = $('#username').val();
	var pass = $('#password').val();
	
	Spaz.dump('user:'+user+' pass:********');
	
	Spaz.UI.statusBar("Verifying username and password");	
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			var json = JSON.parse(data);
			if (json.authorized) {
				// Spaz.verified = true;
				air.trace('verified; setting current user');
				Spaz.Prefs.setCurrentUser();
				Spaz.UI.statusBar("Verification succeeded");
				Spaz.UI.flashStatusBar();
			} else {
				// Spaz.verified = false;
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




/**
 * send a status update to Twitter
 * @param {String} msg the message to be posted
 * @param {String} username the username
 * @param {String} password the password
 * @returns void
 */
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
		complete:Spaz.Data.onAjaxComplete,
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
				if (Spaz.Prefs.get('sound-enabled')) {
					Spaz.UI.doWilhelm();
					Spaz.UI.statusBar("Wilhelm!");
					Spaz.UI.playSoundWilhelm(Spaz.UI.endWilhelm);
				} else {
					Spaz.dump('not doing Wilhelm because sound disabled');
				}
			} else {
				Spaz.UI.playSoundUpdate();
				Spaz.UI.statusBar("Update succeeded");
			}
			var entry = JSON.parse(data);
			
			Spaz.UI.addItemToTimeline(entry, Spaz.Section.friends);
			
			// cleanup, but suppress the notifications by passing "true" as 2nd param
			// surpress scrollTo with 3rd param
			Spaz.UI.cleanupTimeline(Spaz.Section.friends.timeline, true, true);
		
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
		data:"&source="+Spaz.Prefs.get('twitter-source')+"&status="+encodeURIComponent(msg),
//		data:"&status="+encodeURIComponent(msg),
	});
	
	// Spaz.dump(xhr);
}




/**
 * Deletes the given status
 * @param {Number} postid the id of the post to delete
 * @returns void
 */
Spaz.Data.destroyStatus = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
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



/**
 * Marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to favorite
 * @returns void
 */
Spaz.Data.makeFavorite = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.UI.statusBar('Adding fav: ' + postid);
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
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


/**
 * Follows the passed userid
 * @param {String} userid the userid to follow
 * @returns void
 */
Spaz.Data.followUser = function(userid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.dump('user:'+user+' pass:********');
		
	Spaz.UI.statusBar('Start following: ' + userid)
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
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


/**
 * Stop following the passed userid
 * @param {String} userid the userid to stop following
 * @returns void
 */
Spaz.Data.stopFollowingUser = function(userid) {
	
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.dump('user:'+user+' pass:********');
	
	Spaz.UI.statusBar('Stop following: ' + userid)
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
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


/**
 * Called by most of the Twitter ajax methods when complete
 * @param {Object} xhr the xhr object
 * @param {rstr} xhr a "response" string that indicates if the request was successful or not
 * @returns void
 */
Spaz.Data.onAjaxComplete = function(xhr, rstr) {
	Spaz.UI.hideLoading();
	if (xhr.readyState < 3) {
		Spaz.dump("ERROR: Timeout");
		Spaz.UI.statusBar("ERROR: Timeout")
		return;
	}
	Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
	Spaz.dump("DATA:\n"+xhr.responseText);
	Spaz.dump("COMPLETE: " + rstr);
};


/**
 * Called by most of the Twitter ajax methods on error
 * @param {Object} xhr the xhr object
 * @param {rstr} xhr a "response" string that indicates if the request was successful or not
 * @returns void
 */
Spaz.Data.onAjaxError = function(xhr,rstr) {
	Spaz.dump("ERROR: " + rstr);
	if (xhr.readyState < 3) {
		Spaz.dump("ERROR: Timeout");
	}
	if (xhr.responseText) {
		try {
			var errorInfo = JSON.parse(xhr.responseText)
			if (errorInfo.error) {
				Spaz.UI.statusBar('Error: "' + errorInfo.error+'"');
			} else {
				Spaz.UI.statusBar('Unknown error');
			}
		} catch(e) {
			Spaz.dump('Error parsing for JSON in error response');
			Spaz.UI.statusBar('Unknown error');
		}
	}
	// Spaz.UI.statusBar('Error : ' + xhr.responseText);
	Spaz.UI.flashStatusBar();
};



/**
 * Starts the process of data retrieval for a section
 * @param {object} section the Spaz.Section object
 * @param {boolean} force if true, forces a reload of the section even if mincachetime has not passed
 * @returns void
 */
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





Spaz.Data.onSectionAjaxComplete = function(section, url, xhr, msg) {

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


		else if (xhr.responseText.length < 0) {
			Spaz.dump("Error:response empty from "+url);
			// Spaz.Data.$ajaxQueueErrors.push("Empty response "+url)
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}

		try {
			var data = JSON.parse(xhr.responseText);
			if (!data || (!data[0] && !data.results)) {
				Spaz.dump("Error: no data returned from "+url);
				Spaz.Data.$ajaxQueueErrors.push("Empty response "+url)
				// return;
			} else {
				if (data.results) {
					data = data.results;
				}
				Spaz.dump(data);
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



/**
 * Retrieves data for the given URL, as part of a queue. Used by Spaz.Data.getDataForTimeline
 * @param {String} url The URL to request data from
 * @param {Object} section The Spaz.Section that is this request is getting data for
 * @returns void
 */
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





/**
 * Retrieves data for the given URL, as part of a queue. Used by Spaz.Data.getDataForTimeline
 * @param {String} url The URL to request data from
 * @param {Object} section The Spaz.Section that is this request is getting data for
 * @returns void
 */
Spaz.Data.searchSummize = function(query) {
	
	var section = Spaz.Section.search;
	var url = Spaz.Section.search[0].replace(/\{\{query\}\}/, query)
	
	Spaz.dump('getting:'+url);

	Spaz.dump('section.timeline:'+section.timeline);
	
	Spaz.UI.statusBar("Searching for 'query'…");
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
		},
		processData:false,
		type:"GET",
		url:url,
		data:null
	});
	
}




/**
 * loads data for a particular tab (tabs are usually connected to a single Spaz.Section)
 * @param {Object} tab the DOM Element of the tab
 * @param {Boolean} tab if true, force a reload even if mincachetime of this tab's section has not expired
 * @param {Number} page the page # to request; not used ATM because paging is disabled
 * @returns false
 * @type Boolean
 * @see Spaz.Section.getSectionFromTab
 */

Spaz.Data.loadDataForTab = function(tab, force, page) {
	if (!page || page < 1) {
		page = 1;
	}
	if (!force) {
		force=false;
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




