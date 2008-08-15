if (!Spaz.Section) Spaz.Section = {};

Spaz.Section.init = function() {
	
	Spaz.Section.friends = {
		panel:    'panel-friends',
		timeline: 'timeline-friends', 
		tab:      'tab-friends',
		tabIndex: 0,
		urls: new Array( Spaz.Data.getAPIURL('friends_timeline'),
				Spaz.Data.getAPIURL('replies_timeline'),
				Spaz.Data.getAPIURL('dm_timeline')
			),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: true,
		canclear: true,
		mincachetime:60000*3,
		build: function(force, reset){
			
			// initialize the URLs
			if (this.lastcheck == 0 || reset) {
				var friends_timeline_params = "?count=100";
				var replies_timeline_params = "";
				var dm_timeline_params = "";
			} else {
				var lastCheckDate = new Date(this.lastcheck).toUTCString();
				
				/* even UTC doesn't seem to work. Disabling use of 'since' until it can work consistently */
				
				var friends_timeline_params = "?count=30&since="+encodeURIComponent(lastCheckDate);
				var replies_timeline_params = "?since="+encodeURIComponent(lastCheckDate);
				var dm_timeline_params = "?since="+encodeURIComponent(lastCheckDate);
				
				// var friends_timeline_params = "?count=20";
				// var replies_timeline_params = "";
				// var dm_timeline_params = "";
			}
			this.urls = new Array( Spaz.Data.getAPIURL('friends_timeline')+friends_timeline_params,
				Spaz.Data.getAPIURL('replies_timeline')+replies_timeline_params,
				Spaz.Data.getAPIURL('dm_timeline')+dm_timeline_params
			);
			time.start('getDataForTimeline');
			Spaz.Data.getDataForTimeline(this, force)
			time.stop('getDataForTimeline');
		},
		onAjaxComplete: function(url,xhr,msg){
			time.start('onSectionAjaxComplete');
			Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
			time.stop('onSectionAjaxComplete');
		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this);
		},
		cleanup: function(attribute){
			
			time.start('cleanup');
			time.start('cleanupTimeline');
			Spaz.UI.cleanupTimeline(this.timeline);
			time.stop('cleanupTimeline');
			
			time.start('initSuggestions');
			Spaz.Editor.initSuggestions();
			time.stop('initSuggestions');
			
			time.stop('cleanup');
			
			time.setReportMethod( function(l) { air.trace("TIMER====================\n"+l.join("\n")) });
			time.setLineReportMethod(function(l) { air.trace(l) });
			
			time.report();
		},
	}

	Spaz.Section.user = {
		panel:    'panel-user',
		timeline: 'timeline-user', 
		tab:      'tab-user',
		tabIndex: 1,
		urls:      new Array(Spaz.Data.getAPIURL('user_timeline'), Spaz.Data.getAPIURL('dm_sent')),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: false,
		canclear: true,
		mincachetime:60000*2,
		build: function(force){
			
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('user_timeline'), Spaz.Data.getAPIURL('dm_sent'));
			
			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url,xhr,msg){
			Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		cleanup: function(attribute){
			Spaz.UI.cleanupTimeline(this.timeline);
			Spaz.Editor.initSuggestions();
		},

	}

	Spaz.Section.public = {
		panel:    'panel-public',
		timeline: 'timeline-public', 
		tab:      'tab-public',
		tabIndex: 2,
		urls:      new Array(Spaz.Data.getAPIURL('public_timeline')),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: true,
		canclear: true,
		mincachetime:60000*1,
		build: function(force){
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('public_timeline'));
			
			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url,xhr,msg){
			Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		cleanup: function(attribute){
			Spaz.UI.cleanupTimeline(this.timeline);
		},
	
	}


	Spaz.Section.search = {
		panel:    'panel-search',
		timeline: 'timeline-search', 
		tab:      'tab-search',
		tabIndex: 2,
		urls:      new Array('http://summize.com/search.json?q={{query}}'),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: false,
		canclear: false,
		mincachetime:1,
	
		lastquery:null,
	
		build: function(force){

			if ($('#search-for').val().length>0) {

				// clear the existing results if this is a new query
				if ( this.lastquery !=  $('#search-for').val() ) {			

					$('#'+this.timeline+' .timeline-entry').remove();
				
				}
			
				Spaz.UI.statusBar("Searching for '"+$('#search-for').val()+"'…");
				Spaz.UI.showLoading();
		
				var url = 'http://summize.com/search.json';
				var data =	{
								"rpp"	:50,
								"q"		:$('#search-for').val(),
							};
				$.get(url, data, this.onAjaxComplete)

			}
		
		},
		onAjaxComplete: function(data,msg){
		
			Spaz.Section.search.lastquery
		
			var data = JSON.parse(data);
			Spaz.dump(data);
		
			var term = data.query;
			Spaz.Section.search.lastquery = term;
		
			if (data && data.results) {
			
				// $('#search-results').empty();
			
				function summizeToTweet(result) {
					var tweet = {
						"text"					: result.text,
						"created_at"			: result.created_at,
						"id"					: result.id,
						"in_reply_to_user_id"	: result.to_user_id,
					    "favorited"				: false,
					    "source"				: "web",
					    "truncated"				: false,
						"user" : {
							"id"				: result.from_user_id,
							"screen_name"		: result.from_user,
							"profile_image_url"	: result.profile_image_url,
							"protected"			: false,
						}
					}
				
					// air.trace(JSON.stringify(tweet));
				
					return tweet
				}
			
				Spaz.UI.statusBar("Found "+data.results.length+" results for '"+$('#search-for').val()+"'");
				Spaz.UI.hideLoading();
			
				for(var x =0; x<data.results.length; x++) {
					Spaz.Section.search.addItem( summizeToTweet(data.results[x]) )
				}
				Spaz.dump('cleaning up timeline');
				Spaz.Section.search.cleanup();
			
				// add search term highlighting
				$('#'+Spaz.Section.search.timeline + " div.timeline-entry").each( function() {
					$.highlight(this, term.toUpperCase());
				});
			}
		
		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		cleanup: function(attribute){
			Spaz.UI.cleanupTimeline(this.timeline, true, true);
		},
	
	}

	Spaz.Section.friendslist = {
		panel:    'panel-friendslist',
		timeline: 'timeline-friendslist', 
		tab:      'tab-friendslist',
		tabIndex: 3,
		urls:      new Array(Spaz.Data.getAPIURL('friendslist')),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: false,
		canclear: false,
		mincachetime:60000*15,
		build: function(force){
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('friendslist'));
			
			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url,xhr,msg){
			$('#'+Spaz.Section.friendslist.timeline).empty()
			Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
		},
		addItem: function(item) {
			item.timeline = this.timeline;
			item.base_url = Spaz.Prefs.get('twitter-base-url');
			
			// air.trace(JSON.stringify(item));
			
			// convert common long/lat formats
			if (item.location) {
				item.location = item.location.replace(/^(?:iphone|L|loc|spaz):\s*(-?[\d\.]+),?\s*(-?[\d\.]+)/i, "$1,$2");
			}
			
			var parsed = Spaz.Tpl.parse('app:/templates/friendslist-row.tpl', item);
			$('#'+this.timeline).append(parsed);
		},
		cleanup: function(){
			function sortfunc(a, b) {
				var keya = $(a).attr('screenname').toUpperCase();
				var keyb = $(b).attr('screenname').toUpperCase();
				if (keya < keyb) { return -1; }
				else { return 1; }
			};
			$("#"+Spaz.Section.friendslist.timeline + ' div.friendslist-row').sort(sortfunc, true).remove().appendTo('#'+Spaz.Section.friendslist.timeline);
			$("#"+Spaz.Section.friendslist.timeline + ' div.friendslist-row:even').addClass('even');
			$("#"+Spaz.Section.friendslist.timeline + ' div.friendslist-row:odd').addClass('odd');
			
			Spaz.Editor.initSuggestions();
		},
	
	}

	Spaz.Section.followerslist = {
		panel:    'panel-followerslist',
		timeline: 'timeline-followerslist', 
		tab:      'tab-followerslist',
		tabIndex: 4,
		urls:      new Array(Spaz.Data.getAPIURL('followerslist')),
		lastid:   0,
		lastcheck:0,
		currdata: null,
	 	prevdata: null,
		autoload: false,
		canclear: false,
		mincachetime:60000*15,
		build: function(force){
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('followerslist'));
			
			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url,xhr,msg){
			$('#'+this.timeline).empty()
			Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
		},
		addItem: function(item) {		
			item.timeline = this.timeline;
			item.base_url = Spaz.Prefs.get('twitter-base-url');
			
			// convert common long/lat formats
			if (item.location) {
				item.location = item.location.replace(/^(?:iphone|L|loc|spaz):\s*(-?[\d\.]+),?\s*(-?[\d\.]+)/i, "$1,$2");
			}
			
			var parsed = Spaz.Tpl.parse('app:/templates/friendslist-row.tpl', item);
			$('#'+this.timeline).append(parsed);
		},
		cleanup: function(){
			function sortfunc(a, b) {
				var keya = $(a).attr('screenname').toUpperCase();
				var keyb = $(b).attr('screenname').toUpperCase();
				if (keya < keyb) { return -1; }
				else { return 1; }
			};
			$("#"+Spaz.Section.followerslist.timeline + ' div.friendslist-row').sort(sortfunc, true).remove().appendTo('#'+Spaz.Section.followerslist.timeline);
			$("#"+Spaz.Section.followerslist.timeline + ' div.friendslist-row:even').addClass('even');
			$("#"+Spaz.Section.followerslist.timeline + ' div.friendslist-row:odd').addClass('odd');
			
			Spaz.Editor.initSuggestions();
		},
	}

	Spaz.Section.prefs = {
		panel:    'panel-prefs',
		timeline: 'timeline-prefs', 
		tab:      'tab-prefs',
		tabIndex: 5,
		autoload: false,
		canclear: false,
		build: function(force){},
		onAjaxComplete: function(url,xhr,msg){},
		addItem: function(item) {},
		cleanup: function(attribute){},
		// url:      'https://twitter.com/statuses/followers.json',
		// lastid:   0
	}



	Spaz.Section.getSectionFromTab = function(tab) {
		var sectionStr = tab.id.replace(/tab-/, '');
		Spaz.dump('section for tab:'+sectionStr);
		return Spaz.Section[sectionStr];
	};


	Spaz.Section.getSectionFromTimeline = function(timeline) {
		var sectionStr = timeline.id.replace(/timeline-/, '');
		Spaz.dump('section for tab:'+sectionStr);
		return Spaz.Section[sectionStr];
	};
	
}