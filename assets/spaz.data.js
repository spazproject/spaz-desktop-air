var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Data
*************/
if (!Spaz.Data) Spaz.Data = {};

$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true,
		// type:'POST'
		// cache:false
	}
);




Spaz.Data.getAPIURL = function(key) {
	
	var base_url = Spaz.Prefs.get('twitter-api-base-url');
	
	if (!base_url) {
		base_url = 'https://twitter.com/';
	}
	
	var urls = {}
	
	// Timeline URLs
	urls.public_timeline    = "statuses/public_timeline.json";
	urls.friends_timeline   = "statuses/friends_timeline.json";
	urls.user_timeline      = "statuses/user_timeline.json";
	urls.replies_timeline   = "statuses/replies.json";
	urls.favorites          = "favorites.json";
	urls.dm_timeline        = "direct_messages.json";
	urls.dm_sent            = "direct_messages/sent.json";
	urls.friendslist        = "statuses/friends.json";
	urls.followerslist      = "statuses/followers.json";
	urls.featuredlist       = "statuses/featured.json";

	// Action URLs 
	urls.update           	= "statuses/update.json";
	urls.destroy_status   	= "statuses/destroy/{{ID}}.json";
	urls.follow           	= "friendships/create/{{ID}}.json";
	urls.stop_follow      	= "friendships/destroy/{{ID}}.json";
	urls.start_notifications= "notifications/follow/{{ID}}.json";
	urls.stop_notifications = "notifications/leave/{{ID}}.json";
	urls.favorites_create 	= "favourings/create/{{ID}}.json";
	urls.favorites_destroy	= "favourings/destroy/{{ID}}.json";
	urls.verify_password  	= "account/verify_credentials.json";
	urls.ratelimit_status   = "account/rate_limit_status.json";

	// misc
	urls.test 			  	= "help/test.json";	
	urls.downtime_schedule	= "help/downtime_schedule.json";
	
	if (urls[key]) {
		air.trace("URL:"+base_url + urls[key]);
		return base_url + urls[key];
	} else {
		return false
	}
	
};


Spaz.Data.url_pingfm_update    = "http://api.ping.fm/v1/user.post";

// Ping.fm API key for Spaz
Spaz.Data.apikey_pingfm = '4f6e7a44cf584f15193e1f4c04704465';

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
		error:function() {
			// Spaz.verified = false;
			Spaz.dump('verification failed');
			Spaz.UI.statusBar("Verification failed");
			Spaz.UI.flashStatusBar();
			Spaz.Data.onAjaxError();
		},
		success:function(data){
			var json = JSON.parse(data);
			if (json.authorized) {
				// Spaz.verified = true;
				air.trace('verified; setting current user');
				Spaz.Prefs.setCurrentUser();
				Spaz.UI.statusBar("Verification succeeded");
				Spaz.UI.flashStatusBar();
				
				if (Spaz.Prefs.get('network-autoadjustrefreshinterval')) {
					Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
				}
								
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
		url:Spaz.Data.getAPIURL('verify_password'),
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
		timeout:1000*40, // updates can take longer, so we double the standard timeout 
		complete:Spaz.Data.onAjaxComplete,
		error:function(xhr, rstr){
			Spaz.dump("ERROR");
			$('#entrybox').attr('disabled', false);
			$('#updateButton').attr('disabled', false);
			$('#updateButton').val(oldButtonLabel);
			
			if (xhr.readyState < 3) {
				Spaz.dump("Update ERROR: Server did not confirm update");
				Spaz.UI.statusBar("ERROR: Server did not confirm update")
				return;
			}
			
			if (xhr.status != 200) { // sanity check
	 			Spaz.dump("ERROR: " + rstr);
				Spaz.UI.statusBar("ERROR: Server could not post update");
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
			
			// We mark it as read in the db
			Spaz.DB.markEntryAsRead(entry.id);

			// Prepend this to the timeline (don't scroll to top)
			Spaz.UI.addItemToTimeline(entry, Spaz.Section.friends, true);
			
			/*
				cleanup, but suppress the notifications by passing "true" as 2nd param
				surpress scrollTo with 3rd param
				don't sort with 4th param
			*/
			Spaz.UI.cleanupTimeline(Spaz.Section.friends.timeline, true, true, true);
		
			Spaz.UI.entryBox.reset();
			Spaz.dump('reset entryBox (Spry)');
			$('#entrybox')[0].blur();
			Spaz.dump('Blurred entryBox (DOM)');
			
			if (Spaz.Prefs.get('services-pingfm-enabled')) {
				Spaz.Data.updatePingFM(msg);
			}
			
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
		url:Spaz.Data.getAPIURL('update'),
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
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('destroy_status').replace(/{{ID}}/, postid),
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
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('favorites_create').replace(/{{ID}}/, postid),
	});
};



/**
 * Un-marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to un-favorite
 * @returns void
 */
Spaz.Data.makeNotFavorite = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	Spaz.UI.statusBar('Removing fav: ' + postid);
	Spaz.UI.showLoading();
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			Spaz.dump(data);
			Spaz.UI.statusBar('Removed fav: ' + postid);
			//Spaz.Data.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('favorites_destroy').replace(/{{ID}}/, postid),
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
		type:"POST",
		data:'&id='+userid,
		url:Spaz.Data.getAPIURL('follow').replace(/{{ID}}/, userid),
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
			Spaz.UI.statusBar("No longer following " + userid);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			// cookies just get in the way.  eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+userid,
		url:Spaz.Data.getAPIURL('stop_follow').replace(/{{ID}}/, userid),
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
		Spaz.dump("ERROR: Server did not respond");
		Spaz.UI.statusBar("ERROR: Server did not respond")
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
		Spaz.dump("ERROR: Server did not respond.");
	}
	if (xhr.responseText) {
		try {
			var errorInfo = JSON.parse(xhr.responseText)
			if (errorInfo.error) {
				Spaz.UI.statusBar('ERROR: "' + errorInfo.error+'"');
			} else {
				Spaz.UI.statusBar('ERROR: Server returned invalid data');
			}
		} catch(e) {
			Spaz.dump('Error parsing for JSON in error response');
			Spaz.UI.statusBar('ERROR: Server returned invalid data');
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
			Spaz.UI.showPrefs();
			setTimeout(Spaz.UI.openLoginPanel, 500);
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
			// Spaz.Data.$ajaxQueueErrors.push("Exceeded request limit. See Spaz FAQ");
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}

		else if (xhr.status == 401) {
			Spaz.dump("ERROR: 401 error - Not Authenticated. Check your username and password.  Response from Twitter:\n"+xhr.responseText);
			Spaz.Data.$ajaxQueueErrors.push("Not Authenticated. Check your username and password.");
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}


		else if (xhr.responseText.length < 0) {
			Spaz.dump("Error:response empty from "+url);
			Spaz.Data.$ajaxQueueErrors.push("Empty response from server for "+url)
			// Spaz.Data.onAjaxComplete(url, false);
			// return;
		}

		try {
			
			// air.trace(xhr.responseText);
			
			var data = parseJSON(xhr.responseText);
			
			// Spaz.dump(data)
			Spaz.dump(typeof(data))
			
			// if (!data || (!data[0] && !data.results)) {
			if (!data) {
				Spaz.dump("Error: no data returned from "+url);
				// Spaz.Data.$ajaxQueueErrors.push("Empty response "+url)
				// return;
			} else {
				/* This is a little hack for summize data */
				if (data.results) {
					data = data.results;
				}
				
				// air.trace('DATA->'+JSON.stringify(data));
				// Spaz.dump(data);
				// air.trace('ERROR->'+data.error)
				
				// if (data[0].error) {
				// 	air.trace("ERROR: "+data[0].error+" ["+data[0].request+"]");
				// 	Spaz.Data.$ajaxQueueErrors.push("ERROR:"+data[0].error);
				// } else if (data.error) {
				if (data.error) {
					Spaz.dump("ERROR: "+data.error+" ["+data.request+"]");
					Spaz.Data.$ajaxQueueErrors.push("Twitter says: \""+data.error+"\"");
				} else {
					Spaz.Data.$ajaxQueueStorage = Spaz.Data.$ajaxQueueStorage.concat(data);
				}
				
				
			}

		} catch(e) {
			Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name 
			+ ". Error message: " + e.message)
			//Spaz.Data.$ajaxQueueErrors.push("An exception occurred when eval'ing the returned data");
		}
	
		Spaz.dump('Spaz.Data.$ajaxQueueFinished:'+Spaz.Data.$ajaxQueueFinished);
		Spaz.dump('section.urls.length:'+section.urls.length);
		Spaz.dump('Spaz.Data.$ajaxQueueStorage.length:'+Spaz.Data.$ajaxQueueStorage.length);
		Spaz.dump('Spaz.Data.$ajaxQueueErrors.length:'+Spaz.Data.$ajaxQueueErrors.length);
	
	}
	
	if (Spaz.Data.$ajaxQueueFinished >= section.urls.length) {
	
		// air.trace('setting $finished to 0');
		Spaz.Data.$ajaxQueueFinished = 0;

		// air.trace('adding entries');
      
      Spaz.UI.statusBar('Adding '+Spaz.Data.$ajaxQueueStorage.length+' entries');
      
		if (Spaz.Data.$ajaxQueueStorage.length > 0) {
			// time.start('addingItems');
			for (var i in Spaz.Data.$ajaxQueueStorage) {
				Spaz.UI.statusBar('Adding status '+i+' of '+Spaz.Data.$ajaxQueueStorage.length);
            // air.trace('Adding status '+i+' of '+Spaz.Data.$ajaxQueueStorage.length);
				section.addItem(Spaz.Data.$ajaxQueueStorage[i]);
			}
			// time.stop('addingItems');
			
		}

		Spaz.dump('cleaning up timeline');
		section.cleanup();

		Spaz.dump('hiding loading');
		Spaz.UI.hideLoading();
		
		// air.trace(JSON.stringify(Spaz.Data.$ajaxQueueErrors))
		
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
		
	// if (url == Spaz.Data.url_friends_timeline) {
	// 	data = {}
	// }
		
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
	
	Spaz.UI.statusBar("Searching for '"+query+"'…");
	Spaz.UI.showLoading();
		
		
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



Spaz.Data.updatePingFM = function(msg) {
	if (!Spaz.Prefs.get('services-pingfm-enabled')) {
		return false;
	}
	
	// do not post dms
	if ( msg.match(/^(?:d\s).*/i) ) {
		air.trace("Will not post dms to ping.fm");
		return -1;
	}
	
	// only post replies if preference set
	if ( msg.match(/^(?:@\S).*/i) && !Spaz.Prefs.get('services-pingfm-sendreplies') ) {
		air.trace("Will not post replies to ping.fm");
		return -1;
	}
	
	var userappkey = Spaz.Prefs.get('services-pingfm-userappkey');
	var posttype   = Spaz.Prefs.get('services-pingfm-updatetype');
	
	Spaz.UI.statusBar("Sending update to Ping.fm");
	Spaz.UI.showLoading();

	var xhr = $.ajax({
		timeout:1000*40, // updates can take longer, so we double the standard timeout 
		error:function(xhr, rstr){
			Spaz.dump("ERROR");
			if (xhr.readyState < 3) {
				Spaz.dump("Update ERROR: Ping.fm did not confirm update. Who knows?");
				Spaz.UI.statusBar("ERROR: Ping.fm did not confirm update. Who knows?")
				return;
			}
			if (xhr.status != 200) { // sanity check
	 			Spaz.dump("ERROR: " + rstr);
				Spaz.UI.statusBar("ERROR: Ping.fm could not post update");
				Spaz.UI.flashStatusBar();				
			} else {

			}
		},
		success:function(xml){
			if ($(xml).find('rsp').attr('status') == 'OK') {
				Spaz.dump('SUCCESS:'+xml);
				Spaz.UI.statusBar("Ping.fm Update succeeded");
			} else {
				Spaz.dump('FAIL:'+xml);
				Spaz.UI.statusBar("Ping.fm Update failed");
			}
		},
		dataType:'xml',
		type:"POST",
		url:Spaz.Data.url_pingfm_update,
		data: {
			'api_key':Spaz.Data.apikey_pingfm,
			'user_app_key':userappkey,
			'post_method':posttype,
			'body':msg
		},
	});
	
	
};



Spaz.Data.getRateLimitInfo = function(callback, cbdata) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	if (!user || !pass) {
		air.trace('Dropping out of getRateLimitInfo because user or pass is not set');
		return false;
	}
	
	Spaz.UI.showLoading();
	Spaz.UI.statusBar('Asking Twitter for rate limit info…');
	
	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			air.trace(data);
			
			json = JSON.parse(data);
			
			
			if (callback) {
				callback(json, cbdata);
			}
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.getAPIURL('ratelimit_status'),
	});
}




Spaz.Data.uploadFile = function(opts) {
	var request = new air.URLRequest(opts.url);
	var loader = new air.URLLoader();

	var file = new air.File(opts.fileUrl); //use file.browseForOpen() on ur wish
	var stream = new air.FileStream();
	var buf = new air.ByteArray();

	stream.open(file, air.FileMode.READ);
	stream.readBytes(buf);

	PrepareMultipartRequest(request, buf, 'media', file.nativePath, opts.extra);

	loader.addEventListener(air.Event.COMPLETE, opts.complete, false, 0, true);
	// loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
	loader.addEventListener(air.Event.OPEN, opts.open, false, 0, true);
	loader.load(request);



	/**
	 * Multipart File Upload Request Helper Function
	 * 
	 * A function to help prepare URLRequest object for uploading.
	 * The script works without FileReference.upload().
	 * 
	 * @author FreeWizard
	 * 
	 * Function Parameters:
	 * void PrepareMultipartRequest(URLRequest request, ByteArray file_bytes,
	 *                              string field_name = "file", string native_path = "C:\FILE",
	 *                              object data_before = {}, object data_after = {});
	 * 
	 * Sample JS Code:
	 * <script>
	 * var request = new air.URLRequest('http://example.com/upload.php');
	 * var loader = new air.URLLoader();
	 * var file = new air.File('C:\\TEST.TXT'); //use file.browseForOpen() on ur wish
	 * var stream = new air.FileStream();
	 * var buf = new air.ByteArray();
	 * var extra = {
	 *     "id": "abcd"
	 *     };
	 * stream.open(file, air.FileMode.READ);
	 * stream.readBytes(buf);
	 * MultipartRequest(request, buf, 'myfile', file.nativePath, extra);
	 * loader.load(request);
	 * </script>
	 * 
	 * Sample PHP Code:
	 * <?php
	 * $id = $_POST['id'];
	 * move_uploaded_file($_FILES['myfile']['tmp_name'], '/opt/blahblah');
	 * ?>\
	 * @link http://rollingcode.org/blog/2007/11/file-upload-with-urlrequest-in-air.html
	 */
	function PrepareMultipartRequest(request, file_bytes, field_name, native_path, data_before, data_after) {
		var boundary = '---------------------------1076DEAD1076DEAD1076DEAD';
		var header1 = '';
		var header2 = '\r\n';
		var header1_bytes = new air.ByteArray();
		var header2_bytes = new air.ByteArray();
		var body_bytes = new air.ByteArray();
		var n;
		if (!field_name) field_name = 'file';
		if (!native_path) native_path = 'C:\FILE';
		if (!data_before) data_before = {};
		if (!data_after) data_after = {};
		for (n in data_before) {
			header1 += '--' + boundary + '\r\n'
					+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
					+ data_before[n] + '\r\n';
		}
		header1 += '--' + boundary + '\r\n'
				+ 'Content-Disposition: form-data; name="' + field_name + '"; filename="' + native_path + '"\r\n'
				+ 'Content-Type: application/octet-stream\r\n\r\n';
		for (n in data_after) {
			header2 += '--' + boundary + '\r\n'
					+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
					+ data_after[n] + '\r\n';
		}
		header2 += '--' + boundary + '--';
		header1_bytes.writeMultiByte(header1, "ascii");
		header2_bytes.writeMultiByte(header2, "ascii");
		body_bytes.writeBytes(header1_bytes, 0, header1_bytes.length);
		body_bytes.writeBytes(file_bytes, 0, file_bytes.length);
		body_bytes.writeBytes(header2_bytes, 0, header2_bytes.length);
		request.method = air.URLRequestMethod.POST;
		request.contentType = 'multipart/form-data; boundary='+boundary;
		request.data = body_bytes;
	}
};
// return;




/**
 * loads data for a particular tab (tabs are usually connected to a single Spaz.Section)
 * @param {Object} tab the DOM Element of the tab
 * @param {Boolean} force if true, force a reload even if mincachetime of this tab's section has not expired
 * @param {Boolean} reset resets all lastid/mincachetime data on this section
 * @returns false
 * @type Boolean
 * @see Spaz.Section.getSectionFromTab
 */

Spaz.Data.loadDataForTab = function(tab, force, reset) {

	if (!force) {
		force=false;
	}

	if (!reset) {
		reset=false;
	}

	Spaz.dump('Loading data for tab:'+tab.id);
	var section = Spaz.Section.getSectionFromTab(tab)
	Spaz.dump('SECTION:'+section);
	Spaz.dump('load data for tab '+tab.id);
	switch (tab.id) {
		case 'tab-prefs':
			break;
		default:
			section.build(force, reset);
			break;
	}
	return false
};




