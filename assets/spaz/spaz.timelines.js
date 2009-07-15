var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Timelines) Spaz.Timelines = {};

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
					
					data[i].text = sc.helpers.makeItemsClickable(data[i].text);
					no_dupes.push(data[i]);
				}
				
			};
			// alert(no_dupes.length);
			
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
			var err_msg = "There was an error retrieving your favorites";
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
			var query_info = data[1];
			var data = data[0];
			
			var data = data.reverse();
			var no_dupes = [];
			
			for (var i=0; i < data.length; i++) {
				
				/*
					only add if it doesn't already exist
				*/
				if (jQuery('#timeline-search div.timeline-entry[data-status-id='+data[i].id+']').length<1) {
					
					data[i].text = sc.helpers.makeItemsClickable(data[i].text);
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
			
			return Spaz.Tpl.parse('timeline_entry', obj);
			
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



Spaz.Timelines.public = new PublicTimeline();
Spaz.Timelines.search = new SearchTimeline();
