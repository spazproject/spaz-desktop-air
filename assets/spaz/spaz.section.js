if (!Spaz.Section) Spaz.Section = {};


Spaz.Section.init = function() {

	Spaz.Section.friends = {
		panel: 'panel-friends',
		timeline: 'timeline-friends',
		wrapper: 'timelinewrapper-friends',
		tab: 'tab-friends',
		tabIndex: 0,
		urls: new Array(Spaz.Data.getAPIURL('friends_timeline'),
		Spaz.Data.getAPIURL('replies_timeline'),
		Spaz.Data.getAPIURL('dm_timeline')
		),
		lastid: 0,
		lastid_dm: 0,
		lastcheck: 0,
		currdata: null,
		prevdata: null,
		autoload: true,
		canclear: true,
		mincachetime: 60000 * 3,
		build: function(force, reset) {

			// initialize the URLs
			if (this.lastid == 0 || reset) {
				var friends_timeline_params = "?count=200";
				var replies_timeline_params = "";
				var dm_timeline_params = "";

				this.lastid = 0;
				this.lastid_dm = 0;
				this.lastcheck = 0;

			} else {
				// var lastCheckDate = new Date(this.lastcheck).toUTCString();
				/* even UTC doesn't seem to work. Disabling use of 'since' until it can work consistently */

				var friends_timeline_params = "?count=200&since_id=" + this.lastid;
				var replies_timeline_params = "?since_id=" + this.lastid;
				var dm_timeline_params = "?since_id=" + this.lastid_dm;

				// var friends_timeline_params = "?count=20";
				// var replies_timeline_params = "";
				// var dm_timeline_params = "";
			}
			this.urls = new Array(Spaz.Data.getAPIURL('friends_timeline') + friends_timeline_params,
				Spaz.Data.getAPIURL('replies_timeline') + replies_timeline_params,
				Spaz.Data.getAPIURL('dm_timeline') + dm_timeline_params
			);

			Spaz.dump('URLs:::' + this.urls.toString());

			time.start('getDataForTimeline');
			Spaz.Data.getDataForTimeline(this, force)
			time.stop('getDataForTimeline');
		},
		onAjaxComplete: function(url, xhr, msg) {

			

			/*
				Make this non-blocking
			*/
			var this_section = this;
			Spaz.Timers.add(function() {
				time.start('onSectionAjaxComplete');

				Spaz.UI.statusBar('Processing data…');
				Spaz.Data.onSectionAjaxComplete(this_section, url, xhr, msg);
				/*
					trigger the filtering by sending keyup
				*/
				Spaz.dump('triggering keyup for #filter-friends!');
				if ($('#filter-friends').val()) {
					$('#filter-friends').trigger('keyup');
				}

				time.stop('onSectionAjaxComplete');
				return false;				
			});
			
			
			
			
		},
		addItem: function(item) {

			/*
				We update the lastids here because it works best with the existing flow
			*/

			/* this is a dm */
			if (item.recipient_id) {
				if (item.id > this.lastid_dm) {
					this.lastid_dm = item.id;
				}
			} else {
				/* This is a reply or "normal" status */
				if (item.id > this.lastid) {
					this.lastid = item.id;
				}
			}

			Spaz.UI.addItemToTimeline(item, Spaz.Section.friends);
		},
		filter: function(terms) {
			$('#'+this.timeline + ' div.timeline-entry').removeClass('hidden');
			if (terms) {
				try {
					var filter_re = new RegExp(terms, "i");
					$('#'+this.timeline + ' div.timeline-entry').each(function(i) {
						if ( $(this).text().search(filter_re) == -1 ) {
							$(this).addClass('hidden');
						}
					});
				} catch(e) {
					air.trace(e.name+":"+e.message);
				}
				
			}
		},
		cleanup: function(attribute) {

			Spaz.UI.statusBar('Cleaning up entries…');

			time.start('cleanup');
			time.start('cleanupTimeline');
			Spaz.UI.cleanupTimeline(this.timeline);
			time.stop('cleanupTimeline');

			time.start('initSuggestions');
			Spaz.Editor.initSuggestions();
			time.stop('initSuggestions');

			time.stop('cleanup');

			Spaz.UI.statusBar('Done.');


			/*
			   A little memory check
			*/
			var currentMemory = air.System.totalMemory;

			if (window.lastTotalMemory > 0) {
				var diff = currentMemory - window.lastTotalMemory;
				Spaz.dump("MEMORY:" + currentMemory + " [diff: " + diff + "]");
			} else {
				Spaz.dump("MEMORY:" + currentMemory);
			}
			window.lastTotalMemory = currentMemory;

			/*
			Garbage collection, which may or may not help at all/
		 */
			// air.System.gc();
			// air.System.gc();

			time.setReportMethod(function(l) {
				air.trace("TIMER====================\n" + l.join("\n"))
			});
			time.setLineReportMethod(function(l) {
				air.trace(l)
			});

			time.report();
		},
	}

	Spaz.Section.user = {
		panel: 'panel-user',
		timeline: 'timeline-user',
		wrapper: 'timelinewrapper-user',
		tab: 'tab-user',
		tabIndex: 1,
		urls: new Array(Spaz.Data.getAPIURL('user_timeline'), Spaz.Data.getAPIURL('dm_sent')),
		lastid: 0,
		lastcheck: 0,
		currdata: null,
		prevdata: null,
		autoload: false,
		canclear: true,
		mincachetime: 60000 * 2,
		build: function(force) {

			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('user_timeline'), Spaz.Data.getAPIURL('dm_sent'));

			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url, xhr, msg) {
			Spaz.Data.onSectionAjaxComplete(this, url, xhr, msg);
			/*
				trigger the filtering by sending keyup
			*/
			$('#filter-user').trigger('keyup');

		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		filter: function(terms) {
			$('#'+this.timeline + ' div.timeline-entry').removeClass('hidden');
			if (terms) {
				try {
					var filter_re = new RegExp(terms, "i");
					$('#'+this.timeline + ' div.timeline-entry').each(function(i) {
						if ( $(this).text().search(filter_re) == -1 ) {
							$(this).addClass('hidden');
						}
					});
				} catch(e) {
					air.trace(e.name+":"+e.message);
				}
				
			}
		},
		cleanup: function(attribute) {
			Spaz.UI.cleanupTimeline(this.timeline);
			Spaz.Editor.initSuggestions();
		},

	}

	Spaz.Section.public = {
		panel: 'panel-public',
		timeline: 'timeline-public',
		wrapper: 'timelinewrapper-public',
		tab: 'tab-public',
		tabIndex: 2,
		urls: new Array(Spaz.Data.getAPIURL('public_timeline')),
		lastid: 0,
		lastcheck: 0,
		currdata: null,
		prevdata: null,
		autoload: true,
		canclear: true,
		mincachetime: 60000 * 1,
		build: function(force) {
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('public_timeline'));

			Spaz.Data.getDataForTimeline(this, force)
		},
		onAjaxComplete: function(url, xhr, msg) {
			Spaz.Data.onSectionAjaxComplete(this, url, xhr, msg);
			/*
				trigger the filtering by sending keyup
			*/
			$('#filter-public').trigger('keyup');
			
		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		filter: function(terms) {
			$('#'+this.timeline + ' div.timeline-entry').removeClass('hidden');
			if (terms) {
				try {
					var filter_re = new RegExp(terms, "i");
					$('#'+this.timeline + ' div.timeline-entry').each(function(i) {
						if ( $(this).text().search(filter_re) == -1 ) {
							$(this).addClass('hidden');
						}
					});
				} catch(e) {
					Spaz.dump(e.name+":"+e.message);
				}
			}
		},
		cleanup: function(attribute) {
			Spaz.UI.cleanupTimeline(this.timeline);
		},

	}


	Spaz.Section.search = {
		panel: 'panel-search',
		timeline: 'timeline-search',
		wrapper: 'timelinewrapper-search',
		tab: 'tab-search',
		tabIndex: 2,
		urls: new Array('http://summize.com/search.json?q={{query}}'),
		lastid: 0,
		lastcheck: 0,
		currdata: null,
		 prevdata: null,
		autoload: false,
		canclear: false,
		mincachetime: 1,

		lastquery: null,

		build: function(force) {

			if ($('#search-for').val().length > 0) {

				// clear the existing results if this is a new query
				if (this.lastquery != $('#search-for').val()) {

					$('#' + this.timeline + ' .timeline-entry').remove();

				}

				Spaz.UI.statusBar("Searching for '" + $('#search-for').val() + "'…");
				Spaz.UI.showLoading();

				var url = 'http://summize.com/search.json';
				var data = {
					"rpp": 50,
					"q": $('#search-for').val(),
				};
				$.get(url, data, this.onAjaxComplete)

			}

		},
		onAjaxComplete: function(data, msg) {

			Spaz.Section.search.lastquery

			var data = parseJSON(data);
			Spaz.dump(data);

			var term = data.query;
			Spaz.Section.search.lastquery = term;

			if (data && data.results) {

				// $('#search-results').empty();
				function summizeToTweet(result) {
					var tweet = {
						"text": result.text,
						"created_at": result.created_at,
						"id": result.id,
						"in_reply_to_user_id": result.to_user_id,
						"favorited": false,
						"source": "web",
						"truncated": false,
						"user": {
							"id": result.from_user_id,
							"screen_name": result.from_user,
							"profile_image_url": result.profile_image_url,
							"protected": false,
						}
					}

					// air.trace(JSON.stringify(tweet));
					return tweet
				}

				Spaz.UI.statusBar("Found " + data.results.length + " results for '" + $('#search-for').val() + "'");
				Spaz.UI.hideLoading();

				for (var x = 0; x < data.results.length; x++) {
					Spaz.Section.search.addItem(summizeToTweet(data.results[x]))
				}
				Spaz.dump('Search section cleaning up timeline');
				Spaz.Section.search.cleanup();

				// add search term highlighting
				$('#' + Spaz.Section.search.timeline + " div.timeline-entry").each(function() {
					$.highlight(this, term.toUpperCase());
				});
			}

		},
		addItem: function(item) {
			Spaz.UI.addItemToTimeline(item, this)
		},
		cleanup: function(attribute) {
			Spaz.UI.cleanupTimeline(this.timeline, true, true);
		},

	}

	Spaz.Section.friendslist = {
		panel: 'panel-friendslist',
		timeline: 'timeline-friendslist',
		wrapper: 'timelinewrapper-friendslist',
		tab: 'tab-friendslist',
		tabIndex: 3,
		urls: new Array(Spaz.Data.getAPIURL('friendslist'), Spaz.Data.getAPIURL('followerslist')),
		lastid: 0,
		lastcheck: 0,
		currdata: null,
		prevdata: null,
		autoload: false,
		canclear: false,
		mincachetime: 60000 * 15,

		$ajaxQueueFinished: false,
		$ajaxQueueStorage:	[],
		$ajaxQueueErrors:	[],

		friends_ids   : [],
		followers_ids : [],

		build: function(force) {
			/*
				Reset our URLs each time in case of API URL switch
			*/
			this.urls = new Array(Spaz.Data.getAPIURL('friendslist'), Spaz.Data.getAPIURL('followerslist'));

			var username = Spaz.Prefs.getUser();
			var password = Spaz.Prefs.getPass();

			if (!username || username == 'null' || username == 'undefined' || username == 'false') {
				Spaz.dump('hiding loading');
				Spaz.UI.hideLoading();
				return;
			}

			

			if (force || (getTimeAsInt() - this.lastcheck) > this.mincachetime ) {
				this.lastcheck = getTimeAsInt();
				
				
				var thisSec = this;
				/*
					get friends
				*/
				$.ajax({
					'url'	:'https://twitter.com/friends/ids.json',
					'async'	:false,
					'success':function(data) {
						// air.trace(data);
						// alert('got friends_ids');
						thisSec.friends_ids = JSON.parse(data);
					},
					'data':{
						'id':username
					}
				});
				
				/*
					get followers
				*/
				$.ajax({
					'url'	:'https://twitter.com/followers/ids.json',
					'async'	:false,
					beforeSend:function(xhr){
						xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ":" + password));
						xhr.setRequestHeader("Cookie", '');
					},
					'success':function(data) {
						// air.trace(data);
						// alert('got followers_ids');
						thisSec.followers_ids = JSON.parse(data);
					},
					'data':{
						'id':username
					}
				});
		
				for (var i = 0; i < this.urls.length; i++) {
					Spaz.dump('section.urls['+i+']: '+ this.urls[i])
		
					Spaz.UI.statusBar("Checking for new data…");
					Spaz.UI.showLoading();

					var section = this;

					var xhr = $.ajax({
						// mode:'queue',
						complete:function(xhr, msg){
							// air.trace(JSON.stringify(this.url));
							// air.trace('Getting data for url:'+this.url);
							section.onAjaxComplete(this.url,xhr,msg);
						},
						error:function(xhr, msg, exc) {
							if (xhr && xhr.responseText) {
								Spaz.dump("Error:"+xhr.responseText+" from "+url);
							} else {
								Spaz.dump("Error:Unknown from "+url);
							}
						},
						beforeSend:function(xhr){
							xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(username + ":" + password));
							xhr.setRequestHeader("Cookie", '');
						},
						processData:false,
						type:"GET",
						url:this.urls[i],
						data:null
					});
				}
			} else {
				Spaz.dump('Not loading data - section.mincachetime has not expired');
			}
		},
		onAjaxComplete: function(url, xhr, msg) {
	
			air.trace("\n=========================================\ncompleted:" +url);

			if (xhr.readyState < 3) { // XHR is not yet ready. don't try to access response headers
				Spaz.dump("Error:Timeout on "+thisurl);
			} else {
				Spaz.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
				Spaz.dump("STATUS:\n"+xhr.status);
				Spaz.dump("DATA:\n"+xhr.responseText);
				Spaz.dump("COMPLETE: " + msg);

				if (xhr.status == 400) {
					Spaz.dump("ERROR: 400 error - Exceeded request limit. Response from Twitter:\n"+xhr.responseText);
				}

				else if (xhr.status == 401) {
					Spaz.dump("ERROR: 401 error - Not Authenticated. Check your username and password.	Response from Twitter:\n"+xhr.responseText);
					this.$ajaxQueueErrors.push("Not Authenticated. Check your username and password.");
				}

				else if (xhr.responseText.length < 0) {
					Spaz.dump("Error:response empty from "+thisurl);
					this.$ajaxQueueErrors.push("Empty response from server for "+thisurl)
				}

				try {
					var data = parseJSON(xhr.responseText);
					Spaz.dump(typeof(data))

					if (!data) {
						Spaz.dump("Error: no data returned from "+thisurl);
					} else {
						/* This is a little hack for summize data */
						if (data.results) {
							data = data.results;
						}
						if (data.error) {
							Spaz.dump("ERROR: "+data.error+" ["+data.request+"]");
							this.$ajaxQueueErrors.push("Twitter says: \""+data.error+"\"");
						} else {
							// this.$ajaxQueueStorage = this.$ajaxQueueStorage.concat(data);
						}
					}
				} catch(e) {
					Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name + ". Error message: " + e.message);
				}

				air.trace('this.$ajaxQueueFinished:'+this.$ajaxQueueFinished);
				air.trace('this.urls.length:'+this.urls.length);
				air.trace('data.length:'+data.length);
				air.trace('this.$ajaxQueueErrors.length:'+this.$ajaxQueueErrors.length);
			}

			air.trace('Adding '+data.length+' entries from '+url);

			$('#' + Spaz.Section.friendslist.timeline).empty();

			if (data.length > 0) {
				time.start('addingItems');
				for (var i in data) {
					
					air.trace(this.friends_ids.length + ":" + this.followers_ids.length);
					
					if ( this.friends_ids.indexOf(data[i].id) > -1 ) {
						air.trace(data[i].id + " is your friend");
						data[i].is_following = true;
					}
					
					if ( this.followers_ids.indexOf(data[i].id) > -1 ) {
						air.trace(data[i].id + " is your follower");
						data[i].is_follower = true;
					}
					
					if (data[i].is_following && data[i].is_follower) {
						air.trace(data[i].id + " is your friend and follower");
						data[i].is_mutual = true;
					}

					this.addItem(data[i]);
				}
				time.stop('addingItems');
			}

			this.$ajaxQueueFinished++;
			if (this.$ajaxQueueFinished >= this.urls.length) {
				// this.$ajaxQueueFinished = 0;

				Spaz.dump('friendsList cleaning up timeline');
				this.cleanup();

				Spaz.dump('hiding loading');
				Spaz.UI.statusBar('Done.');
				Spaz.UI.hideLoading();

				if (this.$ajaxQueueErrors.length > 0) {
					var errors = this.$ajaxQueueErrors.join("\n");
					Spaz.UI.alert(errors, "Error");
					Spaz.dump(errors);
					this.$ajaxQueueErrors = [];
				}

				// Spaz.dump('emptying storage');
				// this.$ajaxQueueStorage = [];
			}
		},

		addItem: function(item, opts) {
			item.timeline = this.timeline;
			item.base_url = Spaz.Prefs.get('twitter-base-url');

			/*
				convert common long/lat formats
			*/
			if (item.location) {
				item.location = item.location.replace(/^(?:iphone|L|loc|spaz):\s*(-?[\d\.]+),?\s*(-?[\d\.]+)/i, "$1,$2");
			}

			var parsed = Spaz.Tpl.parse('friendslist_row', item);
			$('#' + this.timeline).append(parsed);				


		},
		cleanup: function() {
			function sortfunc(a, b) {
				var keya = $(a).attr('screenname').toUpperCase();
				var keyb = $(b).attr('screenname').toUpperCase();
				if (keya < keyb) {
					return - 1;
				}
				else {
					return 1;
				}
			};
			$("#" + this.timeline + ' div.friendslist-row').sort(sortfunc, true).remove().appendTo('#' + Spaz.Section.friendslist.timeline);
			$("#" + this.timeline + ' div.friendslist-row:even').addClass('even');
			$("#" + this.timeline + ' div.friendslist-row:odd').addClass('odd');
			$("#" + this.timeline + ' div.friendslist-row').find('img.user-image').one('load',
				function() {
					// alert('fadingIn');
					$(this).fadeTo('500', '1.0');
				}
			);


			Spaz.Editor.initSuggestions();
		},

	}

	// Spaz.Section.followerslist = {
	// 	panel: 'panel-followerslist',
	// 	timeline: 'timeline-followerslist',
	// 	wrapper: 'timelinewrapper-followerslist',
	// 	tab: 'tab-followerslist',
	// 	tabIndex: 4,
	// 	urls: new Array(Spaz.Data.getAPIURL('followerslist')),
	// 	lastid: 0,
	// 	lastcheck: 0,
	// 	currdata: null,
	// 	 prevdata: null,
	// 	autoload: false,
	// 	canclear: false,
	// 	mincachetime: 60000 * 15,
	// 	build: function(force) {
	// 		/*
	// 			Reset our URLs each time in case of API URL switch
	// 		*/
	// 		this.urls = new Array(Spaz.Data.getAPIURL('followerslist'));
	// 		Spaz.Data.getDataForTimeline(this, force)
	// 	},
	// 	onAjaxComplete: function(url, xhr, msg) {
	// 		$('#' + this.timeline).empty()
	// 		Spaz.Data.onSectionAjaxComplete(this, url, xhr, msg);
	// 	},
	// 	addItem: function(item) {
	// 		item.timeline = this.timeline;
	// 		item.base_url = Spaz.Prefs.get('twitter-base-url');
	// 
	// 		// convert common long/lat formats
	// 		if (item.location) {
	// 			item.location = item.location.replace(/^(?:iphone|L|loc|spaz):\s*(-?[\d\.]+),?\s*(-?[\d\.]+)/i, "$1,$2");
	// 		}
	// 
	// 		var parsed = Spaz.Tpl.parse('friendslist_row', item);
	// 		$('#' + this.timeline).append(parsed);
	// 	},
	// 	cleanup: function() {
	// 		function sortfunc(a, b) {
	// 			var keya = $(a).attr('screenname').toUpperCase();
	// 			var keyb = $(b).attr('screenname').toUpperCase();
	// 			if (keya < keyb) {
	// 				return - 1;
	// 			}
	// 			else {
	// 				return 1;
	// 			}
	// 		};
	// 		$("#" + Spaz.Section.followerslist.timeline + ' div.friendslist-row').sort(sortfunc, true).remove().appendTo('#' + Spaz.Section.followerslist.timeline);
	// 		$("#" + Spaz.Section.followerslist.timeline + ' div.friendslist-row:even').addClass('even');
	// 		$("#" + Spaz.Section.followerslist.timeline + ' div.friendslist-row:odd').addClass('odd');
	// 
	// 		$("#" + Spaz.Section.followerslist.timeline + ' div.friendslist-row').find('img.user-image').one('load',
	// 		function() {
	// 			// alert('fadingIn');
	// 			$(this).fadeTo('500', '1.0');
	// 		});
	// 
	// 	},
	// }

	Spaz.Section.prefs = {
		panel: 'panel-prefs',
		timeline: 'timeline-prefs',
		wrapper: '',
		tab: 'tab-prefs',
		tabIndex: 5,
		autoload: false,
		canclear: false,
		build: function(force) {},
		onAjaxComplete: function(url, xhr, msg) {},
		addItem: function(item) {},
		cleanup: function(attribute) {},
		// url:		 'https://twitter.com/statuses/followers.json',
		// lastid:	 0
	}



	Spaz.Section.getSectionFromTab = function(tab) {
		var sectionStr = tab.id.replace(/tab-/, '');
		Spaz.dump('section for tab:' + sectionStr);
		return Spaz.Section[sectionStr];
	};


	Spaz.Section.getSectionFromTimeline = function(timeline) {
		var sectionStr = timeline.id.replace(/timeline-/, '');
		Spaz.dump('section for tab:' + sectionStr);
		return Spaz.Section[sectionStr];
	};


}