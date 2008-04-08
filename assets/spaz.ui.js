var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

// widgets
Spaz.UI.tabbedPanels = {};
Spaz.UI.entryBox = {};
Spaz.UI.prefsCPG = {};

// holder
Spaz.UI.tooltipHideTimeout	= null; // holder for the timeoutObject

// kind of a const
Spaz.UI.mainTimelineId = 'timeline-friends';


Spaz.UI.playSound = function(url, callback) {
	if (!Spaz.Prefs.get('sound-enabled')) {
		Spaz.dump('Not playing sound '+url+'- disabled');
		if (callback) { callback() }
		return;
	}
	Spaz.dump('Spaz.UI.playSound callback:'+callback);
	Spaz.dump("loading " + url);
	var req = new air.URLRequest(url);
	var s = new air.Sound(req);
	//s.addEventListener(air.Event.SOUND_COMPLETE, Spaz.Windows.makeWindowVisible);
	
	var sc = s.play();
	Spaz.dump("playing " + url);
	if (callback) {
		sc.addEventListener(air.Event.SOUND_COMPLETE, callback);
	}



}


Spaz.UI.onSoundPlaybackComplete = function(event) {
	// air.trace("The sound has finished playing.");
}


Spaz.UI.playSoundUpdate = function(callback) {
	Spaz.UI.playSound(Spaz.Prefs.get('sound-update'), callback);
}

Spaz.UI.playSoundStartup = function(callback) {
	Spaz.UI.playSound(Spaz.Prefs.get('sound-startup'), callback);
}

Spaz.UI.playSoundShutdown = function(callback) {
	Spaz.UI.playSound(Spaz.Prefs.get('sound-shutdown'), callback);
}

Spaz.UI.playSoundNew = function(callback) {
	Spaz.UI.playSound(Spaz.Prefs.get('sound-new'), callback);
}

Spaz.UI.playSoundWilhelm = function(callback) {
	Spaz.UI.playSound(Spaz.Prefs.get('sound-wilhelm'), callback);
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
	$('#loading').fadeIn(500);
}

Spaz.UI.hideLoading = function() {
	$('#loading').fadeOut(500);
}




Spaz.UI.clearUserStyleSheet = function() {
	Spaz.Prefs.get('theme-userstylesheet') = '';
	$('#UserCSSOverride').text('');
	$('#user-stylesheet').val(Spaz.Prefs.get('theme-userstylesheet'));
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
	this.instance = window.open('app:/html/about.html', 'aboutWin', 'height=400,width=350,scrollbars=yes');
}
Spaz.UI.showHelp = function() {
	this.instance = window.open('app:/html/help.html', 'helpWin', 'height=400,width=350,scrollbars=yes');
}
Spaz.UI.showShortLink = function() {
	this.instance = window.open('app:/html/shorten-url.html', 'shortenWin', 'height=250,width=300');
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
	Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Prefs.getUser() + '</span>. Type your message and press ENTER to send');
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
		
		Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass());
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

}


Spaz.UI.reloadCurrentTab = function(force) {
	Spaz.dump('reloading the current tab');
	Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, force);
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





Spaz.UI.toggleTimelineFilter = function() {
	Spaz.dump('toggling class dm-replies on #'+Spaz.Section.friends.timeline)
	
	// $('#'+Spaz.Section.friends.timeline + ' div.timeline-entry').not('.dm, .reply').each( function() {
	// 		air.trace($(this).attr('class'));
	// 		// $(this).slideToggle({'duration':25, 'queue':'toggleStatuses'});
	// 		$(this).slideToggle({'duration':25, 'queue':'toggleStatuses'});
	// });
	
	if ($('#'+Spaz.Section.friends.timeline).is('.dm-replies')) {
		$('#'+Spaz.Section.friends.timeline).removeClass('dm-replies');
		Spaz.UI.statusBar('Showing all tweets');
		$('#'+Spaz.Section.friends.timeline + ' div.timeline-entry').not('.dm, .reply')
			.slideDown({'duration':400, 'queue':'toggleStatuses'});
	} else {
		$('#'+Spaz.Section.friends.timeline).addClass('dm-replies');
		Spaz.UI.statusBar('Hiding tweets not directed at you');
		$('#'+Spaz.Section.friends.timeline + ' div.timeline-entry').not('.dm, .reply')
			.slideUp({'duration':400, 'queue':'toggleStatuses'});
	}



	
	// $.fxqueue('toggleStatuses').start();

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
	Spaz.dump('opening tooltip menu');
	tt.css('left', event.pageX+10)
		.css('top',  event.pageY+20)
		.html(str)
		.show()
		.css('opacity', 0)
		.animate({'opacity':'0.85'}, {speed:200, queue:false});
	
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
	
	Spaz.dump('setting tooltip timeout');
	Spaz.UI.tooltipHideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.Prefs.get('window-tooltiphidedelay'));
	
}


Spaz.UI.showLinkContextMenu = function(jq, url) {
	var el = jq[0];

	// hide any showing tooltips
	air.trace('hiding tooltip');	
	$('#tooltip').hide();
	
	// show the link context menu
	air.trace('opening context menu');
	$('#linkContextMenu').css('left', event.pageX)
		.css('top',  event.pageY)
		.show();

	air.trace('outerHTML:'+el.outerHTML);
	var urlarray = /http:\/\/([^'"]+)/i.exec(url);
	if (urlarray && urlarray.length > 0) {
		var elurl = urlarray[0];
	
		air.trace('url from element:'+elurl);
	
		$('#linkContextMenu-copyLink').one('click', {url:elurl}, function(event) {
			Spaz.Sys.setClipboardText(event.data.url);
			air.trace('Current Clipboard:'+Spaz.Sys.getClipboardText());
		});
		air.trace('Set one-time click event on #menu-copyLink');
	
		$(document).one('click', function() {
			$('#linkContextMenu').hide();
		});
		air.trace('set one-time link context menu close event for click on document');
	} else {
		air.trace('no http link found');
	}
};


Spaz.UI.showUserContextMenu = function(jq, screen_name) {
	if (!screen_name) {return false;}
	var el = jq[0];
	
	Spaz.dump(el);
	
	// hide any showing tooltips
	air.trace('hiding tooltip');
	$('#tooltip').hide();
	
	// show the link context menu
	air.trace('opening context menu for user '+screen_name);
	$('#userContextMenu').css('left', event.pageX)
		.css('top',  event.pageY)
		.show();


	$('#userContextMenu-viewProfile').one('click', {screenName:screen_name}, function(event) {
		Spaz.Sys.openInBrowser('http://twitter.com/'+event.data.screenName)
	});
	$('#userContextMenu-follow').one('click', {screenName:screen_name}, function(event) {
		Spaz.Data.followUser(event.data.screenName);
	});
	$('#userContextMenu-unfollow').one('click', {screenName:screen_name}, function(event) {
		Spaz.Data.stopFollowingUser(event.data.screenName);
	});
	$('#userContextMenu-sendReply').one('click', {screenName:screen_name}, function(event) {
		Spaz.UI.prepReply(event.data.screenName);
	});
	$('#userContextMenu-sendDM').one('click', {screenName:screen_name}, function(event) {
		Spaz.UI.prepDirectMessage(event.data.screenName);
	});
	// $('#userContextMenu-block').one('click', {user:screen_name}, function(event) {
	// 	Spaz.Data.blockUser(user);
	// });
	
	air.trace('Set one-time click event on #userContextMenu');
	$(document).one('click', function() {
		$('#userContextMenu').hide();
	});
	
	air.trace('set one-time link context menu close event for click on document');
};



// Spaz.UI.showMainMenu = function(jq) {
// 	var el = jq[0];
// 	
// 	Spaz.dump(el);
// 	
// 	// hide any showing tooltips
// 	air.trace('hiding tooltips');
// 	$('#tooltip').hide();
// 	
// 	// show the link context menu
// 	air.trace('opening mainmenu');
// 	$('#mainMenu').css('left', event.pageX)
// 		.css('top',  event.pageY)
// 		.show();
// }



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
	$('#tooltip').animate({'opacity':'0'}, {queue:false}, 200, 'linear', function(){
		Spaz.dump('hiding tooltips');
		$('#tooltip').hide();
	});
}



Spaz.UI.addItemToTimeline = function(entry, section) {
	// alert('adding:'+entry.id)
	
	var timelineid = section.timeline;
	
	// air.trace(JSON.stringify(entry));
	
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
		
		var themeDir = Spaz.Themes.getPathByName(Spaz.Prefs.get('theme-basetheme'));
		
		var rowclass = "even";

		// need to double-slash single quotes to escape them properly below
		if (!entry.user.name) {
			entry.user.name = entry.user.screen_name
		}

		var popupStr = (entry.user.name+' ('+entry.user.screen_name+')|')
		if (entry.user.location) { popupStr = popupStr + entry.user.location+'|'; }
			else { popupStr = popupStr + '|'; }

		if (entry.user.description) { popupStr = popupStr + entry.user.description; }

		popupStr = popupStr.replace(/'/gi, "\'");

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
			entryHTML = entryHTML + '			<img src="'+themeDir+'/images/status-fav-off.png" title="Make this message a favorite" class="status-action-fav clickable" id="status-'+entry.id+'-fav" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
			entryHTML = entryHTML + '			<img src="'+themeDir+'/images/status-dm.png" title="Send direct message to this user" class="status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
			entryHTML = entryHTML + '			<img src="'+themeDir+'/images/status-reply.png" title="Send reply to this user" class="status-action-reply clickable" id="status-'+entry.id+'-reply" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" />';
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
			entryHTML = entryHTML + '			<img src="'+themeDir+'/images/status-dm.png" title="Send direct message to this user" class="status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" /></a>';
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
		// jqentry.css('opacity', .1);
		jqentry.css('display', 'none');
		
		
		
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


Spaz.UI.selectEntry = function(event) {

	var jqentry = event.data.jqentry;

	Spaz.dump('unselected tweets');
	$('div.timeline-entry.ui-selected').removeClass('ui-selected');
	
	Spaz.dump('selecting tweet');
	jqentry.addClass('ui-selected');


	var el = jqentry[0];	
	Spaz.dump('selected tweet #'+el.id+':'+el.tagName+'.'+el.className);
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

		Spaz.UI.notify(text, screen_name, Spaz.Prefs.get('window-notificationposition'), Spaz.Prefs.get('window-notificationhidedelay'), img);
		Spaz.UI.playSoundNew();
		Spaz.UI.statusBar('Updates found');

		// remove "new" indicators
		$("#"+timelineid + ' .new').removeClass('new');
	} else {
		Spaz.dump('NewEntries NOT found!');
		Spaz.UI.statusBar('No new messages');
	}
	
}


Spaz.UI.alert = function(message, title) {
	if (!title) {title="Alert"}
	Spaz.UI.notify(message, title, null, 5, 'app:/images/spaz-icon-alpha_48.png');
}


Spaz.UI.notify = function(message, title, where, duration, icon, force) {
	if (Spaz.Prefs.get('window-shownotificationpopups') || force) {
		Spaz.Notify.add(message, title, where, duration, icon);
	} else {
		Spaz.dump('not showing notification popup - window-shownotificationpopups disabled');
	}
}






// cleans up and parses stuff in timeline's tweets
Spaz.UI.cleanupTimeline = function(timelineid, suppressNotify, suppressScroll) {
	

	

	
	Spaz.dump('Sorting timeline');
	Spaz.UI.sortTimeline(timelineid);
	
	Spaz.dump('Reversing timeline');
	Spaz.UI.reverseTimeline(timelineid);

	// remove the even and odds due to resorting
	$("#"+timelineid + ' .timeline-entry').removeClass('even').removeClass('odd');
	
	Spaz.dump("# of Timeline-entries = " +$("#"+timelineid + ' .timeline-entry').length)
	
	Spaz.dump($("#"+timelineid).html());
	
	// we delay on notification of new entries because stuff gets 
	// really confused and wonky if you fire it off right away
	if (!suppressNotify) {
		Spaz.dump('Set timeout for notifications')
		setTimeout(Spaz.UI.notifyOfNewEntries, 1000);
	}
	
	// $("#"+timelineid + ' .timeline-entry').each( function(i) {
	// 	$(this).bind('click', {'jqentry':$(this)}, Spaz.UI.selectEntry);
	// })

	// apply even class
	$("#"+timelineid + ' .timeline-entry:nth-child(even)').addClass('even');
	// Spaz.dump($("#"+timelineid + ' .timeline-entry:nth-child(even)')[0].outerHTML);
	
	// apply odd class
	$("#"+timelineid + ' .timeline-entry:nth-child(odd)').addClass('odd');
	// Spaz.dump($("#"+timelineid + ' .timeline-entry:nth-child(odd)')[0].outerHTML);

	
	


	if (!suppressScroll) {
		if ($("#"+timelineid + ' .timeline-entry:eq(0)').length > 0) {
			// scroll to top
			Spaz.dump('scrolling to .timeline-entry:eq(0) in #'+timelineid);

			try {
				$("#"+timelineid).scrollTo('.timeline-entry:eq(0)', {speed:800, easing:'swing'})
			} catch (e) {
				Spaz.dump('Error doing scrollTo first entry - probably switched tabs in the middle of loading. No sweat!');
			}
		
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
					
		// air.trace(this.innerHTML);
		if (Spaz.Prefs.get('usemarkdown')) {
			// Markdown conversion with Showdown
			this.innerHTML = md.makeHtml(this.innerHTML);
			
			// Spaz.dump('Pre-onclick conversion:'+this.innerHTML);
			
			// put title attr in converted Markdown link
			this.innerHTML = this.innerHTML.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
		}
		// air.trace(this.innerHTML);

		// convert inline links
		var before = this.innerHTML;

		/*
			Inline links that start with http://
		*/
		var inlineRE = /(?:(\s|^|\.|\:|\())(?:http:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_-]*)*)/g;		
		this.innerHTML = this.innerHTML.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open link in a browser window" class="inline-link">$2&raquo;</a>');
		if (before != this.innerHTML) {
			// air.trace('BEFORE inline-links change HTTP ONLY: '+before);
			// air.trace('AFTER inline-links change: '+this.innerHTML);
		}

		before = this.innerHTML;
		/*
			this is the regex we use to match inline 
			lots of uncommon but valid top-level domains aren't used
			because they cause more problems than solved
		*/
		var inlineRE = /(?:(\s|^|\:|\())((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+(com|net|org|co\.uk|aero|asia|biz|cat|coop|edu|gov|info|jobs|mil|mobi|museum|name|au|ca|cc|cz|de|eu|fr|gd|hk|ie|it|jp|nl|no|nu|nz|ru|st|tv|uk|us))((?:\/[\w\.\/\?=%&_-]*)*)/g;
		this.innerHTML = this.innerHTML.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open link in a browser window" class="inline-link">$2&raquo;</a>');
		if (before != this.innerHTML) {
			// air.trace('BEFORE inline-links change NO HTTP: '+before);
			// air.trace('AFTER inline-links change: '+this.innerHTML);
		}
		
		
		// email addresses
		this.innerHTML = this.innerHTML.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '$1<a href="mailto:$2@$3" class="inline-email" title="Send an email to $2@$3">$2@$3</a>');
		// air.trace('now emails:'+this.innerHTML);
	
		// convert @username reply indicators
		this.innerHTML = this.innerHTML.replace(/(^|\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a href="http://twitter.com/$2" class="inline-reply" user-screen_name="$2">@$2</a>');
		// air.trace('now usernames:'+this.innerHTML)


		// // inline non-http:// links like foo.com or bar.foo.edu
		// var before = this.innerHTML;
		// this.innerHTML = this.innerHTML.replace(/(^|\s)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+[a-zA-Z]{2,6}\.?)([^a-zA-Z]|$)/gi, '$1<a href="http://$2" class="inline-link" title="Open http://$2 in a browser window">$2</a>$4');
		// if (before != this.innerHTML) {
		// 	// Spaz.dump("BEFORE:\n"+before);
		// 	// Spaz.dump("AFTER:\n"+this.innerHTML);
		// }

		
		// Spaz.dump('Post conversion:'+this.innerHTML);

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
							// .bind('click',       { 'url': href },     Spaz.Sys.openInBrowser)	
							// .removeAttr('href');
							// .bind('contextmenu', { 'jq' : jqsourcelink, 'url':href }, Spaz.Handlers.showContextMenu)
			}

		} else {
			Spaz.dump('nothing to convert');
		}
	});


	// add protected post indicators
	$("div.needs-cleanup span.status-protected", "#"+timelineid).each(function(i) {
		var jqprtct = $(this);
		if (jqprtct.html() == 'true') {
			jqprtct.html('<img src="themes/'+Spaz.Prefs.get('theme-basetheme')+'/images/icon-lock.png" title="Protected post - please respect this user\'s privacy" class="protected-post" />');
		} else {
			jqprtct.html('');
		}
	});
	

	// highlight messages that mention @currentusername
	$("div.needs-cleanup .status-text", "#"+timelineid).each( function(i) {
		var re = new RegExp('@'+Spaz.Prefs.getUser(), 'i');
		if (re.test($(this).html())) {
			// Spaz.dump("found reply in "+$(this).text());
			$(this).parents('div.needs-cleanup').addClass('reply');
		}
	})
	
	
	// animate in new stuff
	if ($("#"+timelineid + ' .timeline-entry.needs-cleanup').length > 0 ) {
		$("#"+timelineid + ' .timeline-entry.needs-cleanup').each( function() {
			$(this).slideDown({'duration':100, 'queue':'slideDownNewStatuses'});
		})
		$.fxqueue('slideDownNewStatuses').start();
	}
	
	
	$("div.needs-cleanup", "#"+timelineid).removeClass('needs-cleanup');

	

	
}







Spaz.UI.focusHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.dump('FOCUS name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};

Spaz.UI.blurHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.dump('BLUR  name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};

Spaz.UI.clickHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	Spaz.dump('BLUR  name:'+e.name+' tagname:'+el.tagName+' id:'+el.id);
};


