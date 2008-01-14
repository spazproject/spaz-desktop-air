var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

Spaz.UI.currentTheme = 'spaz';
Spaz.UI.userStyleSheet = '';
Spaz.UI.themeDir = '';

// widgets
Spaz.UI.tabbedPanels = {};
Spaz.UI.entryBox = {};
Spaz.UI.prefsCPG = {};


Spaz.UI.playSounds  = 1; // default state
Spaz.UI.useMarkdown = 1;

Spaz.UI.hideAfterDelay			= 1; // TODO not yet implemented
Spaz.UI.restoreOnUpdates		= 1; // TODO not yet implemented
Spaz.UI.minimizeToSystray		= 1;
Spaz.UI.minimizeOnBackground	= 0;
Spaz.UI.restoreOnActivate		= 0;

Spaz.UI.showNotificationPopups	= 1;
Spaz.UI.notificationPosition	= 'topRight';
Spaz.UI.notificationHideDelay	= 6; // in seconds

Spaz.UI.showContextMenus = 1; // hard-coded - this works properly now


Spaz.UI.tooltipHideTimeout	= null; // holder for the timeoutObject
Spaz.UI.tooltipHideDelay	= 8000; // in mseconds


Spaz.UI.mainTimelineId = 'timeline-friends';

// Paths to sound files
Spaz.UI.SOUND_UPDATE	= '/assets/sounds/TokyoTrainStation/Csnd.mp3';
Spaz.UI.SOUND_STARTUP	= '/assets/sounds/TokyoTrainStation/On.mp3';
Spaz.UI.SOUND_SHUTDOWN	= '/assets/sounds/TokyoTrainStation/Off.mp3';
Spaz.UI.SOUND_NEW		= '/assets/sounds/TokyoTrainStation/New.mp3';
Spaz.UI.WILHELM			= '/assets/sounds/wilhelm.mp3';

Spaz.UI.playSound = function(url, callback) {
	if (!Spaz.UI.playSounds) {
		Spaz.dump('Not playing sound '+url+'- disabled');
		return;
	}
	Spaz.Bridge.playSound(url, callback);
}

Spaz.UI.playSoundUpdate = function() {
	Spaz.UI.playSound(Spaz.UI.SOUND_UPDATE);
}

Spaz.UI.playSoundStartup = function(callback) {
	Spaz.UI.playSound(Spaz.UI.SOUND_STARTUP, callback);
}

Spaz.UI.playSoundShutdown = function(callback) {
	Spaz.UI.playSound(Spaz.UI.SOUND_SHUTDOWN, callback);
}

Spaz.UI.playSoundNew = function() {
	Spaz.UI.playSound(Spaz.UI.SOUND_NEW);
}

Spaz.UI.playSoundWilhelm = function() {
	Spaz.UI.playSound(Spaz.UI.WILHELM);
}


// Spaz.UI.setSoundState
Spaz.UI.setSoundState = function(state) {
	Spaz.dump("State: "+state);
	if (state) {
		Spaz.UI.soundOn()
	} else {
		Spaz.UI.soundOff()
	}
}
Spaz.UI.soundOn = function() {
	Spaz.dump("Sounds are ON");
	Spaz.UI.playSounds = 1;
}
Spaz.UI.soundOff = function() {
	Spaz.dump("Sounds are OFF");
	Spaz.UI.playSounds = 0;
}


// Spaz.UI.setMarkdownState
Spaz.UI.setMarkdownState = function(state) {
	Spaz.dump("MarkdownState: "+state);
	if (state) {
		Spaz.UI.markdownOn()
	} else {
		Spaz.UI.markdownOff()
	}
}
Spaz.UI.markdownOn = function() {
	Spaz.dump("useMarkdown ON");
	Spaz.UI.useMarkdown = 1;
}
Spaz.UI.markdownOff = function() {
	Spaz.dump("useMarkdown OFF");
	Spaz.UI.useMarkdown = 0;
}


// Spaz.UI.setMinimizeToSystray
Spaz.UI.setMinimizeToSystray = function(state) {
	Spaz.dump("MinimizeToSystray: "+state);
	if (state) {
		Spaz.UI.minimizeToSystrayOn()
	} else {
		Spaz.UI.minimizeToSystrayOff()
	}
}
Spaz.UI.minimizeToSystrayOn = function() {
	Spaz.dump("minimizeToSystray ON");
	Spaz.UI.minimizeToSystray = 1;
}
Spaz.UI.minimizeToSystrayOff = function() {
	Spaz.dump("minimizeToSystray OFF");
	Spaz.UI.minimizeToSystray = 0;
}


// Spaz.UI.setMinimizeOnBackground
Spaz.UI.setMinimizeOnBackground = function(state) {
	Spaz.dump("MinimizeOnBackground: "+state);
	if (state) {
		Spaz.UI.minimizeOnBackgroundOn()
	} else {
		Spaz.UI.minimizeOnBackgroundOff()
	}
}
Spaz.UI.minimizeOnBackgroundOn = function() {
	Spaz.dump("minimizeOnBackground ON");
	Spaz.UI.minimizeOnBackground = 1;
}
Spaz.UI.minimizeOnBackgroundOff = function() {
	Spaz.dump("minimizeOnBackground OFF");
	Spaz.UI.minimizeOnBackground = 0;
}


// Spaz.UI.setRestoreOnActivate
Spaz.UI.setRestoreOnActivate = function(state) {
	Spaz.dump("RestoreOnActivate: "+state);
	if (state) {
		Spaz.UI.restoreOnActivateOn()
	} else {
		Spaz.UI.restoreOnActivateOff()
	}
}
Spaz.UI.restoreOnActivateOn = function() {
	Spaz.dump("restoreOnActivate ON");
	Spaz.UI.restoreOnActivate = 1;
}
Spaz.UI.restoreOnActivateOff = function() {
	Spaz.dump("restoreOnActivate OFF");
	Spaz.UI.restoreOnActivate = 0;
}


// Spaz.UI.restoreOnUpdates
Spaz.UI.setRestoreOnUpdates = function(state) {
	Spaz.dump("restoreOnUpdates: "+state);
	if (state) {
		Spaz.UI.restoreOnUpdatesOn()
	} else {
		Spaz.UI.restoreOnUpdatesOff()
	}
}
Spaz.UI.restoreOnUpdatesOn = function() {
	Spaz.dump("restoreOnUpdates ON");
	Spaz.UI.restoreOnUpdates = 1;
}
Spaz.UI.restoreOnUpdatesOff = function() {
	Spaz.dump("restoreOnUpdates OFF");
	Spaz.UI.restoreOnUpdates = 0;
}


// Spaz.UI.hideAfterDelay
Spaz.UI.setRestoreOnUpdates = function(state) {
	Spaz.dump("hideAfterDelay: "+state);
	if (state) {
		Spaz.UI.hideAfterDelayOn()
	} else {
		Spaz.UI.hideAfterDelayOff()
	}
}
Spaz.UI.hideAfterDelayOn = function() {
	Spaz.dump("hideAfterDelay ON");
	Spaz.UI.hideAfterDelay = 1;
}
Spaz.UI.hideAfterDelayOff = function() {
	Spaz.dump("hideAfterDelay OFF");
	Spaz.UI.hideAfterDelay = 0;
}


// Spaz.UI.showNotificationPopups
Spaz.UI.setShowNotificationPopups = function(state) {
	Spaz.dump("showNotificationPopups: "+state);
	if (state) {
		Spaz.UI.showNotificationPopupsOn()
	} else {
		Spaz.UI.showNotificationPopupsOff()
	}
}
Spaz.UI.showNotificationPopupsOn = function() {
	Spaz.dump("showNotificationPopups ON");
	Spaz.UI.showNotificationPopups = 1;
}
Spaz.UI.showNotificationPopupsOff = function() {
	Spaz.dump("showNotificationPopups OFF");
	Spaz.UI.showNotificationPopups = 0;
}

Spaz.UI.statusBar = function(txt) {
	$('#statusbar-text').html(txt);
}

Spaz.UI.resetStatusBar = function() {
	$('#statusbar-text').html('Ready');
	Spaz.UI.hideLoading();
}

Spaz.UI.flashStatusBar = function() {
	for (var i = 0;i < 3; i++) {
		$('#statusbar').fadeOut(400);
		$('#statusbar').fadeIn(400);
	}
}

Spaz.UI.showLoading = function() {
	//$('#loading').show();
	$('#loading').fadeIn(500);
	// $('#loading').animate({left:currentLeft-100},500);
	//$('#loading').DropInLeft(500);
	
}

Spaz.UI.hideLoading = function() {
	//$('#loading').hide();
	// $('#loading').DropOutLeft(500);
	$('#loading').fadeOut(500);
}



// Spaz.UI.animateWilhelm = function() {
// 	$('#container').prepend('<h2 id="wilhelm" style="display:block; opacity:.1; font-size:.1em; position:absolute; z-index:1000">WILHELM</h2>');
// 	$('#wilhelm').css('top', $('#container').height()/2);
// 	// var left = '-'+$('#wilhelm').width()+'px';
// 	// Spaz.dump('LEFT:'+left);
// 	// 
// 	// $('#wilhelm').css('left', left);
// 	$('#wilhelm').animate(
// 		{
// 			opacity:'.9',
// 			'font-size':'20em',
// 			// left:$('#container').width()+100,
// 			
// 		}, 1000, function() {
// 		$(this).remove();
// 	});
// }



/**
* Styleswitch stylesheet switcher built on jQuery
* Under an Attribution, Share Alike License
* By Kelvin Luck ( http://www.kelvinluck.com/ )
**/
Spaz.UI.setCurrentTheme = function() {
	if (!Spaz.UI.currentTheme) {
		Spaz.UI.currentTheme = $('link[@rel*=style][@title]')[0].getAttribute('title');
		$('#prefs-base-theme').val(Spaz.UI.currentTheme);
		Spaz.dump('Spaz.UI.currentTheme is '+$('#prefs-base-theme').val());
	} else {
		Spaz.UI.currentTheme = $('#prefs-base-theme').val();
	}
	Spaz.dump('Spaz.UI.currentTheme:' + Spaz.UI.currentTheme);
	$('link[@rel*=style][@title]').each(function(i) {
		this.disabled = true;
		Spaz.dump(this.getAttribute('title') + " is now disabled");
		if (this.getAttribute('title') == Spaz.UI.currentTheme) {
			this.disabled = false;
			Spaz.dump(this.getAttribute('title') + " is now enabled");
		}
	});
	Spaz.UI.insertThemeDir();
}


Spaz.UI.browseForUserCss = function() {
	Spaz.dump('Spaz.UI.browseForUserCss');
	Spaz.Bridge.browseForUserCss();	
}


Spaz.UI.clearUserStyleSheet = function() {
	Spaz.UI.userStyleSheet = '';
	$('#UserCSSOverride').text('');
	$('#prefs-user-stylesheet').val(Spaz.UI.userStyleSheet);
}




Spaz.UI.showPopup = function(panelid) {
	Spaz.dump('showing '+panelid+'...');
	$('#'+panelid).css('opacity', 0);
	$('#'+panelid).show();
	$('#'+panelid).fadeTo('fast', 1.0, function() {
		Spaz.dump(panelid+':fadeIn:'+'faded in!');
		Spaz.dump(panelid+':display:'+$('#'+panelid).css('display'));
		Spaz.dump(panelid+':opacity:'+$('#'+panelid).css('opacity'));
	});
	Spaz.UI.centerPopup(panelid);
};
Spaz.UI.hidePopup = function(panelid) {
	Spaz.dump('hiding '+panelid+'...');
	$('#'+panelid).fadeTo('fast', 0, function(){
		Spaz.dump('fadeOut:'+'faded out!');
		Spaz.dump('fadeOut:'+$('#'+panelid).css('display'));
		Spaz.dump('fadeOut:'+$('#'+panelid).css('opacity'));
		$('#'+panelid).hide();
	});
}


Spaz.UI.showUpdateCheck = function() {
	Spaz.UI.showPopup('updateCheckWindow');
}
Spaz.UI.hideUpdateCheck = function() {
	Spaz.UI.hidePopup('updateCheckWindow');
}
Spaz.UI.showAbout = function() {
	Spaz.UI.showPopup('aboutWindow');
	var info = Spaz.Bridge.getRuntimeInfo();
	$('#sysinfo-os').text(info.os);
	$('#sysinfo-totalMemory').text(info.totalMemory+"");
}
Spaz.UI.updateMemoryUsage = function() {
	var info = Spaz.Bridge.getRuntimeInfo();
	//Spaz.dump('NEW Memory Usage: ' + info.totalMemory);
	$('#sysinfo-totalMemory').text(info.totalMemory+"");
}
Spaz.UI.hideAbout = function() {
	Spaz.UI.hidePopup('aboutWindow');
}
Spaz.UI.showHelp = function() {
	Spaz.UI.showPopup('helpWindow');
}
Spaz.UI.hideHelp = function() {
	Spaz.UI.hidePopup('helpWindow');
}
Spaz.UI.showShortLink = function() {
	Spaz.UI.showPopup('shortLinkWindow');
	Spaz.dump("val:"+$('#shorten-original-link').val());
	$('#shorten-original-link').focus();
	$('#shorten-original-link').val('http://');
	$('#shorten-original-link').select();
}
Spaz.UI.hideShortLink = function() {
	Spaz.UI.hidePopup('shortLinkWindow');
}

Spaz.UI.pageLeft = function(tabEl) {
	Spaz.UI.page(tabEl, -1);
}
Spaz.UI.pageRight = function(tabEl) {
	Spaz.UI.page(tabEl, 1);
}
Spaz.UI.page = function(tabEl, distance) {
	panel = tabEl.id.replace(/tab/, 'panel');
	Spaz.dump('Getting page number using \'#'+panel+' .timeline-pager-number\'');
	var thispage = parseInt( $('#'+panel+' .timeline-pager-number').text() );
	Spaz.dump("Current page:"+thispage);
	Spaz.dump("Paging distance:"+distance);
	var newpage = thispage+distance;
	Spaz.dump("New page:"+ newpage);
	if (newpage < 1) {
		return;
	}
	Spaz.Data.loadDataForTab(tabEl, false, newpage);
};
Spaz.UI.setCurrentPage =function(tabEl, newpage) {
	panel = tabEl.id.replace(/tab/, 'panel');
	$('#'+panel+' .timeline-pager-number').html(newpage);
};
Spaz.UI.showEntryboxTip =function() {
	Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Bridge.getUser() + '</span>. Type your message and press ENTER to send');
	// $('#entrybox').attr('title', 'Logged in as' + Spaz.Prefs.user).Tooltip({
	// 	track: true, 
	// 	delay: 100, 
	// 	showURL: false, 
	// 	showBody: false,
	// 	extraClass: "tab-tooltip",
	// 	opacity: 0.8,
	// });
}

Spaz.UI.showLocationOnMap = function(location) {
	var url = 'http://maps.yahoo.com/maps_result.php?q1='+encodeURIComponent(location);
	Spaz.dump("Loading "+url);
	openInBrowser(url);
};

// Spaz.UI.showPopup = function(contentid) {
// 	if (!Spaz.UI.popupPanel) {
// 		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
// 	}
// 	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
// }

// Spaz.UI.showWhatsNew = function() {
// 	Spaz.UI.popupPanel.loadContent('whatsnew.html');
// }


// taken from ThickBox 
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
	var jqWin  		= $('#'+windowid);
	var jqBody 		= $('#container');

	jqWin.css('margin', 0);	
	
	// WIDTH
	var winWidth = jqWin.outerWidth();
	if (jqBody.width() > winWidth) {
		jqWin.css('left', (jqBody.width() - winWidth)/2);
	} else {
		// jqWin.width()(jqBody.width() - 20);
		// jqWin.width() = jqWin.width()();
		jqWin.css('left', 0);
	}
	
	// HEIGHT
	var winHeight = jqWin.outerHeight();
	if (jqBody.height() > winHeight) {
		jqWin.css('top', (jqBody.height() - winHeight)/2);
	} else {
		// jqWin.width()(jqBody.width() - 20);
		// jqWin.width() = jqWin.width()();
		jqWin.css('top', 0);
	}
	// jqBody.css('border', '1px solid red');
	// jqWin.css('border', '1px solid blue');
	Spaz.dump("windowid:#"+windowid);
	Spaz.dump("jqBody.height():"+jqBody.height());
	Spaz.dump("jqBody.width() :"+jqBody.width() );
	Spaz.dump("jqWin.height() :"+winHeight);
	Spaz.dump("jqWin.width()  :"+winWidth);
	Spaz.dump("margin    :"+jqWin.css('margin'));
	Spaz.dump("top       :"+jqWin.css('top'));
	Spaz.dump("left      :"+jqWin.css('left'));

}

Spaz.UI.insertThemeDir = function() {
	$('img.tab-icon, #loading img, .status-actions img').each(function(i) {
		this.src = this.src.replace(/\{theme-dir\}/, 'themes/'+Spaz.UI.currentTheme);
	});
};


Spaz.UI.prepMessage = function() {
	var eb = $('#entrybox');
	eb.val('');
	eb[0].setSelectionRange(0,0);
};

Spaz.UI.prepDirectMessage = function(username) {
	var eb = $('#entrybox');
	eb.focus();
	eb.val('d '+username+' ...');
	eb[0].setSelectionRange(eb.val().length-3, eb.val().length)
};

Spaz.UI.prepReply = function(username) {
	var eb = $('#entrybox');
	var newText = '@'+username+' ';
	eb.focus();
	if (eb.val() != '') {
		eb.val(newText + eb.val());
		eb[0].setSelectionRange(eb.val().length, eb.val().length);
	} else {
		eb.val('@'+username+' ...');
		eb[0].setSelectionRange(eb.val().length-3, eb.val().length);
	}
};

/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
	var entrybox = $('#entrybox');
	if (entrybox.val() != '' && entrybox.val() != entryBoxHint) {
		
		Spaz.dump('length:'+entrybox.val().length)
		
		Spaz.Data.update(entrybox.val(), Spaz.Bridge.getUser(), Spaz.Bridge.getPass());
		// entrybox.val('');
	}
}




Spaz.UI.decodeSourceLinkEntities = function(str) {
	str = str.replace(/&gt;/gi, '>');
	str = str.replace(/&lt;/gi, '<');
	return str;
}


Spaz.UI.setSelectedTab = function(tab) {
	if (!isNaN(tab)) { // if a # is passed in, get the element of the corresponding tab
		Spaz.dump('getting tab element for number '+tab)
		Spaz.UI.selectedTab = Spaz.UI.tabbedPanels.getTabs()[tab]
	} else {
		Spaz.dump('tab element passed in '+tab)
		Spaz.UI.selectedTab = tab;
	}
	
	Spaz.dump('Spaz.UI.selectedTab: '+ Spaz.UI.selectedTab.id);
	
	Spaz.dump('restarting reload timer');
	Spaz.restartReloadTimer();
	
	Spaz.Data.loadDataForTab(tab);
	
	// force loading data if empty
	// var thisDs = Spaz.Data.getDsForTab(tab);
	// 
	// 
	// if (!thisDs) {
	// 	Spaz.dump('No DS for tab, return-ing from function');
	// 	return;
	// } else {
	// 	Spaz.dump('Got DS for tab');
	// }
	// 	
	// if (!thisDs.data || thisDs.data.length < 1) {
	// 	Spaz.dump('getting data for this tab');
	// 	Spaz.Data.loadDataForTab(tab);
	// } else {
	// 	Spaz.dump('data already exists');
	// }
}


Spaz.UI.reloadCurrentTab = function() {
	Spaz.dump('reloading the current tab');
	Spaz.Data.loadDataForTab(Spaz.UI.selectedTab);
}


Spaz.UI.autoReloadCurrentTab = function() {
	Spaz.dump('auto-reloading the current tab');
	Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, true);
}

Spaz.UI.clearCurrentTimeline = function() {
	Spaz.dump('clearing the current timeline');
	var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)
	
	if (section.canclear) {
		var timelineid = section.timeline;
		$('#'+timelineid).empty();
		Spaz.dump('cleared timeline #'+timelineid);
	} else {
		Spaz.dump('timeline not clearable');
	}
}


Spaz.UI.windowActiveHandler = function () {
	Spaz.dump('Window ACTIVE');
	if ($('body').focus()) {
	}
	
}

Spaz.UI.windowMinimize = function() {
	Spaz.Bridge.minimizeWindow();
};
Spaz.UI.windowRestore = function() {
	Spaz.Bridge.restoreWindow();
};




Spaz.UI.toggleTimelineFilter = function() {
	Spaz.dump('toggling class dm-replies on #'+Spaz.Section.friends.timeline)
	if ($('#'+Spaz.Section.friends.timeline).is('.dm-replies')) {
		$('#'+Spaz.Section.friends.timeline).removeClass('dm-replies');
		Spaz.UI.statusBar('Showing all tweets');
	} else {
		$('#'+Spaz.Section.friends.timeline).addClass('dm-replies');
		Spaz.UI.statusBar('Hiding tweets not directed at you');
	}
};



Spaz.UI.showUserTooltip = function(el, str) {
	var data = $(el).attr('title').split('|')
	var str = "<div><strong>"+data[0]+"</strong></div>";
	if(data[1]) {
		var str = str + "<div><em>"+data[1]+"</em></div>";
	}
	if(data[2]) {
		var str = str + "<div>"+data[2]+"</div>";
	}
	str = str.replace(/\\'/, "'")
	Spaz.UI.showTooltip(el,str);
};




Spaz.UI.showTooltip = function(el, str, previewurl) {
	
	Spaz.dump('previewurl:'+previewurl);
	
	var minwidth = 100;

	var tt = $('#tooltip');
	tt.stop();
	tt.css('width', '');
	tt.css('height', '');
	
	// hide any showing tooltips
	Spaz.dump('hiding tooltips');

	tt.hide();
	
	// clear any running tooltip hiding timeouts
	Spaz.dump('clearTimeout(Spaz.UI.tooltipHideTimeout);');
	clearTimeout(Spaz.UI.tooltipHideTimeout);
	
	str = "<div>"+str+"</div>";

	
	// show the link context menu
	Spaz.dump('opening context menu');
	tt.css('left', event.pageX+10)
		.css('top',  event.pageY+20)
		.html(str)
		.show()
		.css('opacity', 0)
		.animate({'opacity':'0.85'}, 200);
	
	if (/^@[a-zA-Z0-9_-]+$/.test($(el).text())) {
		var username = $(el).text().replace(/@/, '');
		
		var previewid = "preview-username-"+username;
		
		$("#tooltip").append("<div class='preview' id='"+previewid+"' style='display:none; position:relative; overflow:hidden; margin-top:.7em'></div>");
		
		
		Spaz.dump('username is '+username)
		
		var url = 'http://twitter.com/statuses/user_timeline.json'
		var data = {
			'id':username,
			'count':1
		}
		$.get(url, data, function(data, textStatus) {
			//Spaz.dump('textStatus:'+textStatus);
			//Spaz.dump('DATA:'+data);
			try {
				var tweets = eval(data);
				if (tweets[0].text) {
					$("#"+previewid).append("<img style='float:right' src='"+tweets[0].user.profile_image_url+"' />");
					$("#"+previewid).append("<div><strong>"+tweets[0].user.name+" ("+tweets[0].user.screen_name+")</strong></div>");
					$("#"+previewid).append("<div><em>"+tweets[0].user.location+"</em></div>");
					$("#"+previewid).append("<div>"+tweets[0].user.description+"</div>");
					$("#"+previewid).append('<div class="latest"><strong>Latest:</strong> '+tweets[0].text+'</div>');
				} else if (tweets.error) {
					$("#"+previewid).html('<strong>Error:</strong> '+tweets.error);
				}
				$("#"+previewid).fadeIn(500);
				
			} catch(e) {
				Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name 
				+ ". Error message: " + e.message)
			}
		})
		
	} else if (previewurl) {
		
		var previewid = "preview-link-"+getTimeAsInt();
		
		$("#tooltip").append("<div class='preview' id='"+previewid+"' style='display:none; position:relative; overflow:hidden; margin-top:.7em'></div>");
		
		
		
		// $("#tooltip .preview").load(previewurl+' h1', function(rtext, status, xhr) {
		// 	$(this).fadeIn(500);
		// });
		
		// $("#tooltip").append("<iframe src='"+previewurl+"' class='preview' style='display:none; position:relative; height:200px; width:200px; overflow:hidden'></iframe>");
		// // $("#tooltip .preview").attr('src', previewurl);
		// $("#tooltip .preview").fadeIn(500);
		
		if (previewurl.search(/^http:\/\//i) > -1) {
		
			$.get(previewurl, function(rtext, status, xhr) {
				// var jqpreview = $(rtext);
				//Spaz.dump('rtext:'+rtext);
				var rtext_matches = rtext.match(/<title>([^<]*)<\/title>/mi);
			
				// alert(rtext_matches);
			
				if (rtext_matches && rtext_matches[1]) {			
					var title = rtext_matches[1];
					// Spaz.dump('jqpreview.innerText:'+jqpreview[0].innerText);
					$("#"+previewid).html('<strong>Title:</strong> '+title);
					$("#"+previewid).fadeIn(500);
				}
			});
		}
		
		// $("#tooltip .preview")
	}
	
	// I kinda stole this from the excellent jquery.tooltip, which caused mem leakage (unfortunately)
	var vp  = Spaz.UI.getViewport();
	var off = tt.offset();
	
	// check horizontal position
	if (vp.x + vp.cx < off.left + tt.width()) {
		Spaz.dump('horz over')
		tt.css('left', parseInt(tt.css('left')) - (tt.width() + 20));
		if (tt.offset().left < 5) {
			tt.css('left', 5);
		}
	}
	
	
	// check vertical position
	if(vp.y + vp.cy < off.top + tt.height()) {
		Spaz.dump('vert over');
		tt.css('top', parseInt(tt.css('top')) - (tt.height() + 20));
		if (tt.offset().top < 5) {
			tt.css('top', 5);
		}
	}
	
	Spaz.dump('Spaz.UI.tooltipHideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.UI.tooltipHideDelay);');
	Spaz.UI.tooltipHideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.UI.tooltipHideDelay);
	
}



Spaz.UI.getViewport = function() {
	return {
		x: $(window).scrollLeft(),
		y: $(window).scrollTop(),
		cx: $(window).width(),
		cy: $(window).height()
	};
}



Spaz.UI.hideTooltips = function() {
	// clear existing timeouts
	Spaz.dump('clearTimeout(Spaz.UI.tooltipHideTimeout);');
	clearTimeout(Spaz.UI.tooltipHideTimeout);
	
	$('#tooltip').stop();
	$('#tooltip').animate({'opacity':'0'}, 200, 'linear', function(){
		Spaz.dump('hiding tooltips');
		$('#tooltip').hide();
	});
}



Spaz.UI.addEntryToTimeline = function(entry, section) {
	// alert('adding:'+entry.id)
	
	var timelineid = section.timeline;
	
	
	
	if ( $('#'+timelineid+'-'+entry.id, jqTL).length<1 ) {
		var isDM = false;
		var isSent = false;
		
		if (entry.sender) {
			entry.user = entry.sender
			isDM=true;
		}
		
		if (timelineid == 'timeline-user') {
			isSent = true;
		}
		
		var rowclass = "even";

		// need to double-slash single quotes to escape them properly below
		var popupStr = (entry.user.name+' ('+entry.user.screen_name+')|'+entry.user.location+'|'+entry.user.description).replace(/'/gi, "\\'");

		var timestamp = httpTimeToInt(entry.created_at)

		var entryHTML = '';
		entryHTML = entryHTML + '<div class="timeline-entry needs-cleanup new '+rowclass+'" id="'+timelineid+'-'+entry.id+'">';
		entryHTML = entryHTML + '	<div class="entry-timestamp" style="display:none">'+timestamp+'</div>';
		entryHTML = entryHTML + '	<div class="entry-id" style="display:none">['+entry.id+']</div>';
		entryHTML = entryHTML + '	<div class="entry-time" style="display:none">'+entry.created_at+'</div>'
		entryHTML = entryHTML + '	<div class="entry-user-id" style="display:none">'+entry.user.id+'</div>'
		entryHTML = entryHTML + '	<div class="entry-user-screenname" style="display:none">'+entry.user.screen_name+'</div>'
		entryHTML = entryHTML + '	<div class="entry-user-img" style="display:none">'+entry.user.profile_image_url+'</div>'
		entryHTML = entryHTML + '	<div class="entry-text" style="display:none">'+entry.text+'</div>'
		entryHTML = entryHTML + '	<div class="user" id="user-'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'">';
		entryHTML = entryHTML + '		<img class="user-image clickable" height="48" width="48" src="'+entry.user.profile_image_url+'" alt="'+entry.user.screen_name+'" title="'+popupStr+'" user-id="'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'" />';
		entryHTML = entryHTML + '		<div class="user-screen-name clickable" title="'+popupStr+'" user-id="'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'">'+entry.user.screen_name+'</div>';
		entryHTML = entryHTML + '	</div>';
		entryHTML = entryHTML + '	<div class="status" id="status-'+entry.id+'">';
		entryHTML = entryHTML + '		<div class="status-text" id="status-text-'+entry.id+'">'+entry.text+'</div>';
		if (!isDM) {
			entryHTML = entryHTML + '		<div class="status-actions">';
			entryHTML = entryHTML + '			<img src="themes/'+Spaz.UI.currentTheme+'/images/status-fav-off.png" title="Make this message a favorite" class="status-action-fav clickable" id="status-'+entry.id+'-fav" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
			entryHTML = entryHTML + '			<img src="themes/'+Spaz.UI.currentTheme+'/images/status-dm.png" title="Send direct message to this user" class="status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
			entryHTML = entryHTML + '			<img src="themes/'+Spaz.UI.currentTheme+'/images/status-reply.png" title="Send reply to this user" class="status-action-reply clickable" id="status-'+entry.id+'-reply" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
			if (isSent) {
				entryHTML = entryHTML + '			<a title="Delete this message" class="status-action-del clickable" id="status-'+entry.id+'-del" entry-id="'+entry.id+'">del</a>';
			}
			entryHTML = entryHTML + '		</div>';
			entryHTML = entryHTML + '		<div class="status-link">';
			entryHTML = entryHTML + '			<a href="http://twitter.com/'+entry.user.screen_name+'/statuses/'+entry.id+'/" class="status-created-at clickable" title="View full post in browser">'+entry.created_at+'</a>';
			entryHTML = entryHTML + '			<span class="status-source">from <span class="status-source-label">'+entry.source+'</span></span>';
			entryHTML = entryHTML + '			<span class="status-protected">'+entry.user.protected+'</span>';
			entryHTML = entryHTML + '		</div>';
		} else {
			entryHTML = entryHTML + '		<div class="status-actions">';
			entryHTML = entryHTML + '			<img src="themes/'+Spaz.UI.currentTheme+'/images/status-dm.png" title="Send direct message to this user" class="status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" /></a>';
			if (isSent) {
				entryHTML = entryHTML + '			<a title="Delete this message" class="status-action-del clickable" id="status-'+entry.id+'-del" entry-id="'+entry.id+'">del</a>';
			}
			// entryHTML = entryHTML + '			<a title="Delete this message" onclick=\'Spaz.Data.destroyStatus("'+entry.id+'")\' class="status-action-del" id="status-'+entry.id+'-del">del</a>';
			entryHTML = entryHTML + '		</div>';
		}
		entryHTML = entryHTML + '	</div>';
		entryHTML = entryHTML + '</div>';

		// Spaz.dump("\n\n"+entryHTML);


		// Make the jQuery object and bind events
		var jqentry = $(entryHTML);
		jqentry.css('opacity', .5);
		
		
		
		if (isDM) {
			jqentry.addClass('dm');
		}
		

		
		
		
		// FINALLY -- prepend the entry

		var jqTL = $('#'+timelineid);
		jqentry.prependTo(jqTL);
		
		return true;

	} else {
		Spaz.dump('skipping '+entry.id);
		
		return false;
	}

}



Spaz.UI.sortTimeline = function(timelineid) {
	var cells = $('#'+timelineid+' .timeline-entry');
	
	// Spaz.dump('cells length:'+cells.length);
	
	cells.sort(Spaz.UI.sortTweetElements, true).remove().appendTo('#'+timelineid);
	
	// Spaz.dump('done sorting');
}



Spaz.UI.sortTweetElements = function(a, b) {
	var inta = parseInt( $(a).find('.entry-timestamp').text() )
	var intb = parseInt( $(b).find('.entry-timestamp').text() )
	var diff = inta - intb;
	return diff;
};



Spaz.UI.reverseTimeline = function(timelineid) {
	var cells = $('#'+timelineid+' .timeline-entry');
	cells.reverse(true).remove().appendTo('#'+timelineid);
}



Spaz.UI.notifyOfNewEntries = function() {
	
	var timelineid = Spaz.Section.friends.timeline;
	
	// we change the selector so that messages not showing do not trigger notifications
	if ($('#'+timelineid).is('.dm-replies')) {
		var selector = '#'+timelineid + ' .new.dm, #'+timelineid + ' .new.reply'
	} else {
		var selector = '#'+timelineid + ' .new'
	}
	
	Spaz.dump('notifyOfNewEntries');
	if ($(selector).length>0) {
		
		Spaz.dump('NewEntries found!');
		
		
		var newtweets = $(selector).get().sort(Spaz.UI.sortTweetElements).reverse();
		
		// get newest of the new
		// we use this roundabout way of getting things to avoid a problem where
		// you could get text from one tweet and a userimg from another
		var newestHTML = newtweets[0].innerHTML;
		Spaz.dump(newestHTML);
		var jqnewest = $(newestHTML);
		
		
		
		
		Spaz.dump('Sending notification');
		var resp = "";
		
		var text;
		var img;
		var screen_name;
		
		jqnewest.each( function(i) {
			switch($(this).attr('class')) {
				case 'entry-user-screenname':
					screen_name = $(this).text();
					Spaz.dump(screen_name)
					break;
				case 'entry-text':
					text = $(this).text();
					Spaz.dump('TEXT:'+text);
					break;
				case 'entry-user-img':
					img = $(this).text();
					break;
			}
			// resp += $(this).attr('class')+":"+$(this).text()+"\n";
		})
		// alert(resp);
		// Spaz.dump(screen_name);
		// 		Spaz.dump(img);
		// 		Spaz.dump(text);
		// 		
		Spaz.Bridge.notify(text, screen_name, Spaz.UI.notificationPosition, Spaz.UI.notificationHideDelay, img);
		Spaz.UI.playSoundNew();
		Spaz.UI.statusBar('Updates found');

		// remove "new" indicators
		$("#"+timelineid + ' .new').removeClass('new');
	} else {
		Spaz.dump('NewEntries NOT found!');
		Spaz.UI.statusBar('No new messages');
	}
	
}



// cleans up and parses stuff in timeline's tweets
Spaz.UI.cleanupTimeline = function(timelineid) {
	
	Spaz.UI.sortTimeline(timelineid);
	Spaz.UI.reverseTimeline(timelineid);

	// remove the even and odds due to resorting
	$("#"+timelineid + ' .timeline-entry').removeClass('even');
	$("#"+timelineid + ' .timeline-entry').removeClass('odd');
	
	// we delay on notification of new entries because stuff gets 
	// really confused and wonky if you fire it off right away
	Spaz.dump('Set timeout for notifications')
	setTimeout(Spaz.UI.notifyOfNewEntries, 1000);
	
	// $("#"+timelineid + ' .timeline-entry').each( function(i) {
	// 	$(this).bind('click', {'jqentry':$(this)}, Spaz.Handlers.selectEntry);
	// })

	// apply even class
	$("#"+timelineid + ' .timeline-entry:nth-child(even)').addClass('even');
	// Spaz.dump($("#"+timelineid + ' .timeline-entry:nth-child(even)')[0].outerHTML);
	
	// apply odd class
	$("#"+timelineid + ' .timeline-entry:nth-child(odd)').addClass('odd');
	// Spaz.dump($("#"+timelineid + ' .timeline-entry:nth-child(odd)')[0].outerHTML);
	

	// animate in new stuff
	$("#"+timelineid + ' .timeline-entry:eq(0)').animate({'opacity': '1.0'}, 25, 'linear', function() {
		//Spaz.dump($(this).text());
		$(this).next().animate({'opacity': '1.0'}, 25, 'linear', arguments.callee);
	})

	if ($("#"+timelineid + ' .timeline-entry:eq(0)').length > 0) {
		// scroll to top
		Spaz.dump('scrolling to .timeline-entry:eq(0) in #'+timelineid);

		try {
			$("#"+timelineid).scrollTo('.timeline-entry:eq(0)', {speed:800, easing:'swing'})
		} catch (e) {
			Spaz.dump('Error doing scrollTo first entry - probably switched tabs in the middle of loading. No sweat!');
		}
		
	}
	
	
	
	// make it here so we don't instantiate on every loopthrough
	var md = new Showdown.converter();
	
	// convert post times to relative (these all need to be updated each time)
	$(".timeline-entry", "#"+timelineid).each(function(i) {
		var entrytime = $(".entry-time", this).text();
		// Spaz.dump(entrytime);
		$(".status-created-at", this).html(get_relative_time( entrytime ));
		// Spaz.dump($(".timeline-entry").html());
	});
	
	// clean up the .status-text
	$("div.needs-cleanup div.status-text", "#"+timelineid).each(function(i){

		// Spaz.dump('Pre-conversion:'+this.innerHTML);
		
		
		// fix extra ampersand encoding
		this.innerHTML = this.innerHTML.replace(/&amp;(gt|lt|quot|apos);/gi, '&$1;');
		
		// fix entity &#123; style extra encoding
		this.innerHTML = this.innerHTML.replace(/&amp;#([\d]{3,4});/gi, '&#$1;');
					

		// convert inline links
		var before = this.innerHTML;
		
		/*
			this is the regex we use to match inline 
			.ht (Haiti) gets left out because of problems with matching something like
			...let's go.http://...
		*/
		var inlineRE = /(?:(\s|^|\.|\:|\(|\[))(?:http:\/\/)?((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+(com|net|org|co\.uk|aero|asia\biz|cat|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw))((?:\/[\w\.\/\?=%&_-]*)*)/g;
		
		this.innerHTML = this.innerHTML.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open $2$5 in a browser window" class="inline-link">$2&raquo;</a>');
		if (before != this.innerHTML) {
			Spaz.dump('BEFORE inline-links change: '+before);
			Spaz.dump('AFTER inline-links change: '+this.innerHTML);
		}
		
		
		// email addresses
		this.innerHTML = this.innerHTML.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '$1<a href="mailto:$2@$3" class="inline-email" title="Send an email to $2@$3">$2@$3</a>');
	
		// convert @username reply indicators
		this.innerHTML = this.innerHTML.replace(/(^|\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a href="http://twitter.com/$2" class="inline-reply" title="View $2\'s profile">@$2</a>');

		if (Spaz.UI.useMarkdown) {
			// Markdown conversion with Showdown
			this.innerHTML = md.makeHtml(this.innerHTML);
			
			// Spaz.dump('Pre-onclick conversion:'+this.innerHTML);
			
			// put title attr in converted Markdown link
			this.innerHTML = this.innerHTML.replace(/href="([^"]+)"/gi, 'href="$1" title="Open $1 in a browser window" class="inline-link"');
		}

		// // inline non-http:// links like foo.com or bar.foo.edu
		// var before = this.innerHTML;
		// this.innerHTML = this.innerHTML.replace(/(^|\s)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+[a-zA-Z]{2,6}\.?)([^a-zA-Z]|$)/gi, '$1<a href="http://$2" class="inline-link" title="Open http://$2 in a browser window">$2</a>$4');
		// if (before != this.innerHTML) {
		// 	// Spaz.dump("BEFORE:\n"+before);
		// 	// Spaz.dump("AFTER:\n"+this.innerHTML);
		// }

		
		// Spaz.dump('Post conversion:'+this.innerHTML);

	});
	
	// add contentmenu calls
	$("div.needs-cleanup div.status-text", "#"+timelineid).find('a[href]').each(function(i) {
		var jqthis = $(this);
		// Spaz.dump(this.outerHTML);
		var url = jqthis.attr('href');
		jqthis.bind('contextmenu', { 'jq':jqthis, 'url':url }, Spaz.Handlers.showContextMenu)
				// .removeAttr('href');
				// .bind('click', {'url':url}, Spaz.Handlers.openInBrowser)
	});
	

	
	// convert source link entries
	$("div.needs-cleanup span.status-source-label", "#"+timelineid).each(function(i) {
		
		// var sourceHTML = Spaz.Cache.getSource(this.innerHTML);
		var sourceHTML = false;
		
		var jqsource = $(this)
		
		if (jqsource.html().length>0){
			jqsource.html( Spaz.UI.decodeSourceLinkEntities( jqsource.html() ) );
			var jqsourcelink = jqsource.find('a');
			var href;
			if (href = jqsourcelink.attr('href')) {
				jqsourcelink.attr('title', 'Open '+href+' in a browser window')
							// .bind('click',       { 'url': href },     Spaz.Handlers.openInBrowser)	
							// .removeAttr('href');
							// .bind('contextmenu', { 'jq' : jqsourcelink, 'url':href }, Spaz.Handlers.showContextMenu)
			}

		} else {
			Spaz.dump('nothing to convert');
		}
	});

	$("div.needs-cleanup span.status-protected", "#"+timelineid).each(function(i) {
		var jqprtct = $(this);
		if (jqprtct.html() == 'true') {
			jqprtct.html('<img src="themes/'+Spaz.UI.currentTheme+'/images/icon-lock.png" title="Protected post - please respect this user\'s privacy" class="protected-post" />');
		} else {
			jqprtct.html('');
		}
	});
	

	// highlight messages that mention @currentusername
	$("div.needs-cleanup .status-text", "#"+timelineid).each( function(i) {
		var re = new RegExp('@'+Spaz.Bridge.getUser(), 'i');
		if (re.test($(this).html())) {
			// Spaz.dump("found reply in "+$(this).text());
			$(this).parents('div.needs-cleanup').addClass('reply');
		}
	})
	
	$("div.needs-cleanup").each(function() {
		// Spaz.dump(this.outerHTML);
	})
	
	$("div.needs-cleanup", "#"+timelineid).removeClass('needs-cleanup');



	
}




/******************************
 * Keyboard shortcuts
 ******************************/
Spaz.UI.keyboardHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	if (el.name) {
		return true;
	}

// 	// CMD+T or CTRL+T
// 	if (e.which == 84 && (e.metaKey || e.ctrlKey) ) {
// 		$('#entrybox').focus();
// 		return false;
// 	}
// 
	// 'ENTER' if (e.which == 13 && e.shiftKey == true && e.srcElement.id == 'entrybox') {
	if (e.which == 13 && e.srcElement.id == 'entrybox') {
		Spaz.UI.sendUpdate();
		return false;
	}
// 	
// 	// 'r' reload the current tab
// 	if (e.which == 82 && e.srcElement.id != 'entrybox') {
// 		Spaz.UI.reloadCurrentTab();
// 		Spaz.restartReloadTimer();
// 		return false;
// 	}
// 
// 	// 'l' show shorten link dialog
// 	if (e.which == 76 && e.srcElement.id != 'entrybox') {
// 		Spaz.UI.showShortLink();
// 		return false;
// 	}
// 	
// 	// '@' reply to selected user
// 	if (e.which == 50 && e.shiftKey && e.srcElement.id != 'entrybox') {
// 		// get the current selection username
// 		// Spaz.dump('getting current selection');
// 		Spaz.dump('getting screenname from current selection');
// 		var screenname = $('div.ui-selected .user-screen-name').text();
// 		
// 		Spaz.dump('username for reply is:'+screenname);
// //		var username = '';
// 		Spaz.UI.prepReply(screenname);
// 		return false;
// 	}
// 
// 	// '1-9' Numbers for tabs
// 	if ( ((e.which >= 49 && e.which <= 56) && !e.shiftKey && e.srcElement.id != 'entrybox')
// 		|| ((e.which >= 49 && e.which <= 56) && !e.shiftKey && e.metaKey) ) {
// 		var panelId = e.which-49;
// 		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[panelId]);
// 		Spaz.UI.tabbedPanels.showPanel(panelId);
// 		return false;
// 	}
// 
// 	// ****************************************
// 	// Keys to navigate timeline
// 	// ****************************************
// 	if (e.which == 74 && (e.metaKey || e.ctrlKey) ) { // CMD+j
// 		Spaz.Handlers.keyboardMove('down');
// 		return false;
// 	}
// 	
// 	if (e.which == 75 && (e.metaKey || e.ctrlKey) ) { // CMD+k
// 		Spaz.Handlers.keyboardMove('up');
// 		return false;
// 	}
// 
// 	if (e.which == 74 && e.srcElement.id != 'entrybox') { // j
// 		Spaz.Handlers.keyboardMove('down');
// 		return false;
// 	}
// 	
// 	if (e.which == 75 && e.srcElement.id != 'entrybox') { // k
// 		Spaz.Handlers.keyboardMove('up');
// 		return false;
// 	}

	
	if (e.srcElement.id == 'home') {
		Spaz.dump('keyboard Event =================');
		Spaz.dump("keyIdentifier:"+ e.keyIdentifier);
		Spaz.dump("KeyCode:" + e.keyCode);
		Spaz.dump("which:"+ e.which);
		Spaz.dump("type:"+ e.type);
		Spaz.dump("shift:"+ e.shiftKey);
		Spaz.dump("ctrl:"+ e.ctrlKey);
		Spaz.dump("alt:"+ e.altKey);
		Spaz.dump("meta:"+ e.metaKey);
		Spaz.dump("src:"+ e.srcElement.id);
	}


	return true;
}


Spaz.UI.focusHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.Bridge.trace('FOCUS name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};

Spaz.UI.blurHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.Bridge.trace('BLUR  name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};

Spaz.UI.clickHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.Bridge.trace('BLUR  name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};





//	$('#tab-friends .timeline-pager-number').html(4);