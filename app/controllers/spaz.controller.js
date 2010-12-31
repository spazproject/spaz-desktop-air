/**
 * The controller handles interception of events and delegation to methods 
 * 
 * 
 */

var Spaz; if (!Spaz) Spaz = {};

if (!Spaz.Controller) Spaz.Controller = {};



/*
	Handle verifyCredentials
*/
sch.listen(document, 'verify_credentials_succeeded', function(e) {
	sch.dump('verified; setting current user');
	Spaz.Prefs.setCurrentUser();
	Spaz.UI.statusBar("Verification succeeded");
	Spaz.UI.flashStatusBar();

	if (Spaz.Prefs.get('network-autoadjustrefreshinterval') && (Spaz.Prefs.getAccountType() != SPAZCORE_ACCOUNT_TWITTER)) {
		Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
	}
});

sch.listen(document, 'verify_credentials_failed', function(e) {
	sch.dump('verification failed');
	Spaz.UI.statusBar("Verification failed");
	Spaz.UI.flashStatusBar();
	Spaz.Data.onAjaxError(xhr, rstr);
});



/*
	right before we switch an account…
*/
sch.listen(document, 'before_account_switched', function(e, account) {
	sch.debug('about to switch accounts');
	sch.debug('account:'+sch.enJSON(account));
	if(account){
		// `account` may be null if this is your first account, or your
		// prefs are in a broken state.
		var old_acct_class = account.username + '-at-' + account.type;
		$('#container').removeClass(old_acct_class);
	}

	Spaz.TweetsModel.reset();
});

/*
	after we switch an account…
*/
sch.listen(document, 'account_switched', function(e, account) {
	sch.debug('switched accounts');
	sch.debug('account:'+sch.enJSON(account));
	function rateLimitsSet() {
		Spaz.Timelines.resetTimelines();
		
		var new_acct_class = Spaz.Prefs.getUsername() + "-at-" + Spaz.Prefs.getAccountType();
		$('#container').addClass(new_acct_class);


		Spaz.UI.statusBar('Changed account to ' +
						Spaz.Prefs.getUsername() +
						"@" +
						Spaz.Prefs.getAccountType());
		Spaz.UI.flashStatusBar();

		if (Spaz.Prefs.get('timeline-loadonswitch')) {
			$('#tab-friends').trigger('click');
		}
	}


	sch.dump('switching accounts');
	Spaz.UI.statusBar('Switching accounts…');
	
	if (Spaz.Prefs.get('network-autoadjustrefreshinterval') && (Spaz.Prefs.getAccountType() != SPAZCORE_ACCOUNT_TWITTER)) {
		Spaz.Data.getRateLimitInfo(function(json, cbdata) {
			sch.debug(json);
			sch.debug(cbdata);
			Spaz.Prefs.setRateLimit(json, cbdata);
			rateLimitsSet();
		});
	} else {
		rateLimitsSet();
	}

	Spaz.Drafts.rebuildList();
	Spaz.Drafts.updateCounter();

});


/**
 * Event delegation handling 
 */
Spaz.Controller.initIntercept = function() {

	$('body').intercept('mouseover', {
		
			// '.TabbedPanelsTab':function(e) {
			//	var tt = new Spaz_Tooltip($(this).attr('title'), {
			//		'e'		:e,
			//	});
			//	tt.show();
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
				tt.show();
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
				tt.show();
			},
			'a[href]':function(e) {
				var href = $(this).attr('href');
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				sch.debug('tooltip from a[href]');
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
			'a[title], .clickable[title]':function(e) {
				if ($(this).attr('href')) { // don't fire if we have an href -- already handled
					return;
				}
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				sch.debug('tooltip from a[title]');
				tt.show();
			},
			'a[user-screen_name]':function(e) {
				var tt = new Spaz_Tooltip($(this).attr('title'), {
					'e'		:e,
					'trigger':this
				});
				tt.show();
			},
			'input[title], button[title]':function(e) {
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
			//	Spaz.UI.setSelectedTab(this);
			// },
			
			'#tab-public':function(e) {
				// alert('e.target');
				// Spaz.Timelines.public.activate();
			},
			
			'#filter-friends':function(e) {
				this.select();
			},
			'#filter-favorites':function(e) {
				this.select();
			},
			'#filter-user':function(e) {
				this.select();
			},
			'#filter-userlists':function(e) {
				this.select();
			},
			'#filter-public':function(e) {
				this.select();
			},
			'#filter-followers':function(e) {
				this.select();
			},
			'.panelmenu .refresh':function(e) {
				Spaz.UI.reloadCurrentTab(true);
			},
			'.panelmenu .markread':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
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

			'#entrybox-attach':function(e){
				Spaz.UI.uploadImage();
			},
			'#entrybox-saveDraft':function(e){
				var editingDraftId = Spaz.Drafts.getEditingId(),
					editingDraft   = DraftModel.findById(editingDraftId),
					text		   = jQuery(Spaz.postPanel.textarea).val();
				if(editingDraft){
					Spaz.Drafts.update(editingDraft, text);
				}else{
					Spaz.Drafts.create(text);
				}
			},
			'#irt-dismiss':function(e) {
				Spaz.postPanel.clearPostIRT();
				Spaz.postPanel.textarea.focus();
			},

			'#entryform-drafts input':function(e){
				Spaz.Drafts.showList();
			},


			// prefs buttons handlers
			'#prefs-autosetrefresh-button':function(e) {
				if (Spaz.Prefs.getAccountType() != SPAZCORE_ACCOUNT_TWITTER) {
					Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
				} else {
					sch.debug('ignoring network-autoadjustrefreshinterval');
				}
			},


			// user context menu handlers
			'span.in-reply-to': function(e){
				var status_id = $(this).attr('data-status-id');
				var irt_status_id = $(this).attr('data-irt-status-id');
				Spaz.Conversation.build(status_id);
			},
			'a[href]':function(e) {
				var url = $(this).attr('href');
				e.preventDefault();
				sch.dump('Intercepted click on <a> and sending to '+url);
				sc.helpers.openInBrowser(url);
				return false;
			},
			'.hashtag':function(e) {
				Spaz.UI.showTab('tab-search');
				Spaz.Timelines.search.searchFor($(this).text());
			},
			'.status-thumbnail':function(e) {
				var url = $(this).attr('data-href');
				sc.helpers.openInBrowser(url);
			},
			'.status-action-fav':function(e) {
				var entryid = $(this).attr('entry-id');
				var element = Spaz.UI.getElementFromStatusId(entryid);
				if ($(element).hasClass('favorited')) {
					Spaz.Data.makeNotFavorite(entryid, function() {
						Spaz.UI.markNotFavorite(entryid);
					});
				} else {
					Spaz.Data.makeFavorite(entryid, function() {
						Spaz.UI.markFavorite(entryid);
					});
				}
			},
			'.status-action-dm':function(e) {
				Spaz.postPanel.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'.status-action-del':function(e) {
				if ($(this).hasClass('dm')) {
					Spaz.Data.destroyDirectMessage($(this).attr('entry-id'), function() {
						Spaz.UI.removeEntry($(this).attr('entry-id'), true);
					});
				} else {
					Spaz.Data.destroyStatus($(this).attr('entry-id'), function() {
						Spaz.UI.removeEntry($(this).attr('entry-id'), false);
					});
				}
			},
			'.directory-action-follow':function(e) {
				Spaz.Data.addFriend($(this).attr('user-screen_name'));
			},
			'.directory-action-unfollow':function(e) {
				Spaz.Data.removeFriend($(this).attr('user-screen_name'));
			},
			'.directory-user-location': function(e) {
				Spaz.UI.showLocationOnMap($(this).text());
			},
			'.user,.user-image,.user-screen-name,a[user-screen_name]': function(e) {
				Spaz.Profile.show($(this).attr('user-screen_name'));
			},
			'.timeline-entry':function(e) {
				sch.debug('triggered by .timeline-entry');
				$target = jQuery(e.target);
				if (!$target.is('a[href], .clickable, .status-action')) {
					Spaz.UI.selectEntry(this);
				}
			},
			'.timeline-entry *':function(e) { // this one needs to be last so the more specific ones above take precedence
				sch.debug('triggered by .timeline-entry *');
				$target = jQuery(e.target);
				if (!$target.is('a[href], .clickable, .status-action')) {
					var entry = $(this).parents('.timeline-entry').get(0);
					Spaz.UI.selectEntry(entry);
				}
				
			},
			'div.followers-row':function(e) {
				sch.debug('triggered by .followers-row');
				$target = jQuery(e.target);
				Spaz.Profile.show($(this).attr('user-screen_name'));
			},
			'div.followers-row *':function(e) {
				sch.debug('triggered by .followers-row *');
				$target = jQuery(e.target);
				sch.debug('e.target.innerHTML'+e.target.innerHTML);
				sch.debug("$target.attr('user-screen_name'):"+$target.attr('user-screen_name'));
				Spaz.Profile.show($target.attr('user-screen_name'));				
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
			'a[href]':function(e) {
				var url = $(this).attr('href');
				Spaz.UI.showLinkContextMenu($(this), url);
			}
		})
		.intercept('keyup', {
			'#filter-friends':function(e) {
				Spaz.Timelines.friends.filterWithDelay( $(this).val() );
			},
			'#filter-user':function(e) {
				Spaz.Timelines.user.filterWithDelay( $(this).val() );
			},
			'#filter-favorites':function(e) {
				Spaz.Timelines.user.filterWithDelay( $(this).val() );
			},
			'#filter-public':function(e) {
				Spaz.Timelines['public'].filterWithDelay( $(this).val() );
			},
			'#filter-userlists':function(e) {
				Spaz.Timelines.userlists.filterWithDelay( $(this).val() );
			},
			'#filter-followers':function(e) {
				Spaz.Timelines.followers.filterWithDelay( $(this).val() );
			}
		});



	// end intercept



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
		uploadDraggedImage(event);

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
	sch.debug("Setting Shortcuts=================================================");
	sch.debug("os: " + air.Capabilities['os']);

	var Modkey = 'Meta';

	if (air.Capabilities['os'].search(/Windows/i) != -1) {
		sch.debug('THIS IS WINDOWS');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Linux/i) != -1) { // thx agolna
		sch.debug('THIS IS LINUX');
		Modkey = 'Ctrl';
	} else if (air.Capabilities['os'].search(/Mac/i) != -1) {
		sch.debug('THIS IS MACOS');
		Modkey = 'Meta';
	}

	sch.debug('Modkey is '+Modkey);

	shortcut.add(Modkey+Spaz.Prefs.get('key-newEntry'), function() {
		$('#entrybox').focus();
	});

	shortcut.add('F5', function() {
		Spaz.UI.reloadCurrentTab(true);
	});

	shortcut.add(Spaz.Prefs.get('key-reloadTimeline'), function() {
		Spaz.UI.clearCurrentTimeline();
		Spaz.UI.reloadCurrentTab(true, true);
	});

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

	shortcut.add(Modkey+Spaz.Prefs.get('key-reply'), function(e) {
			
			var jqsel = jQuery('div.timeline-entry.ui-selected');
			if (jqsel.length > 0) {
				
				var tweet_id = jqsel.attr('data-status-id');
				
				Spaz.TweetsModel.getById(
					tweet_id,
					false,
					function(data) {
						var resp = Spaz.TweetsModel.getScreenNamesFromStatus(data);
						Spaz.postPanel.prepReply(resp.screen_name, data.id, data.SC_text_raw||data.text);
					}
				);
			}
		}, {
			'disable_in_input':false
	});




	/**
	 * reload main window 
	 */
	shortcut.add(Modkey+'+F10', function() {
		Spaz.reloadHTMLDoc();
	});
	

	// ****************************************
	// Tabs shortcuts
	// ****************************************
	shortcut.add(Modkey+'+1', function() {
		Spaz.UI.showTab(0);
	});
	shortcut.add(Modkey+'+2', function() {
		Spaz.UI.showTab(1);
	});
	shortcut.add(Modkey+'+3', function() {
		Spaz.UI.showTab(2);
	});
	shortcut.add(Modkey+'+4', function() {
		Spaz.UI.showTab(3);
		$('#search-for')[0].focus();
	});
	shortcut.add(Modkey+'+5', function() {
		Spaz.UI.showTab(4);
	});
	shortcut.add(Modkey+'+6', function() {
		Spaz.UI.showTab(5);
	});
	shortcut.add(Modkey+'+7', function() {
		Spaz.UI.showTab(6);
	});
	shortcut.add(Modkey+'+,', function() {
		Spaz.UI.showPrefs();
	});

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
	shortcut.add('esc', function() {
			Spaz.UI.deselectAllEntries();
		}, {
			'disable_in_input':true
	});
	
	// esc from #entrybox
	shortcut.add('esc', function() {
			$('#entrybox')[0].blur();
		}, {
			'target':'entrybox'
	});

	shortcut.add(Modkey+Spaz.Prefs.get('key-toggle'), function() {
			Spaz.UI.toggleTimelineFilter();
		}, {
			propagate:false
	});

	// ****************************************
	// Search box
	// ****************************************
	shortcut.add('Enter', function() {
			Spaz.Timelines.search.searchFor($('#search-for').val());
		}, {
			target:$('#search-for')[0],
			propagate:false
	});

	// ****************************************
	// Editor shortcuts
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

	// ****************************************
	// Username/password prefs -> save
	// ****************************************
	(function(){
		var callback = function(){
			var accountID;
			if($('#username').val() !== '' && $('#password').val() !== ''){
				$('#account-save').click();
					// TODO: Nasty. Don't just trigger a click, as this just
					// creates a chain with points of failure. Instead,
					// extract that button's click handler to a separate
					// function, and call it here.
				Spaz.UI.closePopbox();
			}
		};
		shortcut.add('Enter', callback, {
			target:	   $('#username')[0],
			propagate: false
		});
		shortcut.add('Enter', callback, {
			target:	   $('#password')[0],
			propagate: false
		});
	})();

	// ****************************************
	// Popboxes
	// ****************************************
	shortcut.add('esc', function(){
		Spaz.UI.closePopbox();
	});

};
