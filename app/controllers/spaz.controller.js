/**
 * The controller handles interception of events and delegation to methods 
 * 
 * 
 */

var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Controller) Spaz.Controller = {};




/**
 * listen for new posting responses 
 */
sch.listen(document, 'update_succeeded', function(e) {
	Spaz.postPanel.reset();
	Spaz.postPanel.enable();
	var data = sch.getEventData(e);
	sch.trigger('new_combined_timeline_data', document.getElementById('timeline-friends'), data);
	$('#entrybox')[0].blur();
	

	// if (Spaz.Prefs.get('services-pingfm-enabled')) {
	// 	Spaz.Data.updatePingFM(msg);
	// }

});
sch.listen(document, 'update_failed', function(e) {
	Spaz.postPanel.enable();
	Spaz.UI.statusBar('Posting to twitter failed!');
});



/*
	Handle verifyCredentials
*/
sch.listen(document, 'verify_credentials_succeeded', function(e) {
	sch.dump('verified; setting current user');
	Spaz.Prefs.setCurrentUser();
	Spaz.UI.statusBar("Verification succeeded");
	Spaz.UI.flashStatusBar();

	if (Spaz.Prefs.get('network-autoadjustrefreshinterval')) {
		Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
	}
});

sch.listen(document, 'verify_credentials_failed', function(e) {
	sch.dump('verification failed');
	Spaz.UI.statusBar("Verification failed");
	Spaz.UI.flashStatusBar();
	Spaz.Data.onAjaxError(xhr, rstr);
});


/**
 * Event delegation handling 
 */
Spaz.Controller.initIntercept = function() {

	$('body').intercept('mouseover', {
		
			// '.TabbedPanelsTab':function(e) {
			// 	var tt = new Spaz_Tooltip($(this).attr('title'), {
			// 		'e'		:e,
			// 	});
			// 	tt.show();
			// },
		
			'.status-action[title]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.show();
			},
			'.user-screen-name[title]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.showUser($(this).attr('user-screen_name'));
			},
			'span.in-reply-to':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				sch.debug('IN REPLY TO');
				tt.showIRT($(this).attr('data-irt-status-id'));
			},
			'.user-image[title]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.showUser($(this).attr('user-screen_name'));
			},
			'a[href]':function(e) {
				var href = $(this).attr('href');
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.showURLPreview(href);
			},
			'a .highlight':function(e) {
				if ($(this).parents('a').attr('href')) {
					var href = $(this).parents('a').attr('href');
					var tt = new Spaz_Tooltip($(this).attr('title'), {
						'e'		:e,
						'trigger':this
					});
					tt.showURLPreview(href);
				}
			},
			'a[title]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.show();
			},
			'a[user-screen_name]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.showUser($(this).attr('user-screen_name'));
			},
			'input[title]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.show();
			},
			'.directory-user-followstatus':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.show();
			}
			
		})

		.intercept('mouseout', {
			'*':function(e) {
				Spaz.UI.hideTooltips();
			}
		})

		.intercept('click', {
			
			// '.TabbedPanelsTab':function(e) {
			// 	Spaz.UI.setSelectedTab(this);
			// },
			
			'#tab-public':function(e) {
				// alert('e.target');
				// Spaz.Timelines.public.activate();
			},
			
			'#filter-friends':function(e) {
				this.select();
			},
			'#filter-user':function(e) {
				this.select();
			},
			'#filter-public':function(e) {
				this.select();
			},
			'#refresh-friends':function(e) {
				Spaz.UI.reloadCurrentTab(true);
			},
			'#refresh-user':function(e) {
				Spaz.UI.reloadCurrentTab(true);
			},
			'#refresh-public':function(e) {
				Spaz.UI.reloadCurrentTab(true);
			},
			'#markread-friends':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
			},
			'#markread-user':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
			},
			'#markread-public':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
			},
			'#view-friends-menu .menuitem':function(e) {
				$('#view-friends-menu .menuitem').removeClass('selected');
				$(this).addClass('selected');
			},
			'#view-friends-menu-all':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#view-friends-menu-replies-dms':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#view-friends-menu-replies':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#view-friends-menu-dms':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#view-friends-menu-unread':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#view-friends-menu-custom':function(e) {
				Spaz.UI.setView(this.id);
			},
			'#prefs-open-folder':function(e) {
				Spaz.Sys.openAppStorageFolder();
			},
			'#followerslist-showfriends':function(e) {
				$('#timeline-followers').fadeOut();
				$('#timeline-followerslist').fadeIn();
			},
			'#followerslist-showfollowers':function(e) {
				$('#timeline-followerslist').fadeOut();
				$('#timeline-followers').fadeIn();
			},
			'#search-go':function(e) {
				Spaz.Timelines.search.activate();
			},
			'#search-help':function(e) {
				sc.helpers.openInBrowser('http://search.twitter.com/operators');
			},
			'#mainMenu-help':function(e) {
				Spaz.UI.showHelp();
			},
			'#mainMenu-prefs':function(e) {
				Spaz.UI.showPrefs();
			},
			'#mainMenu-about':function(e) {
				Spaz.UI.showAbout();
			},
			'#mainMenu-view-toggle':function(e) {
				Spaz.UI.toggleTimelineFilter();
			},
			'#mainMenu-view-reloadCurrentView':function(e) {
				Spaz.UI.reloadCurrentTab(true);
			},
			'#mainMenu-view-markAsReadCurrentView':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
			},
			'#mainMenu-view-clearReloadCurrentView':function(e) {
				Spaz.UI.clearCurrentTimeline();
				Spaz.UI.reloadCurrentTab(true);
			},
			'#mainMenu-sendDM':function(e) {
				Spaz.postPanel.prepDirectMessage('');
			},
			'#mainmenu-shortenLink':function(e) {
				Spaz.UI.showShortLink();
			},
			'#mainmenu-uploadImage':function(e) {
				Spaz.UI.uploadImage();
			},
			'#mainMenu-sendReply':function(e) {
				Spaz.postPanel.prepReply('');
			},
			'#mainMenu-followSpaz':function(e) {
				Spaz.Data.followUser('spaz');
			},
			'.mainMenu-account':function(e) {
				alert('click: ' + $(this).text());
			},
			'#mainMenu-accounts':function(e) {
				Spaz.UI.accountMaintenance();
			},

			'#entrybox-shortenText':function(e) {
				Spaz.postPanel.textarea.focus();
				Spaz.postPanel.shortenText.call(Spaz.postPanel);
				return false;
			},
			'#entrybox-shortenURLs':function(e) {
				Spaz.postPanel.textarea.focus();
				Spaz.postPanel.shortenURLs.call(Spaz.postPanel);
				return false;
			},

			'#irt-dismiss':function(e) {
				Spaz.postPanel.clearPostIRT();
				// $('#entrybox').focus();
			},


			// prefs buttons handlers
			'#prefs-autosetrefresh-button':function(e) {
				Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
			},


			// user context menu handlers
			'#userContextMenu-viewProfile':function(e) {
				Spaz.Sys.sc.helpers.openInBrowser(Spaz.Prefs.get('twitter-base-url')+$(this).attr('user-screen_name'))
			},
			'#userContextMenu-follow':function(e) {
				Spaz.Data.followUser($(this).attr('user-screen_name'));
			},
			'#userContextMenu-unfollow':function(e) {
				Spaz.Data.stopFollowingUser($(this).attr('user-screen_name'));
			},
			'#userContextMenu-sendReply':function(e) {
				Spaz.postPanel.prepReply($(this).attr('user-screen_name'));
			},
			'#userContextMenu-sendDM':function(e) {
				Spaz.postPanel.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'#userContextMenu-searchForUser':function(e) {
				var screen_name = $(this).attr('user-screen_name');
				var search_str = "from:"+screen_name+" OR to:"+screen_name;

				$('#search-for').val(search_str);
			    Spaz.Section.search.build();
			    Spaz.UI.showTab(3);
			},
			'#userContextMenu-filterByUser':function(e) {
				var screen_name = $(this).attr('user-screen_name');
				$('#filter-friends').val(screen_name);
				$('#filter-friends').trigger('keyup');
			    Spaz.UI.showTab(0);
			},
			'span.in-reply-to': function(e){
				var status_id = $(this).attr('data-status-id');
				var irt_status_id = $(this).attr('data-irt-status-id');
				Spaz.Conversation.build(status_id);
			},
			'a[href]':function(e) {
				var url = $(this).attr('href');
				sch.dump('Intercepted click on <a> and sending to '+url);
				sc.helpers.openInBrowser(url);
				return false;
			},
			'.user-screen-name':function(e) {
				var url = Spaz.Prefs.get('twitter-base-url')+$(this).attr('user-screen_name');
				sc.helpers.openInBrowser(url);
			},
			'.user-image':function(e) {
				var url = Spaz.Prefs.get('twitter-base-url')+$(this).attr('user-screen_name');
				sc.helpers.openInBrowser(url);
			},
			'.hashtag':function(e) {
				$('#search-for').val($(this).text());
				Spaz.UI.showTab(3);
				Spaz.Timelines.search.activate();
			},
			'.status-thumbnail':function(e) {
				var url = $(this).attr('data-href');
				sc.helpers.openInBrowser(url);
			},
			'.status-action-fav':function(e) {
				var entryid = $(this).attr('entry-id')
				var element = Spaz.UI.getElementFromStatusId(entryid)
				if ($(element).hasClass('favorited')) {
					Spaz.Data.makeNotFavorite(entryid);
				}
				else {
					Spaz.Data.makeFavorite(entryid);
				}
			},
			'.status-action-retweet':function(e) {
				var tweet_id = parseInt($(this).attr('entry-id'), 10);
				var tweetobj = TweetModel.getById( tweet_id );
				Spaz.postPanel.prepRetweet(tweetobj.user.screen_name, tweetobj.SC_text_raw);
			},
			'.status-action-dm':function(e) {
				Spaz.postPanel.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'.status-action-reply':function(e) {
				var tweet_id = parseInt($(this).attr('entry-id'), 10);
				var tweetobj = TweetModel.getById( tweet_id );
				Spaz.postPanel.prepReply(tweetobj.user.screen_name, tweetobj.twitter_id, tweetobj.SC_text_raw);
			},
			'.status-action-del':function(e) {
				Spaz.Data.destroyStatus($(this).attr('entry-id'))
			},
			'.directory-action-follow':function(e) {
				Spaz.Data.followUser($(this).attr('user-screen_name'));
			},
			'.directory-action-unfollow':function(e) {
				Spaz.Data.stopFollowingUser($(this).attr('user-screen_name'));
			},
			'.directory-user-location': function(e) {
				Spaz.UI.showLocationOnMap($(this).text());
			},
			'.timeline-entry':function(e) {
				Spaz.UI.selectEntry(this);
			},
			'.timeline-entry *':function(e) { // this one needs to be last so the more specific ones above take precedence
				var entry = $(this).parents('.timeline-entry').get(0);
				Spaz.UI.selectEntry(entry);
			},
			'a .highlight':function(e) { // this is for search-highlighted links
				if ($(this).parents('a').attr('href')) {
					sc.helpers.openInBrowser($(this).parents('a').attr('href'));
				}
				return false;
			},
			'a':function(e) {
				return false;
			},

			'document':function(e){
				$('#userContextMenu').hide();
			}

		})
		.intercept('contextmenu', {
			// 'div.timeline-entry .user, div.timeline-entry .user-image, div.timeline-entry .user-screen-name':function(e) {
			'.user,.user-image,.user-screen-name,a[user-screen_name]':function(e) {
				// sch.dump(this.outerHTML);
				var screen_name = $(this).attr('user-screen_name');
				Spaz.UI.showUserContextMenu($(this), screen_name);
			},
			'a[href]':function(e) {
				var url = $(this).attr('href');
				Spaz.UI.showLinkContextMenu($(this), url);
			}
		})
		.intercept('keyup', {
			'#filter-friends':function(e) {
				Spaz.Timelines.friends.filter( $(this).val() );
			},
			'#filter-user':function(e) {
				Spaz.Section.user.filter( $(this).val() );
			},
			'#filter-public':function(e) {
				Spaz.Timelines.public.filter( $(this).val() );
			}
		})



	// end intercept


	/*
		Normal bindings where intercept doesn't work
	*/


	$('#entrybox').focus(function(e) {
			Spaz.UI.showEntryboxTip();
			$('#entrybox-popup').fadeIn('fast');
		})
		.blur(function(e) {
			Spaz.UI.resetStatusBar();
			$("body").focus();
			$('#entrybox-popup').fadeOut('fast');
			return false;
		});


	/*
		Set-up invoke event for command-line processing
	*/
	air.NativeApplication.nativeApplication.addEventListener(air.InvokeEvent.INVOKE, invokeHandler);

	function invokeHandler (e) {
		sch.dump('Invoke args: '+e.arguments);
	}


	/*
		Set-up drag and drop events
	*/
	var target = document.getElementById('container');
	target.addEventListener("dragenter", dragEnterOverHandler);
	target.addEventListener("dragover", dragEnterOverHandler);
	target.addEventListener("drop", dropHandler);

    function dragEnterOverHandler(event){
        event.preventDefault();
    }

    function dropHandler(event){
		event.preventDefault();

		if (!Spaz.Prefs.get('services-twitpic-sharepassword') ) {
			if ( confirm('Uploading to Twitpic requires that you share your Twitter username and password with the service. Are you sure you want to do this?') ) {
				uploadDraggedImage(event);
			}
		} else {
			uploadDraggedImage(event);
		}

		/*
			Upload the dragged image to Twitpic
		*/
		function uploadDraggedImage(event) {
			var fileUrl = event.dataTransfer.getData("text/uri-list");

			sch.dump(fileUrl);

			if (fileUrl.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
				alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
				return;
			} else {
				Spaz.UI.uploadImage(fileUrl);
				return;
			}

		}


    }

};



/**
 * Sets up keyboard event handlers 
 */
Spaz.Controller.setKeyboardShortcuts = function() {
	Spaz.dump("Setting Shortcuts=================================================")
    Spaz.dump("os: " + air.Capabilities['os']);

	var Modkey = 'Meta';

	if (air.Capabilities['os'].search(/Windows/i) != -1) {
		Spaz.dump('THIS IS WINDOWS');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Linux/i) != -1) { // thx agolna
		Spaz.dump('THIS IS LINUX');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Mac/i) != -1) {
		Spaz.dump('THIS IS MACOS');
		Modkey = 'Meta';
	}

	Spaz.dump('Modkey is '+Modkey);

  shortcut.add(Modkey+Spaz.Prefs.get('key-newEntry'), function() {
   $('#entrybox').focus();
  })

	shortcut.add('F5', function() {
		Spaz.UI.reloadCurrentTab(true);
	})

	shortcut.add(Spaz.Prefs.get('key-reloadTimeline'), function() {
		Spaz.UI.clearCurrentTimeline();
		Spaz.UI.reloadCurrentTab(true, true);
	})

	shortcut.add(Modkey+Spaz.Prefs.get('key-showShortenWindow'), function() {
		Spaz.UI.showShortLink();
	});

	shortcut.add(Modkey+Spaz.Prefs.get('key-showUploadImageWindow'), function() {
		Spaz.UI.uploadImage();
	});


	shortcut.add(Modkey+'+Shift+M', function() {
		Spaz.UI.markCurrentTimelineAsRead();
	});




	shortcut.add('F1', function() {
		Spaz.UI.showHelp();
	});

	/*
		Added so we can open the preferences folder if the UI is hosed by bad CSS
	*/
	shortcut.add(Modkey+'+Shift+,', function() {
		Spaz.Sys.openAppStorageFolder();
	});

	shortcut.add(Modkey+Spaz.Prefs.get('key-reply'), function() {
			Spaz.dump('getting screenname from current selection');
			var screenname = $('div.ui-selected .user-screen-name').text();
			var irt_id = $('div.ui-selected .entry-id').text().replace(/(\[|\])/g, '');

			if (screenname) {
				Spaz.dump('username for reply is:'+screenname);
				// var username = '';
				Spaz.postPanel.prepReply(screenname, irt_id);
			}
		}, {
			'disable_in_input':false
	});




	// ****************************************
	// tabs shortcuts
	// ****************************************
	shortcut.add(Modkey+'+1', function() {
		Spaz.UI.showTab(0);
	})
	shortcut.add(Modkey+'+2', function() {
		Spaz.UI.showTab(1);
	})
	shortcut.add(Modkey+'+3', function() {
		Spaz.UI.showTab(2);
	})
	shortcut.add(Modkey+'+4', function() {
		Spaz.UI.showTab(3);
		$('#search-for')[0].focus();
	})
	shortcut.add(Modkey+'+5', function() {
		Spaz.UI.showTab(4);
	})
	shortcut.add(Modkey+'+6', function() {
		Spaz.UI.showTab(5);
	})
	// shortcut.add(Modkey+'+7', function() {
	// 	Spaz.UI.showTab(6);
	// })
	shortcut.add(Modkey+'+,', function() {
		Spaz.UI.showPrefs()
	})

	// ****************************************
	// Keys to navigate timeline
	// ****************************************
	shortcut.add(Modkey+'+down', function() {
		Spaz.Keyboard.move('down', '.reply');
	});
	shortcut.add(Modkey+'+up', function() {
		Spaz.Keyboard.move('up', '.reply');
	});
	shortcut.add(Modkey+'+Shift+down', function() {
		Spaz.Keyboard.move('down', '.dm');
	});
	shortcut.add(Modkey+'+Shift+up', function() {
		Spaz.Keyboard.move('up', '.dm');
	});
	shortcut.add(Modkey+'+End', function() {
		Spaz.Keyboard.move('down', ':last');
	});
	shortcut.add(Modkey+'+Home', function() {
		Spaz.Keyboard.move('up', ':first');
	});	
	shortcut.add('Down', function() {
			Spaz.Keyboard.move('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('Up', function() {
			Spaz.Keyboard.move('up');
		}, {
			'disable_in_input':true
	});
	shortcut.add(Modkey+'+J', function() {
		Spaz.Keyboard.move('down');
	});
	shortcut.add(Modkey+'+K', function() {
		Spaz.Keyboard.move('up');
	});
	shortcut.add('J', function() {
			Spaz.Keyboard.move('down');
		}, {
			'disable_in_input':true
	});
	shortcut.add('K', function() {
			Spaz.Keyboard.move('up');
		}, {
			'disable_in_input':true
	});

	shortcut.add(Modkey+Spaz.Prefs.get('key-toggle'), function() {
			Spaz.UI.toggleTimelineFilter();
		}, {
			propagate:false
	});


	/*
		Search box submit on Enter
	*/
	shortcut.add('Enter', function() {
			Spaz.Timelines.search.activate();
		}, {
			target:$('#search-for')[0],
			propagate:false
	});

	// ****************************************
	// editor shortcuts
	// ****************************************
	shortcut.add(Modkey+'+B', function() {
			Spaz.Editor.bold();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+'+I', function() {
			Spaz.Editor.italics();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+Spaz.Prefs.get('key-highlight-code'), function() {
			Spaz.Editor.code();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add(Modkey+'+U', function() {
			Spaz.Editor.link();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});
	shortcut.add('Enter', function() {
			Spaz.postPanel.submit();
		}, {
			target:$('#entrybox')[0],
			propagate:false
	});


	/*
		Username/password prefs -> save
	*/
	shortcut.add('Enter', function() {
			Spaz.Prefs.setPrefs();
		}, {
			target:$('#username')[0],
			propagate:false
	});
	shortcut.add('Enter', function() {
			Spaz.Prefs.setPrefs();
		}, {
			target:$('#password')[0],
			propagate:false
	});

}


