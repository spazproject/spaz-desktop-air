var Spaz; if (!Spaz) { Spaz = {}; }

/*************
Spaz.Data
*************/
if (!Spaz.Data) { Spaz.Data = {}; }

$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true
		// type:'POST'
		// cache:false
	}
);



Spaz.Data.getBaseURL = function() {
	var base_url = Spaz.Prefs.get('twitter-api-base-url');
	if (!base_url) {
		base_url = 'https://twitter.com/';
	}
	return base_url;
};


Spaz.Data.getAPIURL = function(key) {

	var base_url = Spaz.Data.getBaseURL(),
	    urls = {};

	// Timeline URLs
	urls.public_timeline	= "statuses/public_timeline.json";
	urls.friends_timeline	= "statuses/friends_timeline.json";
	urls.user_timeline		= "statuses/user_timeline.json";
	urls.replies_timeline	= "statuses/replies.json";
	urls.show				= "statuses/show.json";
	urls.favorites			= "favorites.json";
	urls.dm_timeline		= "direct_messages.json";
	urls.dm_sent			= "direct_messages/sent.json";
	urls.followerslist		= "statuses/friends.json";
	urls.followerslist		= "statuses/followers.json";
	urls.featuredlist		= "statuses/featured.json";

	// Action URLs
	urls.update				= "statuses/update.json";
	urls.destroy_status		= "statuses/destroy/{{ID}}.json";
	urls.follow				= "friendships/create/{{ID}}.json";
	urls.stop_follow		= "friendships/destroy/{{ID}}.json";
	urls.start_notifications= "notifications/follow/{{ID}}.json";
	urls.stop_notifications = "notifications/leave/{{ID}}.json";
	urls.favorites_create	= "favourings/create/{{ID}}.json";
	urls.favorites_destroy	= "favourings/destroy/{{ID}}.json";
	urls.verify_password	= "account/verify_credentials.json";
	urls.ratelimit_status	= "account/rate_limit_status.json";

	// misc
	urls.test				= "help/test.json";
	urls.downtime_schedule	= "help/downtime_schedule.json";

	if (urls[key]) {
		// sch.dump("URL:"+base_url + urls[key]);
		return base_url + urls[key];
	} else {
		return false;
	}

};


Spaz.Data.url_pingfm_update	   = "http://api.ping.fm/v1/user.post";

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
Spaz.Data.verifyCredentials = function() {

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	Spaz.Data.setAPIUrl(twit);
	twit.verifyCredentials();

	Spaz.UI.statusBar("Verifying username and password");
	Spaz.UI.showLoading();

};





/**
 * Deletes the given status
 * @param {Number} postid the id of the post to delete
 * @returns void
 */
Spaz.Data.destroyStatus = function(postid, onSuccess, onFailure) {

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('auth:'+auth);

	Spaz.UI.statusBar('Deleting post: ' + postid);
	Spaz.UI.showLoading();

	Spaz.Data.setAPIUrl(twit);
	twit.destroy(
		postid,
		function(data) {
			Spaz.UI.statusBar("Deleted post " + postid);
			Spaz.UI.hideLoading();
			if (onSuccess) {
				onSuccess(data);
			}
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar("Deleting post " + postid + " failed!");
			Spaz.UI.hideLoading();
			if (onFailure) {
				onFailure();
			}
		}
	);
};


Spaz.Data.retweet = function(postid, onSuccess, onFailure) {
	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	Spaz.Data.setAPIUrl(twit);

	Spaz.UI.statusBar('Retweeting post: ' + postid);
	Spaz.UI.showLoading();

	twit.retweet(
		postid,
		function(data) {
			Spaz.UI.statusBar("Retweeted post " + postid);
			Spaz.UI.hideLoading();
			if (onSuccess) {
				onSuccess(data);
			}
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar("Retweeting post " + postid + " failed!");
			Spaz.UI.hideLoading();
			if (onFailure) {
				onFailure();
			}
		}
	);
};


/**
 * Deletes the given DM
 * @param {Number} postid the id of the post to delete
 * @returns void
 */
Spaz.Data.destroyDirectMessage = function(postid, onSuccess, onFailure) {

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('auth:'+auth);

	Spaz.UI.statusBar('Deleting DM: ' + postid);
	Spaz.UI.showLoading();

	Spaz.Data.setAPIUrl(twit);

	twit.destroyDirectMessage(
		postid,
		function(data) {
			Spaz.UI.statusBar("Deleted DM " + postid);
			Spaz.UI.hideLoading();
			if (onSuccess) {
				onSuccess(data);
			}
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar("Deleting DM " + postid + " failed!");
			Spaz.UI.hideLoading();
			if (onFailure) {
				onFailure();
			}
		}
	);
};



/**
 * Marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to favorite
 * @returns void
 */
Spaz.Data.makeFavorite = function(postid, onSuccess, onFailure) {

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('auth:'+auth);

	sch.debug('Adding fav: ' + postid);
	Spaz.UI.statusBar('Adding favorite&hellip;');
	Spaz.UI.showLoading();

	Spaz.Data.setAPIUrl(twit);


	twit.favorite(
		postid,
		function(data) {
			var faved_element;
			sch.debug(data);
			sch.debug('Added fav: ' + postid);
			Spaz.UI.statusBar('Added favorite');
			Spaz.UI.hideLoading();
			if (onSuccess) {
				onSuccess();
			}
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			sch.debug("Adding fav " + postid + " failed!");
			Spaz.UI.statusBar('Error while adding favorite');
			Spaz.UI.hideLoading();
			if (onFailure) {
				onFailure();
			}
		}
	);

	//	var user = Spaz.Prefs.getUsername();
	//	var pass = Spaz.Prefs.getPassword();
	//
	//	Spaz.UI.statusBar('Adding fav: ' + postid);
	//	Spaz.UI.showLoading();
	//
	//	var xhr = $.ajax({
	//		dataType:'text',
	//		complete:Spaz.Data.onAjaxComplete,
	//		error:Spaz.Data.onAjaxError,
	//		success:function(data){
	//			var faved_element;
	//			sch.debug(data);
	//			Spaz.UI.statusBar('Added fav: ' + postid);
	//
	//			$('.timeline-entry[data-status-id='+postid+']').addClass('favorited');
	//			sch.debug(faved_element);
	//			//Spaz.Data.loadUserTimelineData('tab-user');
	//		},
	//		beforeSend:function(xhr){
	//			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
	//			// cookies just get in the way.	 eliminate them
	//			xhr.setRequestHeader("Cookie", "");
	//			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	//		},
	//		processData:false,
	//		type:"POST",
	//		data:'&id='+postid,
	//		url:Spaz.Data.getAPIURL('favorites_create').replace('{{ID}}', postid)
	//	});
};



/**
 * Un-marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to un-favorite
 * @returns void
 */
Spaz.Data.makeNotFavorite = function(postid, onSuccess, onFailure) {

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('auth:'+auth);

	sch.debug('Removing fav: ' + postid);
	Spaz.UI.statusBar('Removing favorite&hellip;');
	Spaz.UI.showLoading();

	Spaz.Data.setAPIUrl(twit);

	twit.unfavorite(
		postid,
		function(data) {
			var faved_element;
			sch.debug(data);
			sch.debug('Removed fav: ' + postid);
			Spaz.UI.statusBar('Removed favorite');
			Spaz.UI.hideLoading();
			if (onSuccess) {
				onSuccess();
			}
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			sch.debug("Removing fav " + postid + " failed!");
			Spaz.UI.statusBar('Error while removing favorite');
			Spaz.UI.hideLoading();
			if (onFailure) {
				onFailure();
			}
		}
	);

	//	var user = Spaz.Prefs.getUsername();
	//	var pass = Spaz.Prefs.getPassword();
	//
	//	Spaz.UI.statusBar('Removing fav: ' + postid);
	//	Spaz.UI.showLoading();
	//
	//	var xhr = $.ajax({
	//		dataType:'text',
	//		complete:Spaz.Data.onAjaxComplete,
	//		error:Spaz.Data.onAjaxError,
	//		success:function(data){
	//			var faved_element;
	//			sch.dump(data);
	//			Spaz.UI.statusBar('Removed fav: ' + postid);
	//			$('.timeline-entry[data-status-id='+postid+']').removeClass('favorited');
	//			//Spaz.Data.loadUserTimelineData('tab-user');
	//		},
	//		beforeSend:function(xhr){
	//			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
	//			// cookies just get in the way.	 eliminate them
	//			xhr.setRequestHeader("Cookie", "");
	//			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
	//		},
	//		processData:false,
	//		type:"POST",
	//		data:'&id='+postid,
	//		url:Spaz.Data.getAPIURL('favorites_destroy').replace('{{ID}}', postid)
	//	});
};



/**
 * Follows the passed userid
 * @param {String} userid the userid to follow
 * @param {function} [options.onSuccess] optional callback on success
 * @param {function} [options.onFailure] optional callback on failure
 * @returns void
 */
Spaz.Data.addFriend = function(userid, options) {
	// Give UI feedback immediately
	Spaz.UI.showLoading();

	if(!options){ options = {}; }

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('Spaz.Data.addFriend: auth: ' + auth);
	Spaz.Data.setAPIUrl(twit);
	
	Spaz.Data.getUser(userid, null, function(userData){
		var username = userData.screen_name;

		sch.debug('Spaz.Data.addFriend: ' +
			'Adding friend: ' + username + ' (' + userid + ')');
		Spaz.UI.statusBar('Following ' + username + '&hellip;');

		twit.addFriend(
			userid,
			function(userData) {
				Spaz.UI.statusBar('Now following ' + username);
				sch.debug('Spaz.Data.addFriend: ' +
					'Added friend: ' + username + ' (' + userid + ')');
				sch.debug(userData);

				if(options.onSuccess){ options.onSuccess(userData); }
				Spaz.UI.hideLoading();
			},
			function(xhr, msg, exc) {
				Spaz.UI.statusBar(
					'Failed to follow ' + username + '; try again later.');
				sch.error('Spaz.Data.addFriend: error: ' + xhr.responseText);
				if(options.onFailure){ options.onFailure(); }
				Spaz.UI.hideLoading();
			}
		);
	});
};


/**
 * Stop following the passed userid
 * @param {String} userid the userid to stop following
 * @param {function} [options.onSuccess] optional callback on success
 * @param {function} [options.onFailure] optional callback on failure
 * @returns void
 */
Spaz.Data.removeFriend = function(userid, options) {
	// Give UI feedback immediately
	Spaz.UI.showLoading();

	if(!options){ options = {}; }

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	sch.debug('Spaz.Data.removeFriend: auth: ' + auth);
	Spaz.Data.setAPIUrl(twit);

	Spaz.Data.getUser(userid, null, function(userData){
		var username = userData.screen_name;

		sch.debug('Spaz.Data.removeFriend: ' +
			'Removing friend: ' + username + ' (' + userid + ')');
		Spaz.UI.statusBar('Unfollowing ' + username + '&hellip;');

		twit.removeFriend(
			userid,
			function(userData) {
				Spaz.UI.statusBar('Stopped following ' + username);
				sch.debug('Spaz.Data.removeFriend: ' +
					'Removed friend: ' + username + ' (' + userid + ')');
				sch.debug(userData);

				if(options.onSuccess){ options.onSuccess(userData); }
				Spaz.UI.hideLoading();
			},
			function(xhr, msg, exc) {
				Spaz.UI.statusBar(
					'Failed to unfollow ' + username + '; try again later.');
				sch.error('Spaz.Data.removeFriend: error: ' + xhr.responseText);
				if(options.onFailure){ options.onFailure(); }
				Spaz.UI.hideLoading();
			}
		);
	});
};


Spaz.Data.blockUser = function(userid) {
	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	Spaz.Data.setAPIUrl(twit);

	twit.block(
		userid,
		function(data) {
			sch.debug(data);
			Spaz.UI.statusBar("Blocked " + userid);
			Spaz.UI.hideLoading();
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar("Block failed for " + userid);
			Spaz.UI.hideLoading();
		}
	);
};


Spaz.Data.reportUser = function(userid) {
	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	Spaz.Data.setAPIUrl(twit);

	twit.reportSpam(
		userid,
		function(data) {
			sch.debug(data);
			jQuery('div.timeline-entry[data-user_id="'+userid+'"], div.timeline-entry[data-user-screen_name="'+userid+'"]');
			Spaz.UI.statusBar("Blocked and reported " + userid);
			Spaz.UI.hideLoading();
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar("Block & report failed for " + userid);
			Spaz.UI.hideLoading();
		}
	);
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
		sch.dump("ERROR: Server did not respond");
		Spaz.UI.statusBar("ERROR: Server did not respond");
		return;
	}
	sch.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
	sch.dump("DATA:\n"+xhr.responseText);
	sch.dump("COMPLETE: " + rstr);
	return;
};


/**
 * Called by most of the Twitter ajax methods on error
 * @param {Object} xhr the xhr object
 * @param {rstr} xhr a "response" string that indicates if the request was successful or not
 * @returns void
 */
Spaz.Data.onAjaxError = function(xhr,rstr) {
	sch.dump("ERROR: " + rstr);
	if (xhr.readyState < 3) {
		sch.dump("ERROR: Server did not respond.");
	}
	if (xhr.responseText) {
		try {
			var errorInfo = JSON.parse(xhr.responseText);
			if (errorInfo.error) {
				Spaz.UI.statusBar('ERROR: "' + errorInfo.error+'"');
			} else {
				Spaz.UI.statusBar('ERROR: Server returned invalid data');
			}
		} catch(e) {
			sch.dump('Error parsing for JSON in error response');
			Spaz.UI.statusBar('ERROR: Server returned invalid data');
		}
	}
	// Spaz.UI.statusBar('Error : ' + xhr.responseText);
	Spaz.UI.flashStatusBar();
};














Spaz.Data.updatePingFM = function(msg) {
	//	if (!Spaz.Prefs.get('services-pingfm-enabled')) {
	//		return false;
	//	}
	//
	//	// do not post dms
	//	if ( msg.match(/^(?:d\s).*/i) ) {
	//		sch.dump("Will not post dms to ping.fm");
	//		return -1;
	//	}
	//
	//	// only post replies if preference set
	//	if ( msg.match(/^(?:@\S).*/i) && !Spaz.Prefs.get('services-pingfm-sendreplies') ) {
	//		sch.dump("Will not post replies to ping.fm");
	//		return -1;
	//	}
	//
	//	var userappkey = Spaz.Prefs.get('services-pingfm-userappkey');
	//	var posttype   = Spaz.Prefs.get('services-pingfm-updatetype');
	//
	//	Spaz.UI.statusBar("Sending update to Ping.fm");
	//	Spaz.UI.showLoading();
	//
	//	var xhr = $.ajax({
	//		timeout:1000*40, // updates can take longer, so we double the standard timeout
	//		error:function(xhr, rstr){
	//			sch.dump("ERROR");
	//			if (xhr.readyState < 3) {
	//				sch.dump("Update ERROR: Ping.fm did not confirm update. Who knows?");
	//				Spaz.UI.statusBar("ERROR: Ping.fm did not confirm update. Who knows?");
	//				Spaz.UI.hideLoading();
	//				return;
	//			}
	//			if (xhr.status != 200) { // sanity check
	//				sch.dump("ERROR: " + rstr);
	//				Spaz.UI.statusBar("ERROR: Ping.fm could not post update");
	//				Spaz.UI.flashStatusBar();
	//				Spaz.UI.hideLoading();
	//			} else {
	//
	//			}
	//
	//		},
	//		success:function(xml){
	//			if ($(xml).find('rsp').attr('status') == 'OK') {
	//				sch.dump('SUCCESS:'+xml);
	//				Spaz.UI.statusBar("Ping.fm Update succeeded");
	//				Spaz.UI.hideLoading();
	//			} else {
	//				sch.dump('FAIL:'+xml);
	//				Spaz.UI.statusBar("Ping.fm Update failed");
	//				Spaz.UI.hideLoading();
	//			}
	//		},
	//		dataType:'xml',
	//		type:"POST",
	//		url:Spaz.Data.url_pingfm_update,
	//		data: {
	//			'api_key':Spaz.Data.apikey_pingfm,
	//			'user_app_key':userappkey,
	//			'post_method':posttype,
	//			'body':msg
	//		},
	//	});


};



Spaz.Data.getRateLimitInfo = function(callback, cbdata) {

	Spaz.UI.statusBar('Asking Twitter for rate limit info&hellip;');
	Spaz.UI.showLoading();

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	sch.debug('auth:'+auth);
	Spaz.Data.setAPIUrl(twit);

	twit.getRateLimitStatus(
		function(data) {
			sch.debug(data);
			if (callback) {
				callback(data, cbdata);
			}
			Spaz.UI.hideLoading();
		},
		function(xhr, msg, exc) {
			sch.debug(msg);
			Spaz.UI.statusBar('Failed getting rate limit info!');
			Spaz.UI.hideLoading();
		}
	);

};




Spaz.Data.uploadFile = function(opts) {
	sch.dump(opts.url);

	var request = new air.URLRequest(opts.url),
	    loader = new air.URLLoader(),
	    file = new air.File(opts.fileUrl), //use file.browseForOpen() on ur wish
	    stream = new air.FileStream(),
	    buf = new air.ByteArray(),
	    contentType;

	function getContentType(fileType){
		switch (fileType) {
			case "JPG":  return "image/jpeg";
			case "JPEG": return "image/jpeg";
			case "PNG":  return "image/png";
			case "GIF":  return "image/gif";
			default:     return "image/jpeg";
		}
	}

	/**
	 * Multipart File Upload Request Helper Function
	 *
	 * A function to help prepare URLRequest object for uploading.
	 * The script works without FileReference.upload().
	 *
	 * @author FreeWizard
	 *
	 * Function Parameters:
	 * void prepareMultipartRequest(URLRequest request, ByteArray file_bytes,
	 *								string field_name = "file", string native_path = "C:\FILE",
	 *								object data_before = {}, object data_after = {});
	 *
	 * Sample JS Code:
	 *
	 * var request = new air.URLRequest('http://example.com/upload.php');
	 * var loader = new air.URLLoader();
	 * var file = new air.File('C:\\TEST.TXT'); //use file.browseForOpen() on ur wish
	 * var stream = new air.FileStream();
	 * var buf = new air.ByteArray();
	 * var extra = {
	 *	   "id": "abcd"
	 *	   };
	 * stream.open(file, air.FileMode.READ);
	 * stream.readBytes(buf);
	 * MultipartRequest(request, buf, 'myfile', file.nativePath, extra);
	 * loader.load(request);
	 *
	 *
	 * Sample PHP Code:
	 * <?php
	 * $id = $_POST['id'];
	 * move_uploaded_file($_FILES['myfile']['tmp_name'], '/opt/blahblah');
	 * ?>\
	 * @link http://rollingcode.org/blog/2007/11/file-upload-with-urlrequest-in-air.html
	 */
	function prepareMultipartRequest(request, file_bytes, file_type, field_name, native_path, data_before, data_after) {
		var boundary = '---------------------------1076DEAD1076DEAD1076DEAD',
		    header1 = '',
		    header2 = '\r\n',
		    header1_bytes = new air.ByteArray(),
		    header2_bytes = new air.ByteArray(),
		    body_bytes = new air.ByteArray(),
		    n;
		if (!field_name)  { field_name  = 'file'; }
		if (!file_type)   { file_type   = 'application/octet-stream'; }
		if (!native_path) { native_path = 'C:\FILE'; }
		if (!data_before) { data_before = {}; }
		if (!data_after)  { data_after  = {}; }
		for (n in data_before) {
			if(data_before.hasOwnProperty(n)){
				header1 += '--' + boundary + '\r\n' +
					'Content-Disposition: form-data; name="' + n + '"\r\n\r\n' +
					data_before[n] + '\r\n';
			}
		}
		header1 += '--' + boundary + '\r\n' +
			'Content-Disposition: form-data; name="' + field_name +
			'"; filename="' + native_path + '"\r\n' +
			'Content-Type: ' + file_type + '\r\n\r\n';
		for (n in data_after) {
			if(data_after.hasOwnProperty(n)){
				header2 += '--' + boundary + '\r\n' +
					'Content-Disposition: form-data; name="' + n + '"\r\n\r\n' +
					data_after[n] + '\r\n';
			}
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

	stream.open(file, air.FileMode.READ);
	stream.readBytes(buf);

	contentType = getContentType(file.extension.toUpperCase());
	sch.dump(contentType);
	prepareMultipartRequest(request, buf, contentType, 'media', file.nativePath, opts.extra);

	loader.addEventListener(air.Event.COMPLETE, opts.complete);
	// loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
	loader.addEventListener(air.Event.OPEN, opts.open);
	loader.load(request);
};
// return;




/**
 * loads data for a particular tab (tabs are usually connected to a single Spaz.Timeline)
 * @param {Object} tab the DOM Element of the tab
 * @param {Boolean} force if true, force a reload even if mincachetime of this tab's section has not expired
 * @param {Boolean} reset resets all lastid/mincachetime data on this section
 * @returns false
 * @type Boolean
 * @see Spaz.Timelines.getTimelineFromTab
 */

Spaz.Data.loadDataForTab = function(tab, force, reset) {

	if (!force) {
		force=false;
	}

	if (!reset) {
		reset=false;
	}

	switch (tab.id) {
		case 'tab-prefs':
			Spaz.AccountPrefs.setAccountListImages();
			break;
		case 'tab-friends':
			Spaz.Timelines.friends.activate();
			break;
		case 'tab-public':
			Spaz.Timelines['public'].activate();
			break;
		case 'tab-favorites':
			Spaz.Timelines.favorites.activate();
			break;
		case 'tab-userlists':
			Spaz.Timelines.userlists.activate();
			break;
		case 'tab-user':
			Spaz.Timelines.user.activate();
			break;
		case 'tab-search':
			$('#search-for')[0].focus();
			Spaz.Timelines.search.activate();
			break;
		case 'tab-followerslist':
			Spaz.Timelines.followers.activate();
			break;
		default:
			sch.error('Tab not implemented or something!');
			break;
	}
	
	return false;
};



/**
 * @param {integer|string} user_id
 * @param {DOMElement} target_el
 * @param {function} [onSuccess] a callback function taking one argument (the user obj)
 */
Spaz.Data.getUser = function(user_id, target_el, onSuccess) {


	sch.debug('GETTING:'+user_id);

	var userobj = null;
	target_el = target_el || document;

	function onComplete(userobj) {
		if (userobj) {
			sch.debug('Got userobj:'+userobj);
			if (userobj.twitter_id) {
				userobj.id = userobj.twitter_id;
			}
			if (onSuccess) {
				onSuccess(userobj);
			}
			sch.trigger('get_user_succeeded', target_el, userobj);
		} else {
			sch.debug('Getting userobj remotely in Spaz.Data.getUser');
			var twit = new SpazTwit({
				auth: Spaz.Prefs.getAuthObject(),
				event_target: target_el
			});
			Spaz.Data.setAPIUrl(twit);

			twit.getUser(
				user_id,
				function(data) {
					sch.debug('DATA FROM twit.getUser');
					sch.debug(data.screen_name);
					if (onSuccess) {
						onSuccess(data);
					}
					Spaz.TweetsModel.saveUser(data);
				},
				function() {
					sch.error('getUser failed for '+user_id);
				}
			);
		}
	}

	if (sch.isString(user_id) && user_id.indexOf('@') === 0) {
		userobj = Spaz.TweetsModel.getUser(user_id, onComplete);
	} else {
		userobj = Spaz.TweetsModel.getUserById(user_id, onComplete);
	}
};


Spaz.Data.getFriendshipInfo = function(target_user_id, onSuccess) {
	
	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});
	sch.debug('auth:'+auth);
	Spaz.Data.setAPIUrl(twit);

	twit.showFriendship(target_user_id, null,
		function(data) {
		    sch.debug('GOT RELATIONSHIP DATA:');
			sch.debug(sch.enJSON(data.relationship));
			if (onSuccess) {
				onSuccess(data);
			}
		},
		function(xhr, msg, exc) {
			sch.error(msg);
			Spaz.UI.statusBar($L('Failed getting friendship info!'));
		}
	);
	
};

/**
 * @param {integer|string} user_id
 * @param {DOMElement} target_el
 * @param {function} [onSuccess] a callback function taking one argument (the status obj)
 */
Spaz.Data.getTweet = function(status_id, target_el, onSuccess) {

	target_el = target_el || document;

	Spaz.TweetsModel.getById(status_id, false, function(statusobj) {
		if (statusobj) {
			sch.debug('loaded statusobj from model');
			if (onSuccess) {
				onSuccess(statusobj);
			}
			sch.trigger('get_one_status_succeeded', target_el, statusobj);
		}
	});

};


/**
 * @param {integer|string} integer id or the username prefixed with '@'
 * @param {DOMElement} target_el
 * @param {function} [onSuccess] a callback function taking one argument, the API response data
 * @param {function} [onFailure] a callback function taking no arguments
 */
Spaz.Data.getLists = function(userId, targetEl, onSuccess, onFailure){
	// TODO: Cache in local storage for the current user
	// - Clear cache when switching accounts, managing lists, etc.

	if(!targetEl) { targetEl = document; }

	var auth = Spaz.Prefs.getAuthObject(),
	    twit = new SpazTwit({auth: auth});

	Spaz.Data.getUser(userId, null, function(data){
		var username = data.screen_name;

		twit.setCredentials(auth);
		Spaz.Data.setAPIUrl(twit);

		sch.debug('Loading lists for @'+username+ '…');
		Spaz.UI.statusBar('Loading lists for @'+username+ '&hellip;');
		Spaz.UI.showLoading();

		twit.getLists(username,
			function(data){
				sch.debug('Spaz.Data.getLists: Loaded lists for @' + username);
				if(onSuccess){ onSuccess(data); }
				Spaz.UI.statusBar('Loaded lists for @' + username);
				Spaz.UI.hideLoading();
			},
			function(msg){
				sch.debug('Spaz.Data.getLists: Error loading lists for @' + username);
				if(onFailure){ onFailure(msg); }
				Spaz.UI.statusBar('Error loading lists for @' + username);
				Spaz.UI.hideLoading();
			}
		);
	});

};


/**
 * This sets the API url for the passed SpazTwit object to the current user's settings
 */
Spaz.Data.setAPIUrl = function(twit_obj) {
    if (Spaz.Prefs.getAccountType() === SPAZCORE_ACCOUNT_CUSTOM) {
	    twit_obj.setBaseURL(Spaz.Prefs.getCustomAPIUrl());
	} else {
	    twit_obj.setBaseURLByService(Spaz.Prefs.getAccountType());
	}
};


