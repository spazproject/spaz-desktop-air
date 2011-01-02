
/**
 * Favorites timeline def 
 */
var FavoritesTimeline = function(args) {

	var thisFVT			 = this,
		$timeline		 = $('#timeline-favorites'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	this.favs_more_cursor = -1;

	/*
		set up the public timeline
	*/
	this.timeline  = new SpazTimeline({
		'timeline_container_selector' : $timeline.selector,
		'entry_relative_time_selector':'.status-created-at',

		'success_event':'new_favorites_timeline_data',
		'failure_event':'error_favorites_timeline_data',
		'event_target' :document,

		'refresh_time':1000*60*30, // 30 minutes
		'max_items':300,

		'request_data': function() {
			// Give UI feedback immediately
			if($timeline.is(':empty')){
				$timelineWrapper.children('.loading').show();
			}
			Spaz.UI.statusBar('Loading favorites&hellip;');
			Spaz.UI.showLoading();
			thisFVT.markAsRead($timeline.selector + ' div.timeline-entry');

			thisFVT.twit.setCredentials(Spaz.Prefs.getAuthObject());
			Spaz.Data.setAPIUrl(thisFVT.twit);
			thisFVT.twit.getFavorites();
		},
		'data_success': function(e, data) {
			
			Spaz.Hooks.trigger('favorites_timeline_data_success_start');
			
			data = data.reverse();
			var i, iMax,
			    no_dupes = [],
			    sui = new SpazImageURL(),
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
			thisFVT.timeline.addItems(no_dupes);

			/*
				reapply filtering
			*/
			$('#filter-favorites').trigger('keyup');


			sch.markAllAsRead($timeline.selector + ' div.timeline-entry'); // favorites are never "new"
			sch.updateRelativeTimes($timeline.selector + ' a.status-created-at', 'data-created-at');

			Spaz.UI.hideLoading();
			Spaz.UI.statusBar("Ready");
			
			Spaz.Hooks.trigger('favorites_timeline_data_success_finish');

		},
		'data_failure': function(e, error_obj) {
			// Give UI feedback immediately
			var err_msg = "There was an error retrieving the favorites timeline";
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
	
	
	this.loadMore = function() {
		sch.debug('this.favs_more_cursor:'+this.favs_more_cursor);

		this.refresh(this.favs_more_cursor);
	}
	
};

FavoritesTimeline.prototype = new AppTimeline();
