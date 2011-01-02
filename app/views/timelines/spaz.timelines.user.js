
/**
 * User timeline def 
 */
var UserTimeline = function(args) {

	var thisUT			 = this,
		$timeline		 = $('#timeline-user'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();

	

	/*
		set up the user timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',
		
		'success_event':'new_user_timeline_data',
		'failure_event':'error_user_timeline_data',
		'event_target' :document,
		
		'refresh_time':1000*60*30, // 30 minutes
		'max_items': 200,

		'request_data': function() {
			var username = Spaz.Prefs.getUsername();

			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading @' + username + '\'s timeline&hellip;');
			Spaz.UI.showLoading();
			thisUT.markAsRead($timeline.selector + ' div.timeline-entry');

			var countmax = thisUT.timeline.max_items;
			var count = Spaz.Prefs.get('timeline-user-pager-count');

			thisUT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			Spaz.Data.setAPIUrl(thisUT.twit);
			sch.debug('username in UserTimeline is '+username);
			thisUT.twit.getUserTimeline(username, count);
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('user_timeline_data_success_start');
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    dataItem;
			
			for (i = 0, iMax = data.length; i < iMax; i++){
				dataItem = data[i];
				
				/*
					only add if it doesn't already exist
				*/
				if ($timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {
					
					no_dupes.push(dataItem);
					/*
						Save to DB via JazzRecord
					*/
					Spaz.TweetsModel.saveTweet(dataItem);
				}
				
			}

			/*
				process new items through filter chain
			*/			
			no_dupes = Spaz.TimelineFilters.other.processArray(no_dupes);

			$timelineWrapper.children('.loading, .new-user').hide();
			thisUT.timeline.addItems(no_dupes);

			/*
			 reapply filtering
			*/
			$('#filter-user').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // user is never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('user_timeline_data_success_finish');
			
		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the user timeline";
			Spaz.UI.statusBar(err_msg);
			$timelineWrapper.children('.loading').hide();

			/*
				Update relative dates
			*/
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');
			Spaz.UI.hideLoading();
		},
		'renderer': function(obj) {
			return Spaz.Tpl.parse('timeline_entry', obj);
		}
	});
	
	
	
};

UserTimeline.prototype = new AppTimeline();

