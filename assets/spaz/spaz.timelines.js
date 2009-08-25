var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Timelines) Spaz.Timelines = {};



/**
 * Public timeline def 
 */
var FriendsTimeline = function(args) {
	
	var thisFT = this;
	
	this.twit = new SpazTwit();


	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-friends',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_combined_timeline_data',
		'failure_event':'error_combined_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*3600,
		'max_items':300,

		'request_data': function() {
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
};

FriendsTimeline.prototype.init = function(args) {
	
}

FriendsTimeline.prototype.activate = function(args) {
	// alert('called activate');
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
		
		'refresh_time':1000*3600,
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
 * Search timeline def 
 */
var SearchTimeline = function(args) {
	
	var thisST = this;
	
	this.query = null;
	this.lastquery = null;
	
	this.twit = new SpazTwit({
		event_target:$('#timeline-search').get(0)
	});
	
	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' :'#timeline-search',
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_search_timeline_data',
		'failure_event':'error_search_timeline_data',
		
		'refresh_time':1000*3600,
		'max_items':100,

		'request_data': function() {
			if ($('#search-for').val().length > 0) {
				thisST.query = $('#search-for').val();
				
				if (!thisST.lastquery) {
					thisST.lastquery = thisST.query;
				} else if (thisST.lastquery != thisST.query) {
					$('#timeline-search .timeline-entry').remove();
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
			// alert(no_dupes.length);
			
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


Spaz.Timelines.friends= new FriendsTimeline();
Spaz.Timelines.public = new PublicTimeline();
Spaz.Timelines.search = new SearchTimeline();

