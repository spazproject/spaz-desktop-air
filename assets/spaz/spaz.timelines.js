var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Timelines) Spaz.Timelines = {};



/**
 * Friends timeline def 
 */
var FriendsTimeline = function(args) {
	
	var thisFT = this;
	
	this.twit = new SpazTwit();


	
	/*
		set up the Friends timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-friends',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_combined_timeline_data',
		'failure_event':'error_combined_timeline_data',
		'event_target' :document,
		
		'refresh_time':Spaz.Prefs.get('network-refreshinterval'),
		'max_items':300,

		'request_data': function() {
			sch.dump('REQUESTING DATA FOR FRIENDS TIMELINE =====================');
			sc.helpers.markAllAsRead('#timeline-friends div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisFT.twit.setCredentials(username, password);
			thisFT.twit.getCombinedTimeline();
			Spaz.UI.statusBar("Loading friends timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			var data = data.reverse();
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-friends div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].text = sc.helpers.makeClickable(data[i].text);
					no_dupes.push(data[i]);
					
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
					
				}
				
			};
			
			

			/*
				Record old scroll position
			*/
			var oldFirst  = jQuery('#timeline-friends div.timeline-entry:first');
			var $timeline = jQuery('#timeline-friends');
			var offset_before = oldFirst.offset().top;
			

			/*
				Add new items
			*/
			thisFT.timeline.addItems(no_dupes);


			/*
				set new scroll position
			*/
			var offset_after = oldFirst.offset().top;
			var offset_diff = Math.abs(offset_before - offset_after);
			if ($timeline.parent().scrollTop() > 0) {
				$timeline.parent().scrollTop( $timeline.parent().scrollTop() + offset_diff );
			}


			sc.helpers.markAllAsRead('#timeline-friends div.timeline-entry'); // public are never "new"
			sc.helpers.updateRelativeTimes('#timeline-friends a.status-created-at', 'data-created-at');
			jQuery('#timeline-friends div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-friends div.timeline-entry:even').addClass('even');
			jQuery('#timeline-friends div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving your timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-friends a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			if (obj.SC_is_dm) {
				return Spaz.Tpl.parse('timeline_entry_dm', obj);
			} else {
				return Spaz.Tpl.parse('timeline_entry', obj);
			}
			
			
		}
	});
	
	
	this.filter = function(terms) {
		jQuery('#timeline-friends div.timeline-entry').removeClass('hidden');
		if (terms) {
			try {
				var negate = false;
				if (terms.substring(0, NEGATION_TOKEN.length).toLowerCase() === NEGATION_TOKEN) {
					negate = true;
					terms  = terms.slice(NEGATION_TOKEN.length);
				}
				var filter_re = new RegExp(sch.trim(terms), "i");
				jQuery('#timeline-friends div.timeline-entry').each(function(i) {
					if (negate) {
						if ( jQuery(this).text().search(filter_re) > -1 ) {
							jQuery(this).addClass('hidden');
						}
					} else {
						if ( jQuery(this).text().search(filter_re) === -1 ) {
							jQuery(this).addClass('hidden');
						}
					}
				});
			} catch(e) {
				sch.dump(e.name+":"+e.message);
			}

		}
	};
	
};

FriendsTimeline.prototype.init = function(args) {
	
}

FriendsTimeline.prototype.activate = function(args) {
	
	
	
	this.timeline.start();
}

FriendsTimeline.prototype.deactivate = function(args) {
	
}

FriendsTimeline.prototype.destroy = function(args) {
	
}





/**
 * Public timeline def 
 */
var PublicTimeline = function(args) {
	
	var thisPT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-public',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_public_timeline_data',
		'failure_event':'error_public_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-public div.timeline-entry');
			thisPT.twit.getPublicTimeline();
			Spaz.UI.statusBar("Loading public timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			var data = data.reverse();
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-public div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].text = sc.helpers.makeClickable(data[i].text);
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			thisPT.timeline.addItems(no_dupes);

			sc.helpers.markAllAsRead('#timeline-public div.timeline-entry'); // public are never "new"
			sc.helpers.updateRelativeTimes('#timeline-public a.status-created-at', 'data-created-at');
			jQuery('#timeline-public div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-public div.timeline-entry:even').addClass('even');
			jQuery('#timeline-public div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the public timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-public a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('timeline_entry', obj);
			
		}
	});
	
	
	this.filter = function(terms) {
		jQuery('#timeline-public div.timeline-entry').removeClass('hidden');
		if (terms) {
			try {
				var negate = false;
				if (terms.substring(0, NEGATION_TOKEN.length).toLowerCase() === NEGATION_TOKEN) {
					negate = true;
					terms  = terms.slice(NEGATION_TOKEN.length);
				}
				var filter_re = new RegExp(sch.trim(terms), "i");
				jQuery('#timeline-public div.timeline-entry').each(function(i) {
					if (negate) {
						if ( jQuery(this).text().search(filter_re) > -1 ) {
							jQuery(this).addClass('hidden');
						}
					} else {
						if ( jQuery(this).text().search(filter_re) === -1 ) {
							jQuery(this).addClass('hidden');
						}
					}
				});
			} catch(e) {
				sch.dump(e.name+":"+e.message);
			}

		}
	};
	
	
};

PublicTimeline.prototype.init = function(args) {
	
}

PublicTimeline.prototype.activate = function(args) {
	// alert('called activate');
	this.timeline.start();
}

PublicTimeline.prototype.deactivate = function(args) {
	
}

PublicTimeline.prototype.destroy = function(args) {
	
}


/**
 * User timeline def 
 */
var UserTimeline = function(args) {
	
	var thisUT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-user',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_user_timeline_data',
		'failure_event':'error_user_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items':100,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-user div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisUT.twit.setCredentials(username, password);
			thisUT.twit.getUserTimeline(username);
			Spaz.UI.statusBar("Loading user timeline");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			var data = data.reverse();
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-user div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].text = sc.helpers.makeClickable(data[i].text);
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TweetModel.saveTweet(data[i]);
				}
				
			};
			
			thisUT.timeline.addItems(no_dupes);

			sc.helpers.markAllAsRead('#timeline-user div.timeline-entry'); // user is never "new"
			sc.helpers.updateRelativeTimes('#timeline-user a.status-created-at', 'data-created-at');
			jQuery('#timeline-user div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-user div.timeline-entry:even').addClass('even');
			jQuery('#timeline-user div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-user a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('timeline_entry', obj);
			
		}
	});
	
	
	this.filter = function(terms) {
		jQuery('#timeline-user div.timeline-entry').removeClass('hidden');
		if (terms) {
			try {
				var negate = false;
				if (terms.substring(0, NEGATION_TOKEN.length).toLowerCase() === NEGATION_TOKEN) {
					negate = true;
					terms  = terms.slice(NEGATION_TOKEN.length);
				}
				var filter_re = new RegExp(sch.trim(terms), "i");
				jQuery('#timeline-user div.timeline-entry').each(function(i) {
					if (negate) {
						if ( jQuery(this).text().search(filter_re) > -1 ) {
							jQuery(this).addClass('hidden');
						}
					} else {
						if ( jQuery(this).text().search(filter_re) === -1 ) {
							jQuery(this).addClass('hidden');
						}
					}
				});
			} catch(e) {
				sch.dump(e.name+":"+e.message);
			}

		}
	};
	
	
};

UserTimeline.prototype.init = function(args) {
	
}

UserTimeline.prototype.activate = function(args) {
	// alert('called activate');
	this.timeline.start();
}

UserTimeline.prototype.deactivate = function(args) {
	
}

UserTimeline.prototype.destroy = function(args) {
	
}



/**
 * Search timeline def 
 */
var SearchTimeline = function(args) {
	
	var thisST = this;
	
	this.query = null;
	this.lastquery = null;
	
	this.twit = new SpazTwit();
	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-search',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_search_timeline_data',
		'failure_event':'error_search_timeline_data',
		
		'event_target' :document,
		
		
		'refresh_time':1000*60*15, // 15 minutes
		'max_items':100,

		'request_data': function() {
			if (jQuery('#search-for').val().length > 0) {
				thisST.query = jQuery('#search-for').val();
				
				if (!thisST.lastquery) {
					thisST.lastquery = thisST.query;
				} else if (thisST.lastquery != thisST.query) {
					jQuery('#timeline-search .timeline-entry').remove();
				};
				
				// alert(thisST.lastquery+"\n"+thisST.query);
				
				// clear the existing results if this is a new query
				sc.helpers.markAllAsRead('#timeline-search div.timeline-entry');
				
				thisST.twit.search(thisST.query);
				thisST.lastquery = thisST.query;
				Spaz.UI.statusBar("Searching for '" + thisST.query + "'…");
				Spaz.UI.showLoading();
			}
		},
		'data_success': function(e, data) {
			sch.dump(e);
			var query_info = data[1];
			var data = data[0];
			
			var data = data.reverse();
			var no_dupes = [];
			var md = new Showdown.converter();
			
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-search div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].text = sc.helpers.makeClickable(data[i].text);

					if (Spaz.Prefs.get('usemarkdown')) {
						data[i].text = md.makeHtml(data[i].text);
						data[i].text = data[i].text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
					}
					
					no_dupes.push(data[i]);
					
				}
				
			};
			
			if (no_dupes.length > 0) {
				thisST.timeline.addItems(no_dupes);
			}
			

			sc.helpers.markAllAsRead('#timeline-search div.timeline-entry'); // search are never "new"
			sc.helpers.updateRelativeTimes('#timeline-search a.status-created-at', 'data-created-at');
			jQuery('#timeline-search div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-search div.timeline-entry:even').addClass('even');
			jQuery('#timeline-search div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving your favorites";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-search a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			
			var html = Spaz.Tpl.parse('timeline_entry', obj);
			return html;
			
		}
	});
};

SearchTimeline.prototype.init = function(args) {
	
}

SearchTimeline.prototype.activate = function(args) {
	this.timeline.start();
}

SearchTimeline.prototype.deactivate = function(args) {
	
}

SearchTimeline.prototype.destroy = function(args) {
	
}




/**
 * Followers/following timeline def 
 */
var FollowersTimeline = function(args) {
	
	var thisFLT = this;
	
	this.twit = new SpazTwit();

	
	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-followerslist',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'get_followerslist_succeeded',
		'failure_event':'get_followerslist_failed',
		'event_target' :document,
		
		'refresh_time':-1, // never automatically
		'max_items':200,

		'request_data': function() {
			sc.helpers.markAllAsRead('#timeline-followerslist div.timeline-entry');
			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();
			thisFLT.twit.setCredentials(username, password);
			thisFLT.twit.getFollowersList();
			Spaz.UI.statusBar("Loading followerslist");
			Spaz.UI.showLoading();
		},
		'data_success': function(e, data) {
			// alert('got follower data');
			var data = data.reverse();
			
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-followerslist div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					no_dupes.push(data[i]);
					/*
						Save to DB via JazzRecord
					*/
					TwUserModel.findOrCreate(data[i]);
				}
				
			};
			
			thisFLT.timeline.addItems(no_dupes);

			jQuery('#timeline-followerslist div.timeline-entry').removeClass('even').removeClass('odd');
			jQuery('#timeline-followerslist div.timeline-entry:even').addClass('even');
			jQuery('#timeline-followerslist div.timeline-entry:odd').addClass('odd');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
		},
		'data_failure': function(e, error_obj) {
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);

			/*
				Update relative dates
			*/
			sc.helpers.updateRelativeTimes('#timeline-followerslist a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			// sch.error(obj);
			return Spaz.Tpl.parse('followerslist_row', obj);
			
		}
	});
	
	
	this.filter = function(terms) {
		jQuery('#timeline-user div.timeline-entry').removeClass('hidden');
		if (terms) {
			try {
				var negate = false;
				if (terms.substring(0, NEGATION_TOKEN.length).toLowerCase() === NEGATION_TOKEN) {
					negate = true;
					terms  = terms.slice(NEGATION_TOKEN.length);
				}
				var filter_re = new RegExp(sch.trim(terms), "i");
				jQuery('#timeline-user div.timeline-entry').each(function(i) {
					if (negate) {
						if ( jQuery(this).text().search(filter_re) > -1 ) {
							jQuery(this).addClass('hidden');
						}
					} else {
						if ( jQuery(this).text().search(filter_re) === -1 ) {
							jQuery(this).addClass('hidden');
						}
					}
				});
			} catch(e) {
				sch.dump(e.name+":"+e.message);
			}

		}
	};
	
	
};

FollowersTimeline.prototype.init = function(args) {
	
}

FollowersTimeline.prototype.activate = function(args) {
	// alert('called activate');
	this.timeline.start();
}

FollowersTimeline.prototype.deactivate = function(args) {
	
}

FollowersTimeline.prototype.destroy = function(args) {
	
}




Spaz.Timelines.init = function() {
	Spaz.Timelines.friends   = new FriendsTimeline();
	Spaz.Timelines.user      = new UserTimeline();
	Spaz.Timelines.public    = new PublicTimeline();
	Spaz.Timelines.search    = new SearchTimeline();
	Spaz.Timelines.followers = new FollowersTimeline();
}

