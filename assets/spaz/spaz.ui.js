var Spaz;
if (!Spaz) Spaz = {};

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
Spaz.UI.tooltipHideTimeout = null;
// holder for the timeoutObject
Spaz.UI.tooltipShowTimeout = null;
// holder for the timeoutObject
// kind of a const
Spaz.UI.mainTimelineId = 'timeline-friends';


Spaz.UI.playSound = function(url, callback) {
    if (!Spaz.Prefs.get('sound-enabled')) {
        Spaz.dump('Not playing sound ' + url + '- disabled');
        if (callback) {
            Spaz.dump('calling callback manually');
            callback();
            Spaz.dump('ending callback');
        } else {
            Spaz.dump('no callback, returning');
        }
        return;
    }

    Spaz.dump('Spaz.UI.playSound callback:' + callback);
    Spaz.dump("loading " + url);

    var req = new air.URLRequest(url);
    var s = new air.Sound();

    function onComplete(e) {
        var sc = s.play();
        if (sc) {
            Spaz.dump("playing " + url);
            if (callback) {
                sc.addEventListener(air.Event.SOUND_COMPLETE, callback);
            }
        }
    }

    function onIOError(e) {
        Spaz.dump("failed to load " + url);
    }

    s.addEventListener(air.Event.COMPLETE, onComplete);
    s.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
    s.load(req);
}


Spaz.UI.onSoundPlaybackComplete = function(event) {
    air.trace("The sound has finished playing.");
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



Spaz.UI.doWilhelm = function() {
    Spaz.dump('Applying Flash Filter Dropshadow and Negative');

	if (Spaz.Prefs.get('window-dropshadow')) {
	    air.trace('Applying Flash Filter Dropshadow');

	    window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6),
	    	new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
	    );
	} else {
		window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
	    );
	    
	}

    $('#wilhelm').center();
    $('#wilhelm').show(300);
	setTimeout(Spaz.UI.endWilhelm, 960); // end with a timeout instead of relying on sound to finish
};

Spaz.UI.endWilhelm = function() {
	if (Spaz.Prefs.get('window-dropshadow')) {
	    air.trace('Applying Flash Filter Dropshadow');

	    window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
	    );
	}
    $('#wilhelm').hide();
};



Spaz.UI.statusBar = function(txt) {
    $('#statusbar-text').html(txt);
}

Spaz.UI.resetStatusBar = function() {
    $('#statusbar-text').html('Ready');
    Spaz.UI.hideLoading();
}

Spaz.UI.flashStatusBar = function() {
    for (var i = 0; i < 3; i++) {
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





Spaz.UI.showPopup = function(panelid) {
    Spaz.dump('showing ' + panelid + '...');
    $('#' + panelid).css('opacity', 0);
    $('#' + panelid).show();
    $('#' + panelid).fadeTo('fast', 1.0,
    function() {
        Spaz.dump(panelid + ':fadeIn:' + 'faded in!');
        Spaz.dump(panelid + ':display:' + $('#' + panelid).css('display'));
        Spaz.dump(panelid + ':opacity:' + $('#' + panelid).css('opacity'));
    });
    Spaz.UI.centerPopup(panelid);
};
Spaz.UI.hidePopup = function(panelid) {
    Spaz.dump('hiding ' + panelid + '...');
    $('#' + panelid).fadeTo('fast', 0,
    function() {
        Spaz.dump('fadeOut:' + 'faded out!');
        Spaz.dump('fadeOut:' + $('#' + panelid).css('display'));
        Spaz.dump('fadeOut:' + $('#' + panelid).css('opacity'));
        $('#' + panelid).hide();
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
Spaz.UI.uploadImage = function(imgurl) {
	var url = 'app:/html/upload-file.html';
	if (imgurl) {
		url += '?fileUrl='+encodeURIComponent(imgurl);
	}
    this.instance = window.open(url, 'uploadWin', 'height=380,width=400');
}
Spaz.UI.showCSSEdit = function() {
    this.instance = window.open('app:/html/css_edit.html', 'cssEditWin', 'height=350,width=400');
}



Spaz.UI.pageLeft = function(tabEl) {
    Spaz.UI.page(tabEl, -1);
}
Spaz.UI.pageRight = function(tabEl) {
    Spaz.UI.page(tabEl, 1);
}
Spaz.UI.page = function(tabEl, distance) {
    panel = tabEl.id.replace(/tab/, 'panel');
    Spaz.dump('Getting page number using \'#' + panel + ' .timeline-pager-number\'');
    var thispage = parseInt($('#' + panel + ' .timeline-pager-number').text());
    Spaz.dump("Current page:" + thispage);
    Spaz.dump("Paging distance:" + distance);
    var newpage = thispage + distance;
    Spaz.dump("New page:" + newpage);
    if (newpage < 1) {
        return;
    }
    Spaz.Data.loadDataForTab(tabEl, false, newpage);
};
Spaz.UI.setCurrentPage = function(tabEl, newpage) {
    panel = tabEl.id.replace(/tab/, 'panel');
    $('#' + panel + ' .timeline-pager-number').html(newpage);
};
Spaz.UI.showEntryboxTip = function() {
    Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Prefs.getUser() + '</span>. Type your message and press ENTER to send');
}

Spaz.UI.showLocationOnMap = function(location) {
    if (location.length > 0) {
        var url = 'http://maps.google.com/?q=' + encodeURIComponent(location);
        Spaz.dump("Loading " + url);
        openInBrowser(url);
    }
};

// Spaz.UI.showPopup = function(contentid) {
//	if (!Spaz.UI.popupPanel) {
//		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
//	}
//	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
// }
// Spaz.UI.showWhatsNew = function() {
//	Spaz.UI.popupPanel.loadContent('whatsnew.html');
// }
// taken from ThickBox
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
    var jqWin = $('#' + windowid);
    var jqBody = $('#container');

    jqWin.css('margin', 0);

    // WIDTH
    var winWidth = jqWin.outerWidth();
    if (jqBody.width() > winWidth) {
        jqWin.css('left', (jqBody.width() - winWidth) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('left', 0);
    }

    // HEIGHT
    var winHeight = jqWin.outerHeight();
    if (jqBody.height() > winHeight) {
        jqWin.css('top', (jqBody.height() - winHeight) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('top', 0);
    }
    // jqBody.css('border', '1px solid red');
    // jqWin.css('border', '1px solid blue');
    Spaz.dump("windowid:#" + windowid);
    Spaz.dump("jqBody.height():" + jqBody.height());
    Spaz.dump("jqBody.width() :" + jqBody.width());
    Spaz.dump("jqWin.height() :" + winHeight);
    Spaz.dump("jqWin.width()  :" + winWidth);
    Spaz.dump("margin	 :" + jqWin.css('margin'));
    Spaz.dump("top		 :" + jqWin.css('top'));
    Spaz.dump("left		 :" + jqWin.css('left'));

}




Spaz.UI.prepMessage = function() {
    var eb = $('#entrybox');
    eb.val('');
    eb[0].setSelectionRange(0, 0);

	Spaz.UI.clearPostIRT();
};

Spaz.UI.prepRetweet = function(entryid) {
	var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// air.trace(timelineid);
	// air.trace('#'+timelineid+'-'+entryid);
	var entry = $('#'+timelineid+'-'+entryid);
	// air.trace(entry.html());
	var text = entry.children('.entry-text').text();
	var screenname = entry.children('.entry-user-screenname').text();
	
	var rtstr = 'RT @' + screenname + ': '+text+'';
	
	if (rtstr.length > 140) {
		rtstr = rtstr.substr(0,139)+'…"';
	}
	
    var eb = $('#entrybox');
	eb.focus();
	eb.val(rtstr);
	eb[0].setSelectionRange(eb.val().length, eb.val().length);
	
	Spaz.UI.clearPostIRT();
	
};

Spaz.UI.prepDirectMessage = function(username) {
    var eb = $('#entrybox');
    eb.focus();
    if (username) {
        eb.val('d ' + username + ' ...');
        eb[0].setSelectionRange(eb.val().length - 3, eb.val().length)
    } else {
        eb.val('d username');
        eb[0].setSelectionRange(2, eb.val().length)
    }
	Spaz.UI.clearPostIRT();
};

Spaz.UI.prepPhotoPost = function(url) {
    var eb = $('#entrybox');
    eb.focus();
    if (url) {
        eb.val(url + ' desc');
        eb[0].setSelectionRange(eb.val().length - 4, eb.val().length);
        return true;
    } else {
        return false;
    }

	Spaz.UI.clearPostIRT();

}

Spaz.UI.prepReply = function(username, irt_id) {
    var eb = $('#entrybox');
    eb.focus();

	if (irt_id) {
		var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
		var entry = $('#'+timelineid+'-'+irt_id);
		var text = entry.children('.entry-text').text();
		Spaz.UI.setPostIRT(irt_id, text);
	}

    if (username) {
        var newText = '@' + username + ' ';

        if (eb.val() != '') {
            eb.val(newText + eb.val());
            eb[0].setSelectionRange(eb.val().length, eb.val().length);
        } else {
            eb.val('@' + username + ' ...');
            eb[0].setSelectionRange(eb.val().length - 3, eb.val().length);
        }
    } else {
        var newText = '@';
        if (eb.val() != '') {
            eb.val(newText + ' ' + eb.val());
        } else {
            eb.val('@');
        }
        eb[0].setSelectionRange(newText.length, newText.length);
    }
};



/**
 *  
 */
Spaz.UI.setPostIRT = function(status_id, raw_text) {
	if (raw_text) {
		var status_text = raw_text;
		if (status_text.length > 30) {
			status_text = status_text.substr(0,29)+'…'
		}
	} else {
		var status_text = 'status #'+status_id;
	}
	
	// update the GUI stuff
	$('#irt-message')
		.html(status_text)
		.attr('data-status-id', status_id);
	$('#irt').fadeIn('fast');
};


/**
 *  
 */
Spaz.UI.clearPostIRT = function() {
	$('#irt').fadeOut('fast');
	$('#irt-message').html('').attr('data-status-id', '0');
};



/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
    var entrybox = $('#entrybox');

    if (entrybox.val() != '' && entrybox.val() != Spaz.Prefs.get('entryboxhint')) {

        Spaz.dump('length:' + entrybox.val().length);

		var irt_id = parseInt($('#irt-message').attr('data-status-id'));
		
		if (!Spaz.Prefs.get('twitter-disable-direct-posting')) {
			if ( irt_id > 0 ) {
				Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass(), irt_id);
			} else {
				Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass());
			}			
		} else if (Spaz.Prefs.get('services-pingfm-enabled')) {
			Spaz.Data.updatePingFM( entrybox.val() );
		} else {
			Spaz.UI.statusBar("Nothing sent! Enable direct posting and/or ping.fm");
		}

        
        // entrybox.val('');
    }
}







Spaz.UI.decodeSourceLinkEntities = function(str) {
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/&lt;/gi, '<');
    return str;
}


Spaz.UI.setSelectedTab = function(tab) {
    if (!isNaN(tab)) {
        // if a # is passed in, get the element of the corresponding tab
        Spaz.dump('getting tab element for number ' + tab)
        Spaz.UI.selectedTab = Spaz.UI.tabbedPanels.getTabs()[tab]
    } else {
        Spaz.dump('tab element passed in ' + tab)
        Spaz.UI.selectedTab = tab;
    }

    Spaz.dump('Spaz.UI.selectedTab: ' + Spaz.UI.selectedTab.id);

    Spaz.dump('restarting reload timer');
    Spaz.restartReloadTimer();

    Spaz.Data.loadDataForTab(tab);

}


Spaz.UI.reloadCurrentTab = function(force, reset) {
    Spaz.dump('reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, force, reset);
}


Spaz.UI.autoReloadCurrentTab = function() {
    Spaz.dump('auto-reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, true);
}

Spaz.UI.clearCurrentTimeline = function() {
    Spaz.dump('clearing the current timeline');
    var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)

    // reset the lastcheck b/c some timelines will use "since" parameters
	section.lastcheck = 0;
	Spaz.dump('set lastcheck to 0');
	if (section.lastid) {
		section.lastid = 0;
		Spaz.dump('set lastid to 0');
	}
	if (section.lastid_dm) {
		section.lastid_dm = 0;
		Spaz.dump('set lastid_dm to 0');
	}
	


    if (section.canclear) {
        var timelineid = section.timeline;
        $('#' + timelineid + ' .timeline-entry').remove();
        Spaz.dump('cleared timeline #' + timelineid);
    } else {
        Spaz.dump('timeline not clearable');
    }
}


Spaz.UI.markCurrentTimelineAsRead = function() {
    Spaz.dump('clearing the current timeline');
    var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)

    var timelineid = section.timeline;
    $('#' + timelineid + " div.timeline-entry:visible").each(function() {

		Spaz.DB.markEntryAsRead(Spaz.UI.getStatusIdFromElement(this));
        Spaz.UI.markEntryAsRead(this);

    });

    $().trigger('UNREAD_COUNT_CHANGED');

};


Spaz.UI.toggleTimelineFilter = function() {
    Spaz.dump('toggling class dm-replies on #' + Spaz.Section.friends.timeline)

    if ($('#' + Spaz.Section.friends.timeline).is('.dm-replies')) {
        $('#' + Spaz.Section.friends.timeline).removeClass('dm-replies');
        Spaz.UI.statusBar('Showing all tweets');
    } else {
        $('#' + Spaz.Section.friends.timeline).addClass('dm-replies');
        Spaz.UI.statusBar('Hiding tweets not directed at you');
    }
	
	$().trigger('UNREAD_COUNT_CHANGED');
};



/*
    Remap this function to the new, more OOP-oriented setup
*/
Spaz.UI.showTooltip = function(el, str, previewurl) {

    var opts = {
        'el': el,
        'str': str,
        'previewurl': previewurl,
    }

    // if (e) { opts['e'] = e }
    if (event) {
        opts.e = event
    }

    var tt = new Spaz_Tooltip(opts);
    tt.show();

};





Spaz.UI.hideTooltips = function() {
    // clear existing timeouts
    var tt = $('#tooltip');

    Spaz.dump('clearing show and hide tooltip timeouts');
    clearTimeout(Spaz_Tooltip_Timeout)
    clearTimeout(Spaz_Tooltip_hideTimeout);
    tt.stop();
    $('#tooltip .preview').hide();
    tt.hide();
}


Spaz.UI.getViewport = function() {
    return {
        x: $('#container').scrollLeft(),
        y: $('#container').scrollTop(),
        cx: $('#container').width(),
        cy: $('#container').height()
    };
}






Spaz.UI.showLinkContextMenu = function(jq, url) {
    var el = jq[0];

    // hide any showing tooltips
    // air.trace('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // air.trace('opening context menu');
    $('#linkContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .unbind()
    .show();


    $('#userContextMenu .menuitem').unbind();

    // air.trace('outerHTML:'+el.outerHTML);
    var urlarray = /http:\/\/([^'"]+)/i.exec(url);
    if (urlarray && urlarray.length > 0) {
        var elurl = urlarray[0];

        // air.trace('url from element:'+elurl);
        $('#linkContextMenu-copyLink').one('click', {
            url: elurl
        },
        function(event) {
            Spaz.Sys.setClipboardText(event.data.url);
            // air.trace('Current Clipboard:'+Spaz.Sys.getClipboardText());
        });
        // air.trace('Set one-time click event on #menu-copyLink');
        $(document).one('click',
        function() {
            $('#linkContextMenu').hide();
        });
        // air.trace('set one-time link context menu close event for click on document');
    } else {
        // air.trace('no http link found');
        }
};



Spaz.UI.showUserContextMenu = function(jq, screen_name) {
    if (!screen_name) {
        return false;
    }

    air.trace(screen_name)

    var el = jq[0];

    Spaz.dump(el);

    // hide any showing tooltips
    // air.trace('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // air.trace('opening context menu for user '+screen_name);
    $('#userContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .show();

    $('#userContextMenu .menuitem').attr('user-screen_name', screen_name);


    // air.trace('Set one-time click event on #userContextMenu');
    $(document).one('click',
    function() {
        $('#userContextMenu').hide();
    });

};





Spaz.UI.addItemToTimeline = function(entry, section, mark_as_read, prepend) {
    // alert('adding:'+entry.id)
    if (entry.error) {
        Spaz.dump('There was an error in the entry:' + entry.error)
    }

    var timelineid = section.timeline;

	Spaz.dump('TIMELINE #' + timelineid + '-' + entry.id);

    // air.trace(JSON.stringify(entry));
    if ($('#' + timelineid + '-' + entry.id).length < 1) {
		// air.trace('adding #' + timelineid + '-' + entry.id);
		entry.isDM = false;
		entry.isSent = false;
		if (!entry.favorited) { // we do this to make a favorited property for DMs
			entry.favorited = false;
		}
		
		if (entry.sender) {
			entry.user = entry.sender
			entry.isDM = true;
		}

		if (!entry.in_reply_to_screen_name) {
			entry.in_reply_to_screen_name = false;
		}
			
		
		if (timelineid == 'timeline-user') {
			entry.isSent = true;
		}

		// Spaz.dump(entry);

		if (!entry.user.name) {
			entry.user.name = entry.user.screen_name
		}
		
		/*
			Check for reply
		*/
		
		if (entry.in_reply_to_user_id && !entry.in_reply_to_screen_name) {
			var reply_matches = null;
			if (reply_matches = entry.text.match(/^@([a-zA-Z0-9_\-]+)/i)) {
				entry.in_reply_to_screen_name = reply_matches[1];
			}
		}
		
		entry.rowclass = "even";
		entry.timestamp = httpTimeToInt(entry.created_at);
		entry.base_url = Spaz.Prefs.get('twitter-base-url');
		entry.timelineid = timelineid;
		
		
		/*
			Clean the entry.text
		*/
		// save a raw version
		entry.rawtext = entry.text;
		
		// fix extra ampersand encoding
		entry.text = entry.text.replace(/&amp;(gt|lt|quot|apos);/gi, '&$1;');

		// fix entity &#123; style extra encoding
		entry.text = entry.text.replace(/&amp;#([\d]{3,4});/gi, '&#$1;');

		// air.trace(this.innerHTML);
		if (Spaz.Prefs.get('usemarkdown')) {
			var md = new Showdown.converter();

			// Markdown conversion with Showdown
			entry.text = md.makeHtml(entry.text);

			// put title attr in converted Markdown link
			entry.text = entry.text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
		}

		// convert inline links
		/*
			Inline links that start with http://
		*/
		var inlineRE = /(?:(\s|^|\.|\:|\())(https?:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_\-~@#+]*)*)/g;
		entry.text = entry.text.replace(inlineRE, '$1<a href=\"$2$3$6\" title="Open link in a browser window" class="inline-link">$3&raquo;</a>');

		/*
			this is the regex we use to match inline
			lots of uncommon but valid top-level domains aren't used
			because they cause more problems than solved
		*/
		var inlineRE = /(?:(\s|^|\:|\())((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+(com|net|org|co\.uk|aero|asia|biz|cat|coop|edu|gov|info|jobs|mil|mobi|museum|name|au|ca|cc|cz|de|eu|fm|fr|gd|hk|ie|it|jp|nl|no|nu|nz|ru|st|tv|uk|us))((?:\/[\w\.\/\?=%&_\-~@#+]*)*)/g;
		entry.text = entry.text.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open link in a browser window" class="inline-link">$2&raquo;</a>');

		// email addresses
		entry.text = entry.text.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '$1<a href="mailto:$2@$3" class="inline-email" title="Send an email to $2@$3">$2@$3</a>');

		// convert @username reply indicators
		entry.text = entry.text.replace(/(^|\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a href="' + Spaz.Prefs.get('twitter-base-url') + '$2" class="inline-reply" title="View $2\'s profile page" user-screen_name="$2">@$2</a>');

		// convert emoticons
		entry.text = Emoticons.SimpleSmileys.convertEmoticons(entry.text)
		
		// hashtags
		entry.text = entry.text.replace(/(\s|^|\(|\[)(#([a-z0-9_\-]{2,}))/gi, '$1<a href="javascript:;" title="View search results for $2" class="inline-link hashtag-link">$2</a>');
		
		
		
		var entryHTML = Spaz.Tpl.parse('timeline_entry', entry);
		// air.trace(entryHTML);
		
		// Make the jQuery object and bind events
		var jqentry = $(entryHTML);
		if (mark_as_read) {
			jqentry.addClass('read')
			jqentry.removeClass('new')
		}
		
		if (entry.isDM) {
			jqentry.addClass('dm');
		}
		
		// We only do the fetch if the mark_as_read is not specified
		if (typeof mark_as_read == 'undefined')
		{
			// The as read callback
			Spaz.DB.asyncGetAsRead(entry.id,
			function(read)
			{
				if (read)
				{
					// air.trace("Entry " + entry.id + " is read");
					jqentry.addClass('read');
					jqentry.removeClass('new');
					$().trigger('UNREAD_COUNT_CHANGED');
				}
			});
		}
		
		if (prepend) {
			$('#' + timelineid).prepend(jqentry);
		} else {
			$('#' + timelineid).append(jqentry);
		}


		return true;

    } else {
        Spaz.dump('skipping ' + entry.id);

        return false;
    }

}




Spaz.UI.selectEntry = function(el) {

    Spaz.dump('unselected tweets');
    $('div.timeline-entry.ui-selected').removeClass('ui-selected');


    Spaz.dump('selecting tweet');
    $(el).addClass('ui-selected').addClass('read').each(function() {
        if (entryId = Spaz.UI.getStatusIdFromElement(this)) {
            air.trace("Want to mark as read " + entryId);
            Spaz.DB.markEntryAsRead(entryId);
        }
    });

	Spaz.dump(el);
    Spaz.dump('selected tweet #' + el.id + ':' + el.tagName + '.' + el.className);

    $().trigger('UNREAD_COUNT_CHANGED');
	
}



Spaz.UI.getStatusIdFromElement = function(el) {
    var entryId = null;
    if (el.id.indexOf("timeline-") == 0)
    {
        var index = el.id.indexOf("-", "timeline-".length);
        if (index >= 0)
        {
            entryId = el.id.substring(index + 1);
        }
    }

    //
    if (entryId == null) {
        air.trace("Cannot obtain entry id for entry with DOM id " + this.id);
        return false
    } else {
        return entryId
    }
};


/*
	this returns the first matching element that contains the given id
*/
Spaz.UI.getElementFromStatusId = function(id) {
	var element = $('.entry-id:contains('+id+')').parent().get()[0];
	if (element) {
		air.trace(element.id);
		return element
	}
	return false;
};



Spaz.UI.markEntryAsRead = function(el) {

    $(el).addClass('read');

    $().trigger('UNREAD_COUNT_CHANGED');

}




Spaz.UI.sortTimeline = function(timelineid, reverse, sort_all) {

    /*
        Check the sorting
    */
    var unsorted = false;

    $('#' + timelineid + ' div.timeline-entry').each(function() {

        if ( parseInt($(this).find('div.entry-timestamp').text()) < parseInt($(this).next().find('div.entry-timestamp').text()) ) {
            unsorted = true;
            return false;
        }
    });

    if (unsorted) {
        // if (sort_all) {
        time.start('sortTimeline');
        var cells = $('#' + timelineid + ' div.timeline-entry').remove().get();
        // } else {
        // var cells = $('#'+timelineid+' div.timeline-entry.needs-cleanup');
        // }
        // Spaz.dump('cells length:'+cells.length);

        if (reverse) {
            $(cells.sort(Spaz.UI.sortTweetElements)).prependTo('#' + timelineid);
        } else {
            $(cells.sort(Spaz.UI.sortTweetElements)).appendTo('#' + timelineid);
        }
        time.stop('sortTimeline');

        // time.report();
        // Spaz.dump('done sorting');
    }

}



Spaz.UI.sortTweetElements = function(a, b) {
    var inta = parseInt($(a).find('.entry-timestamp').text())
    var intb = parseInt($(b).find('.entry-timestamp').text())
    var diff =  inta - intb;
    return diff;
};



Spaz.UI.reverseTimeline = function(timelineid) {
    var cells = $('#' + timelineid + ' .timeline-entry');
    cells.reverse(true).remove().appendTo('#' + timelineid);
}


Spaz.UI.getUnreadCount = function() {
    var timelineid = Spaz.Section.friends.timeline;

	var selector = '#' + timelineid + ' div.timeline-entry:visible'

    // // unread count depends on whether or not we're showing everything, or just replies/dms
    // if ($('#' + timelineid).is('.dm-replies')) {
    //     var selector = '#' + timelineid + ' div.timeline-entry.dm, #' + timelineid + ' div.timeline-entry.reply'
    // } else {
    //     var selector = '#' + timelineid + ' div.timeline-entry'
    // }
	var unread_count = $(selector).not('.read').length;
	
	air.trace(unread_count);

    return unread_count;
};


Spaz.UI.getNewEntrySelector = function() {
    var timelineid = Spaz.Section.friends.timeline;

    // we change the selector so that messages not showing do not trigger notifications
    if ($('#' + timelineid).is('.dm-replies')) {
        var selector = '#' + timelineid + ' .new.dm, #' + timelineid + ' .new.reply:visible'
    } else {
        var selector = '#' + timelineid + ' .new:visible'
    }

    return selector;
}

Spaz.UI.getNewEntryCount = function() {
    return $(Spaz.UI.getNewEntrySelector()).not('.read').length;
}


Spaz.UI.notifyOfNewEntries = function() {

    $().trigger('UNREAD_COUNT_CHANGED');

    Spaz.dump('notifyOfNewEntries');

	var new_count = Spaz.UI.getNewEntryCount();

    if (new_count > 0) {

        Spaz.dump('NewEntries found!');

		if (Spaz.Prefs.get('window-notificationmethod') === 'growl') {
			
			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl('Spaz', new air.File(new air.File("app:/images/spaz-icon-alpha.png").nativePath).url);
			}
			
			Spaz.Growl.notify(new_count + " New Messages", "There were "+new_count+" new messages found", null, SpazGrowl.NEW_MESSAGE_COUNT, function() {
				air.NativeApplication.nativeApplication.activate();
			});
			
			
			var newtweets = $(Spaz.UI.getNewEntrySelector()).not('.read');
			
			
			if ( new_count > Spaz.Prefs.get('window-notificationmax')) {
				newtweets = newtweets.slice(0, Spaz.Prefs.get('window-notificationmax'));
			}


			newtweets.each( function(i) {
				
				var screen_name = $(this).children('.entry-user-screenname').text();
				var text = $(this).children('.entry-text').text();
				var img = $(this).children('.entry-user-img').text();
				
				if ( $(this).hasClass('reply') && $(this).not('.read') ) {
					Spaz.Growl.notify(screen_name, text, img, SpazGrowl.NEW_MESSAGE_REPLY, function() {
						air.NativeApplication.nativeApplication.activate();
					});
				} else if ( $(this).hasClass('dm') && $(this).not('.read') ) {
					Spaz.Growl.notify(screen_name, text, img, SpazGrowl.NEW_MESSAGE_DM, function() {
						air.NativeApplication.nativeApplication.activate();
					});
				} else {
					Spaz.Growl.notify(screen_name, text, img, SpazGrowl.NEW_MESSAGE, function() {
						air.NativeApplication.nativeApplication.activate();
					});
				}
			});
			
		} else {

			var newtweet = $(Spaz.UI.getNewEntrySelector()).not('.read').get(0);
			
			// alert(newtweet.outerHTML);
			
	        Spaz.dump('Sending notification');
	        var resp = "";

			var screen_name = $(newtweet).children('.entry-user-screenname').text();
			var text = $(newtweet).children('.entry-text').text();
			var img = $(newtweet).children('.entry-user-img').text();
			
			// alert("screen_name:"+screen_name+"\ntext:"+text+"\n img:"+img);
			
	        if (new_count > 1) {
	            var msg = screen_name + " (+" + (new_count - 1) + " more)";
	        } else {
	            var msg = screen_name;
	        }
	        Spaz.UI.notify(text, msg, Spaz.Prefs.get('window-notificationposition'), Spaz.Prefs.get('window-notificationhidedelay'), img);
		}

        Spaz.UI.playSoundNew();
        Spaz.UI.statusBar('Updates found');

    } else {
        Spaz.dump('NewEntries NOT found!');
        Spaz.UI.statusBar('No new messages');
    }

}


Spaz.UI.alert = function(message, title) {
    if (!title) {
        title = "Alert"
    }
    Spaz.UI.notify(message, title, null, Spaz.Prefs.get('window-notificationhidedelay'), 'app:/images/spaz-icon-alpha_48.png');
}


Spaz.UI.notify = function(message, title, where, duration, icon, force) {
    if (Spaz.Prefs.get('window-shownotificationpopups') || force) {
        // Spaz.Notify.add(message, title, where, duration, icon);

		if (Spaz.Prefs.get('window-notificationmethod') === 'growl') {
			
			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl('Spaz', new air.File(new air.File("app:/images/spaz-icon-alpha.png").nativePath).url);
			}
			
			Spaz.Growl.notify(title, message, icon);
		} else {
			PurrJS.notify(title, message, icon, duration, where);
		}
		
    } else {
        Spaz.dump('not showing notification popup - window-shownotificationpopups disabled');
    }
}






// cleans up and parses stuff in timeline's tweets
Spaz.UI.cleanupTimeline = function(timelineid, suppressNotify, suppressScroll, skip_sort) {

	/*
		record some values so we can adjust the scrollTop if necessary
	*/
	var oldFirst  = $('#'+timelineid+" div.timeline-entry:first");
	var $timeline = $('#'+timelineid);
	var offset_before = oldFirst.offset().top;
	air.trace("oldFirst BEFORE top: " + oldFirst.offset().top + "\nscrollTop: " + $timeline.parent().scrollTop());

	

	// alert('Spaz.UI.cleanupTimeline');

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        var numentries = $('#' + timelineid + ' div.timeline-entry').length;
        time.start('sortTimeline');
        if (numentries > 1 && !skip_sort) {
            Spaz.dump('Sorting timeline numentries:'+numentries);
            Spaz.UI.sortTimeline(timelineid, true);
        } else {
            Spaz.dump('not sorting - skip_sort:'+skip_sort+' numentries:'+numentries);
        }
        time.stop('sortTimeline');
        return false;
    });


    /*
        remove extra entries
    */
    Spaz.Timers.add(function() {
        time.start('removeExtras');
        
		var tl_selector = '#' + timelineid + ' div.timeline-entry';
		
		// alert(tl_selector);
		
		function removeExtraItems(type) {
			switch (type) {
				case 'reply':
					var tweets  = $(tl_selector).is('reply');
					var prefkey = "timeline-maxentries-reply";
					break;
					
				case 'dm':
					var tweets  = $(tl_selector).is('dm');
					var prefkey = "timeline-maxentries-dm";
					break;
					
				default:
					var tweets  = $(tl_selector).not('.reply, .dm');
					var prefkey = "timeline-maxentries";
			}

			var numEntries = tweets.length
	        if (numEntries > Spaz.Prefs.get(prefkey)) {
	            var diff = numEntries - Spaz.Prefs.get(prefkey);
	            air.trace("numEntries "+type+"is " + numEntries + " > " + Spaz.Prefs.get(prefkey) + "; removing last " + diff + " entries");
	            tweets.slice(diff * -1).remove();
	        }
		}
		
		
		removeExtraItems();
		removeExtraItems('reply');
		removeExtraItems('dm');

        time.stop('removeExtras');
        return false;
    });


    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('removeEvenOdd-convertPostTimes');

        $("#" + timelineid + ' .timeline-entry').removeClass('even').removeClass('odd');

        $("#" + timelineid + ' a.status-created-at').each(function(i) {
            $(this).text(get_relative_time($(this).attr('data-created-at')));
        });
        time.stop('removeEvenOdd-convertPostTimes');
        return false;
    });



    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('applyEvenOdd');
        // apply even class
        $("#" + timelineid + ' .timeline-entry:nth-child(even)').addClass('even');

        // apply odd class
        $("#" + timelineid + ' .timeline-entry:nth-child(odd)').addClass('odd');
        time.stop('applyEvenOdd');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('scrollTimeline');
        if (!suppressScroll) {
            if ($("#" + timelineid + ' .timeline-entry.new:not(.read)').length > 0) {
                // scroll to top
                Spaz.dump('scrolling to .timeline-entry.new:not(.read) in #' + timelineid);

				/*
					
				*/
                if (Spaz.Prefs.get('timeline-scrollonupdate') && $timeline.parent().scrollTop() > 0) {
                    try {
						air.trace('scrolliong thee timeline '+timelineid);
                        $('#'+timelineid).parent().scrollTo('.timeline-entry.new:not(.read):last', {
                            speed: 400,
                            easing: 'swing'
                        })
                    } catch(e) {
                        Spaz.dump('Error doing scrollTo first new entry - probably switched tabs in the middle of loading. No sweat!');
                    }
                }

            }
        }
        time.stop('scrollTimeline');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {


        var cleanupTweets = $("div.needs-cleanup", "#" + timelineid);

        time.start('bindOnceFadein');
        cleanupTweets.find('img.user-image').one('load',
        function() {
            // alert('fadingIn');
            $(this).fadeTo('500', '1.0');
        });
        time.stop('bindOnceFadein');

        time.start('highlightReplies');
        // highlight all messages that mention @username
        cleanupTweets.find(".status-text").each(function(i) {
            var re = new RegExp('@' + Spaz.Prefs.getUser(), 'i');
            if (re.test($(this).html())) {
                // Spaz.dump("found reply in "+$(this).text());
                $(this).parents('div.needs-cleanup').addClass('reply');
            }
        })
        time.stop('highlightReplies');


        /* clean up the .status-text */

        // make it here so we don't instantiate on every loopthrough
        var md = new Showdown.converter();

        time.start('cleanupStatusText');
        cleanupTweets.find("div.status-text").each(function(i) {

            // ******************************
            // Support for shortened URL rewriting
            // ******************************
            // We save this as it will be used in the response status callback
            var divElt = this;

            // We save the text as it could change in the loop due to async callbacks
            var txt = divElt.innerHTML;
 
            var domains = ["short.ie", "tinyurl.com", "is.gd", "snipr.com", "snurl.com", "moourl.com", "url.ie", "snipurl.com", "xrl.us", "bit.ly", "ping.fm", "urlzen.com", "revcanonical" ];
            var stream = new air.URLStream();

            // time.start('lookingForShortDomains');
            for (var i in domains)
            {
                // Get domain
                var domain = domains[i];

                // Iterate over URL pattern
                var urlRE = new RegExp("http:\\/\\/" + domain + "([\\w\\-_+\\/]*)", "g");
                var matchArray = null;
                while (matchArray = urlRE.exec(txt)) {
                    // air.trace("Getting content of URL " + matchArray[1]);
                    Spaz.dump("Getting content of URL " + matchArray[1]);

                    // Get the URL
                    var url = matchArray[0];

                    // Now we make a request to obtain the response URL
                    stream.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus, false, 0, true);
                    stream.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);

					// make the URLRequest and set some properties
					url_req = new air.URLRequest(url);
					url_req.manageCookies = false;
					url_req.authenticate  = false;
					url_req.cacheResponse = true;
					url_req.userAgent = Spaz.Sys.getUserAgent();

					// Perform load
                    stream.load(url_req);
                    // air.trace("Decoding " + domain + " URL " + url);
                    air.trace("Decoding " + domain + " URL " + url);
                }

            }
            // time.stop('lookingForShortDomains');

            function onHTTPResponseStatus(event) {
                // air.trace('onHTTPResponseStatus');
                if (event.status == 200) {
                    // Here we get the value to rewrite
                    var targetURL = event.responseURL;
                    var slicerRE = /(?:(\s|^|\.|\:|\())(?:http:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_-]*)*)/;
                    var targetDomain = targetURL.replace(slicerRE, "$2");
                    Spaz.dump("Got a response status event for url " + url + ": " + targetURL);
                    $(divElt).find("a[href*=" + url + "]").html(targetDomain + "&raquo;").attr("href", targetURL);
                }
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

            function onIOError(event) {
                // air.trace('onIOError');
                var targetURL = event.responseURL;
                Spaz.dump('Request to ' + event.responseURL + ' returned an IOErrorEvent');
                Spaz.dump(event);
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

        });

        time.start('removeCleanupClass');
        // remove the needs-cleanup and show
        cleanupTweets.css('display', '').removeClass('needs-cleanup');
        time.stop('removeCleanupClass');

        time.stop('cleanupStatusText');

        // Spaz.Timers.stop();


		/*
			this is a helper to fadeIn any user avatars that didn't see the load event properly
		*/
		function fadeInStragglers() {
			$("img.user-image").each( function() {
				if ($(this).css('opacity') < 1) {
					// air.trace('fadingIn: '+this.outerHTML);
					$(this).fadeTo('500', '1.0');
				}
			});	
		};
		
		/*
			run the helper after 5 seconds
		*/
		setTimeout(fadeInStragglers, 5000);
		
		/*
			if necessary, adjust the scrollTop
		*/
		var offset_after = oldFirst.offset().top;
		var offset_diff = Math.abs(offset_before - offset_after);
		air.trace("oldFirst AFTER top: " + oldFirst.offset().top + "\nscrollTop: " + $timeline.parent().scrollTop() + "\noffset_diff: "+offset_diff);
		
		if ($timeline.parent().scrollTop() > 0) {
			$timeline.parent().scrollTop( $timeline.parent().scrollTop() + offset_diff );			
		}
		
		air.trace($timeline.parent().scrollTop());
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        //Spaz.dump($("#"+timelineid).html());
        time.start('setNotificationTimeout');
        // we delay on notification of new entries because stuff gets
        // really confused and wonky if you fire it off right away
        if (!suppressNotify) {
            Spaz.dump('Set timeout for notifications');
            Spaz.UI.notifyOfNewEntries();
            // remove "new" indicators
            $("#" + Spaz.Section.friends.timeline + ' .new').removeClass('new');
        }
        time.stop('setNotificationTimeout');

        return false;
    });

	
}




Spaz.UI.showTab = function(index) {
    Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[index]);
    Spaz.UI.tabbedPanels.showPanel(index);
}

Spaz.UI.showPrefs = function() {
    Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.prefs.tab));
    Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
}

Spaz.UI.openLoginPanel = function() {
    Spaz.UI.prefsCPG.openPanel(0);
};



Spaz.UI.focusHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('FOCUS name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.blurHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.clickHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};


