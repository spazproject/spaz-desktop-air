/**
 * Public timeline def 
 */
var PublicTimeline = function(args) {
	
	var thisTL = this;

	/*
		config
	*/
	this.$timeline        = $('#timeline-public');
	this.$timelineWrapper = this.$timeline.parent();
	this.twit             = new SpazTwit();
	this.max_items        = 300;
	this.entry_relative_time_selector  = '.status-created-at';
	this.entry_relative_time_attribute = 'data-created-at';
	
	/**
	 * refresh 
	 */
	this.refresh = function() {
		// Give UI feedback immediately
		if(thisTL.$timeline.is(':empty')){
			thisTL.$timelineWrapper.children('.loading').show();
		}
		Spaz.UI.statusBar($L('Loading public timeline&hellip;'));
		Spaz.UI.showLoading();
		thisTL.markAsRead();

		Spaz.Data.setAPIUrl(thisTL.twit);
		thisTL.twit.setCredentials(Spaz.Prefs.getAuthObject());
		thisTL.twit.getPublicTimeline(
			
			function(data) { // onsuccess
				Spaz.Hooks.trigger('public_timeline_data_success_start');

				// data = data.reverse();
				var i, iMax,
				    no_dupes = [],
				    dataItem; // "datum"?

				for (i = 0, iMax = data.length; i < iMax; i++){
					dataItem = data[i];

					/*
						only add if it doesn't already exist
					*/
					if (thisTL.$timeline.find('div.timeline-entry[data-status-id='+dataItem.id+']').length<1) {

						no_dupes.push(dataItem);

						Spaz.TweetsModel.saveTweet(dataItem);
					}

				}

				/*
					process new items through filter chain
				*/			
				no_dupes = Spaz.TimelineFilters['public'].processArray(no_dupes);
				
				/*
					if the .loading thingy is showing, hide it
				*/
				thisTL.$timelineWrapper.children('.loading').hide();
				
				/*
					add the items
				*/
				thisTL.addItems(no_dupes);

				/* reapply filtering */
				$('#filter-public').trigger('keyup');

				thisTL.markNotNew(); // public are never "new"
				thisTL.updateTimes();
				
				Spaz.UI.hideLoading();
				Spaz.UI.statusBar($L("Ready"));

				Spaz.Hooks.trigger('public_timeline_data_success_finish');
			},
			
			function(data) { // onfailure
				// Give UI feedback immediately
				var err_msg = $L("There was an error retrieving the public timeline");
				Spaz.UI.statusBar(err_msg);
				thisTL.$timelineWrapper.children('.loading').hide();

				thisTL.updateTimes();
				Spaz.UI.hideLoading();
			}
			
		);
	};
	
	
	
	this.markNotNew = function() {
		var sel = thisTL.$timeline.selector + ' div.timeline-entry';
		sch.markAllAsRead(sel);
	};

	/*
		Update relative dates
	*/	
	this.updateTimes = function() {
		sch.updateRelativeTimes(
			thisTL.$timeline.selector + ' ' + thisTL.entry_relative_time_selector,
			thisTL.entry_relative_time_attribute
		);
	};
	
	
	
	/**
	 * add items to timeline 
	 */
	this.addItems = function(items) {
		var html_items = this.renderItems(items);
		thisTL.$timeline.prepend(html_items);
		
		/**
		 * @TODO remove older items if we're over max_items 
		 */
	};
	
	
	/**
	 * render the items for the timeline 
	 */
	this.renderItems = function(items) {
		return Spaz.Tpl.parseArray('timeline_entry', items);
	};
	
	
	/**
	 * bind any special listeners 
	 */
	this.bindListeners = function() {
		/*
			bind load more button
		*/
		jQuery('#load-more-public').live('click', function(e) {
			thisTL.loadMore(e);
		});

	};

};

PublicTimeline.prototype = new AppTimeline();

