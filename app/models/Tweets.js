/**
 * A model for interfacing with the Tweets depot
 * 
 */
var Tweets = function(replace) {
	var buckets_made = 0;
	var that = this;
	
	
	function onCreateBucket() {
	    buckets_made++;
	    if (buckets_made >= 3) {
	        that._init(replace);
	    }
	}
	
	this.bucket = new Lawnchair({name:"spaz_tweets", 'adaptor':'air-async', 'onCreate':onCreateBucket});
	this.dm_bucket = new Lawnchair({name:"spaz_dms", 'adaptor':'air-async', 'onCreate':onCreateBucket});
	this.user_bucket = new Lawnchair({name:"spaz_users", 'adaptor':'air-async', 'onCreate':onCreateBucket});
	
	this.user_bucket.each = function(callback, onFinish) {
		var cb = this.adaptor.terseToVerboseCallback(callback);
		var onfin = this.adaptor.terseToVerboseCallback(onFinish);
		this.all(function(results) {
			var l = results.length;
			for (var i = 0; i < l; i++) {
				cb(results[i], i);
			}
			onfin(l);
		});
	};
	
	this.user_bucket.match = function(condition, callback) {
		var is = (typeof condition == 'string') ? function(r){return eval(condition);} : condition;
		var cb = this.adaptor.terseToVerboseCallback(callback);
		var matches = [];
		this.each(function(record, index) {
			if (is(record)) {
				sch.debug("found match "+record.key);
				matches.push(record);
			}
		}, function(count) {
			sch.debug('Firing callback on array of matches('+count+')');
			cb(matches);
		});
	};
	
};

/**
 * max size of a bucket. We need to be able to cull older entries 
 */
Tweets.prototype.maxBucketSize = 20000;


Tweets.prototype._init  = function(replace) {
	if (replace === true) {
		sch.debug('REPLACING DEPOT!!!!!!!!!!!=======================');
		this.bucket.nuke();
		this.dm_bucket.nuke();
		this.user_bucket.nuke();
	} else {
		sch.debug('NOT REPLACING DEPOT!!!!!!!!!!====================');
	}
};

Tweets.prototype.get    = function(id, isdm, onSuccess, onFailure) {
	var bucket = this.getBucket(isdm);
	
	var that = this;
	
	sch.debug('ID PASSED IN AS '+id+', '+typeof id);
	/*
		make sure this is an integer
	*/	
	// id = parseInt(id, 10);
	sch.debug('ID CONVERTED TO '+id+', '+typeof id);
	
	bucket.get(id,
		function(data) { // wrapper for the passed onSuccess
			if (!data) {
				sch.debug("Couldn't retrieve id "+id+"; getting remotely");
				that.getRemote(
					id,
					isdm,
					function(data) {
						sch.debug('saving remotely retrieved message');
						bucket.save(data);
						onSuccess(data);
					},
					onFailure
				);
			} else {
				sch.debug("Retrieved id "+id+" from lawnchair bucket");
				onSuccess(data);
			}
		},
		onFailure
	);
};


Tweets.prototype.save   = function(object, onSuccess, onFailure) {
	var objid = object.id;
	
	sch.debug('ID PASSED IN AS '+objid+', '+typeof objid);
	/*
		make sure this is an integer
	*/
	// objid = parseInt(objid, 10);
	sch.debug('ID CONVERTED TO '+objid+', '+typeof objid);
	
	object.key = objid;

	if (!object.SC_is_dm) {
		sch.debug("Saving TWEET "+objid);
		this.bucket.save(object);
		if (object.user) {
			sch.debug("Saving user "+object.user.id);
			this.saveUser(object.user);			
		} else {
			sch.error('Tweet '+objid+' did not have a user object');
		}
	} else {
		sch.debug("Saving DM "+objid);
		this.dm_bucket.save(object);
		if (object.sender) {
			sch.debug("Saving user "+object.sender.id);
			this.saveUser(object.sender);
		} else {
			sch.error('Tweet '+objid+' did not have a sender object');
		}
		if (object.recipient) {
			sch.debug("Saving user "+object.recipient.id);
			this.saveUser(object.recipient);
		} else {
			sch.error('Tweet '+objid+' did not have a recipient object');
		}
	}
};

Tweets.prototype.remove = function(objid, isdm, onSuccess, onFailure) {
	isdm = isdm === true || false;

	var bucket = this.getBucket(isdm);
	
	// objid = parseInt(objid, 10);
	bucket.remove(objid);
};



Tweets.prototype.saveUser = function(userobj) { 
	// userobj.key = parseInt(userobj.id, 10);
	userobj.key = userobj.id;
	this.user_bucket.save(userobj);
};


Tweets.prototype.getUser = function(id, onSuccess, onFailure) {
	var that = this;
	var screen_name;
	
	sch.debug('passed id is "'+id+'"');
	
	var onDataSuccess = function(data) { // wrapper for the passed onSuccess
		if (!data) {
			sch.error("Couldn't retrieve id "+id+"; getting remotely");
			that.getRemoteUser(
				id,
				function(data) {
					sch.debug('saving remotely retrieved user');
					that.saveUser(data);
					onSuccess(data);
				},
				onFailure
			);
		} else {
			sch.debug("Retrieved user id "+id+" from lawnchair bucket");
			sch.debug(sch.enJSON(data));
			onSuccess(data);
		}
	};
	
	/*
		if the id starts with a '@', we have a screen_name
	*/
	if ((id+'').indexOf('@') === 0) {
		sch.debug('we have a screen name');
		screen_name = id.slice(1);
		sch.debug('screen name is '+screen_name);	
	}
	
	if (screen_name) {
		this.user_bucket.match(
			function(r) {
				if (r.screen_name == screen_name) {
					return true;
				}
			},
			function(r) {
				if (r && sch.isArray(r) && r.length > 0) {
					var match = r[0];
					onDataSuccess(match);
				} else {
					onDataSuccess(); // passing null will force it to get user remotely
				}
			}
		);
		
	/*
		otherwise, we assume we have a numeric ID
	*/
	} else {
		// int_id = parseInt(id, 10);
		

        // if (isNaN(id)) {
        //     sch.error('id passed to Tweets.getUser is NaN!');
        //     sch.error('trying as @username');
        //     this.getUser('@'+id, onSuccess, onFailure);
        // }

		this.user_bucket.get(
			id,
			onDataSuccess,
			onFailure
		);


	}
	
};

Tweets.prototype.removeUser = function(id) {
	this.user_bucket.remove(id);
};



Tweets.prototype.getSince = function(unixtime, isdm) {
	var bucket = this.getBucket(isdm);
	
	bucket.find(
		function(r) {
			return r.SC_created_at_unixtime > unixtime;
		}
	);
};





Tweets.prototype.getSinceId = function(since_id, isdm) {
	var bucket = this.getBucket(isdm);
	
	bucket.find(
		function(r) {
			return r.key > since_id;
		}
	);
};





Tweets.prototype.removeBefore = function(unixtime, isdm) {
	var bucket = this.getBucket(isdm);
	
	bucket.find(
		function(r) {
			return r.SC_created_at_unixtime < unixtime;
		},
		function(r) {
			bucket.remove(r);
		}
	);
};

Tweets.prototype.removeBeforeId = function(id, isdm) {
	var bucket = this.getBucket(isdm);
	
	bucket.find(
		function(r) {
			return r.key < id;
		},
		function(r) {
			bucket.remove(r);
		}
	);
};


Tweets.prototype.getBucket = function(isdm) {
	if (isdm) {
		return this.dm_bucket;
	} else {
		return this.bucket;
	}
};


Tweets.prototype.getRemote = function(id, isdm, onSuccess, onFailure) {
	this.initSpazTwit();
	
	sch.debug("getting message id "+id+" remotely!!");
	
	if (isdm) {
		sch.error($L('There was an error retrieving this direct message from cache'));
	} else {
		this.twit.getOne(id, onSuccess, onFailure);
	}
};

Tweets.prototype.getRemoteUser = function(id, onSuccess, onFailure) {
	this.initSpazTwit();
	
	sch.debug("getting user id "+id+" remotely!!");
	
	this.twit.getUser(id, onSuccess, onFailure);
};





Tweets.prototype.initSpazTwit = function(event_mode) {
	event_mode = event_mode || 'jquery'; // default this to jquery because we have so much using it
	
	var users = new SpazAccounts(Spaz.Prefs);
	
	this.twit = new SpazTwit({
		'event_mode':event_mode,
		'timeout':1000*60
	});
	this.twit.setSource(Spaz.Prefs.get('twitter-source'));
	
	
	var auth;
	if ( (auth = Spaz.Prefs.getAuthObject()) ) {
		this.twit.setCredentials(auth);
		Spaz.Data.setAPIUrl(this.twit);
	} else {
		// alert('NOT seetting credentials for!');
	}	

};



Tweets.prototype.onSaveSuccess = function(obj, msg) {
	dump('Tweet Saved');
};

Tweets.prototype.onSaveFailure = function(msg, obj) {
	dump('TweetModel Save Failed On : '+obj+' '+msg);
};

Tweets.prototype.reset = function() {
	this._init(true);
};


/**
 * Compatibility methods for old JR models
*/
Tweets.prototype.saveTweet = function(obj, onSuccess, onFailure) {
    
    this.save(obj, onSuccess, onFailure);
    
};

Tweets.prototype.tweetExists = function(id, onComplete) {
    var that = this;
	
	sch.debug('passed id is "'+id+'" '+typeof id);
	
		// id = parseInt(id, 10);

		this.user_bucket.get(
			id,
			function(data) {
			    if (!data) {
			        onComplete(false);
			    } else {
			        onComplete(true);
			    }
			},
			this.onSaveFailure
		);
};

Tweets.prototype.getById = function(twitter_id, isdm, onSuccess, onFailure) {
    this.get(twitter_id, isdm, onSuccess, onFailure);
};

Tweets.prototype.markRead = function(twitter_id, isdm, onSuccess, onFailure) {
    this.get(
        twitter_id,
        isdm,
        function(data) {
            if (data) {
                data.isRead = true;
                this.save(data);
            } else {
                sch.error('No such message');
            }
        },
        onFailure
    );
};

/*
    USER METHODS
*/
Tweets.prototype.userExists = function(id, onComplete) {
    var that = this;
	
	sch.debug('passed id is "'+id+'"');
	
	/*
		if the id starts with a '@', we have a screen_name
	*/
	if ((id+'').indexOf('@') === 0) {
		sch.debug('we have a screen name');
		screen_name = id.slice(1);
		sch.debug('screen name is '+screen_name);
		this.user_bucket.match(
			function(r) {
				if (r.screen_name == screen_name) {
					return onComplete(r.id);
				}
			},
			function(r) {
				if (r && sch.isArray(r) && r.length > 0) {
					var match = r[0];
					onComplete(match);
				} else {
					onComplete(false); // passing null will force it to get user remotely
				}
			}
		);
		
	/*
		otherwise, we assume we have a numeric ID
	*/
	} else {
		// id = parseInt(id, 10);

		this.user_bucket.get(
			id,
			function(data) {
			    if (!data) {
			        onComplete(false);
			    } else {
			        onComplete(data.id);
			    }
			},
			onFailure
		);
	}
};

Tweets.prototype.userExistsId = function(userid, onComplete) {
    // id = parseInt(userid, 10);
	var id = userid;

	this.user_bucket.get(
		id,
		function(data) {
		    if (!data) {
		        onComplete(false);
		    } else {
		        onComplete(data.id);
		    }
		},
		onFailure
	);
};

Tweets.prototype.findOrCreate = function(userobj, onComplete) {
    var user_id;
	
	sch.debug(userobj);
	
	user_id = this.userExistsId(userobj.id, true);
	
	if ( user_id ) {
		return user_id;
	} else {
		userobj.twitter_id = userobj.id;
		delete userobj.id;
		return this.create(userobj).id;
	}
};

Tweets.prototype.updateOrCreate = function(userobj) {
    this.saveUser(userobj);
};

Tweets.prototype.getUserById = function(userid, onSuccess, onFailure) {
    this.getUser(userid, onSuccess, onFailure);
};

Tweets.prototype.getUserByName = function(userid, onSuccess, onFailure) {
    this.getUser('@'+userid, onSuccess, onFailure);
};

Tweets.prototype.getTweetsByUser = function(screen_name, onSuccess) {
    var bucket = this.getBucket();
    
    bucket.match(
        function(r) {
            return r.user.screen_name.toLowerCase() == screen_name.toLowerCase();
        },
        onSuccess
    );
};

Tweets.prototype.setScreenName = function(twitter_id, screen_name) {
    this.getUser(
        twitter_id,
        function(data) {
            if (!data) {
                sch.error('No such userid found');
            } else {
                data.screen_name = screen_name;
                this.saveUser(data);
            }
        },
        this.onSaveFailure()
    );
};



/*
    DM METHODS
*/
Tweets.prototype.getDM    = function(id, onSuccess, onFailure) {
    this.get(id, true, onSuccess, onFailure);
};

Tweets.prototype.saveDM   = function(object, onSuccess, onFailure) {
    this.save(object, onSuccess, onFailure);
};

Tweets.prototype.removeDM = function(objid, onSuccess, onFailure) {
    this.remove(objid, true, onSuccess, onFailure);
};

Tweets.prototype.getDMSince = function(unixtime, onSuccess, onFailure) {
    return this.getSince(unixtime, true, onSuccess, onFailure);
};

Tweets.prototype.getDMSinceId = function(since_id, onSuccess, onFailure) {
    return this.getSinceId(since_id, true, onSuccess, onFailure);
};

Tweets.prototype.removeDMBefore = function(unixtime, onSuccess, onFailure) {
    return this.removeBefore(unixtime, true, onSuccess, onFailure);
};

Tweets.prototype.removeDMBeforeId = function(id, onSuccess, onFailure) {    
    return this.removeBeforeId(id, true, onSuccess, onFailure);
};

Tweets.prototype.getDMBucket = function() {
    return this.getBucket(true);
};

/**
 * a helper method to process a status object and get the screen names out of it 
 */
Tweets.prototype.getScreenNamesFromStatus = function(status_obj) {
	
	var screen_name = status_obj.user.screen_name;
	var names = sc.helpers.extractScreenNames(status_obj.SC_text_raw||status_obj.text);
	
	sch.debug('names for reply 2 are:'+names);
	
	if (names.length >= 1) {
	    var screen_name_exists = false;
		sch.debug('names for reply are:'+names);

		for (var i=0; i < names.length; i++) {
		    if (names[i].toLowerCase() == screen_name.toLowerCase()) {
		        screen_name_exists = true;
		    }
		    // remove references to current username
		    if (names[i].toLowerCase() == Spaz.Prefs.getUsername()) {
		        names.splice(i, 1);
		    }
		}

		// add screen_name if it is not in the message
		if (!screen_name_exists) {
		    names.unshift(screen_name);
		}
		sch.debug('names for reply 2 are:'+names);
	}
    
	
	return {screen_name:screen_name, names:names};
	
}
