var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

Spaz.UI.currentTheme = '';
Spaz.UI.userStyleSheet = '';
Spaz.UI.themeDir = '';

Spaz.UI.tabbedPanels = {};

Spaz.UI.entryBox = {};

Spaz.UI.playSounds  = 1; // default state
Spaz.UI.useMarkdown = 1;

Spaz.UI.showContextMenus = 1; // hard-coded - this works properly now

// Paths to sound files
Spaz.UI.SOUND_UPDATE	= '/assets/sounds/TokyoTrainStation/Csnd.mp3';
Spaz.UI.SOUND_STARTUP	= '/assets/sounds/TokyoTrainStation/On.mp3';
Spaz.UI.SOUND_SHUTDOWN	= '/assets/sounds/TokyoTrainStation/Off.mp3';
Spaz.UI.SOUND_NEW		= '/assets/sounds/TokyoTrainStation/New.mp3';

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

Spaz.UI.statusBar = function(txt) {
	$('#statusbar-text').html(txt);
}

Spaz.UI.resetStatusBar = function() {
	$('#statusbar-text').html('Ready');
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
	Spaz.Bridge.browseForUserCss ();	
}

Spaz.UI.clearUserStyleSheet = function() {
	Spaz.UI.userStyleSheet = '';
	$('#UserCSSOverride').attr('href',Spaz.UI.userStyleSheet);
	$('#prefs-user-stylesheet').val(Spaz.UI.userStyleSheet);
}

Spaz.UI.setMarkdownState = function(state) {
	Spaz.dump("MarkdownState: "+state);
	if (state) {
		Spaz.UI.markdownOn()
	} else {
		Spaz.UI.markdownOff()
	}
}
Spaz.UI.markdownOn = function() {
	Spaz.dump("Sounds are ON");
	Spaz.UI.useMarkdown = 1;
}
Spaz.UI.markdownOff = function() {
	Spaz.dump("Sounds are OFF");
	Spaz.UI.useMarkdown = 0;
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
		eb.val('@'+username+': ...');
		eb[0].setSelectionRange(eb.val().length-3, eb.val().length);
	}
};

/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
	var entrybox = $('#entrybox');
	if (entrybox.val() != '' && entrybox.val() != entryBoxHint) {
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
	Spaz.UI.selectedTab = tab;
	Spaz.dump('Spaz.UI.selectedTab: '+ Spaz.UI.selectedTab.id);
	
	Spaz.restartReloadTimer();
	
	// force loading data if empty
	var thisDs = Spaz.Data.getDsForTab(tab);
	if (!thisDs.data || thisDs.data.length < 1) {
		Spaz.Data.loadDataForTab(tab);
	}
}


Spaz.UI.reloadCurrentTab = function() {
	Spaz.dump('reloading the current tab');
	Spaz.Data.loadDataForTab(Spaz.UI.selectedTab);
}


Spaz.UI.autoReloadCurrentTab = function() {
	Spaz.dump('auto-reloading the current tab');
	Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, true);
}



Spaz.UI.windowActiveHandler = function () {
	Spaz.dump('Window ACTIVE');
	if ($('body').focus()) {
	}
	
}



// observer that cleans up each status entry once the dataRegion has loaded
Spaz.UI.regionObserver = function(notificationState, notifier, data) {
	
	if (notificationState == "onPostUpdate") {
		Spaz.dump('onPostUpdate triggered');
		
		// make tweets selectable
		$('div.timeline-entry').each( function(index) {
			$(this).bind('click', {el:this}, function(event){
				var el = event.data.el;
				Spaz.dump('selecting tweet');
				$('div.timeline-entry').removeClass('ui-selected');
				Spaz.dump('unselected tweets');
				$(el).addClass('ui-selected');
				Spaz.dump('selected tweet #'+el.id+':'+el.tagName+'.'+el.className);
			});
		});
		
		
		
	
		
		// make it here so we don't instantiate on every loopthrough
		var md = new Showdown.converter();
		
		$("div.status-text", "#"+data.regionID).each(function(i){
			
			// check for cached status
			var statusHTML = Spaz.Cache.getStatus(this.id);
			if (statusHTML){
				this.innerHTML = statusHTML;
			} else {
				Spaz.dump('Pre-conversion:'+this.innerHTML);
				// fix extra ampersand encoding
				this.innerHTML = this.innerHTML.replace(/&amp;(gt|lt|quot|apos);/gi, '&$1;');
				
				// fix entity &#123; style extra encoding
				this.innerHTML = this.innerHTML.replace(/&amp;#([\d]{3,4});/gi, '&#$1;');


							
				// convert inline links
				this.innerHTML = this.innerHTML.replace(/(^|\s+)(http|https|ftp):\/\/([^\]\)\s&]+)/gi, '$1<a onclick="openInBrowser(\'$2://$3\')" title="Open $2://$3 in a browser window" class="inline-link">go&raquo;</a>');
			
				// email addresses
				this.innerHTML = this.innerHTML.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '<a onclick="openInBrowser(\'mailto:$2@$3\')" title="Email $2@$3" class="inline-email">$2@$3</a>');
			
				// convert @username reply indicators
				this.innerHTML = this.innerHTML.replace(/(\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a onclick="openInBrowser(\'http://twitter.com/$2\')" title="View $2\'s profile" class="inline-reply">@$2</a>');
							
				// @usernames at the beginning of lines
				this.innerHTML = this.innerHTML.replace(/^@([a-zA-Z0-9_-]+)/gi, '<a onclick="openInBrowser(\'http://twitter.com/$1\')" title="View $1\'s profile" class="inline-reply">@$1</a>');

				
				if (Spaz.UI.useMarkdown) {
					Spaz.dump('Pre-Markdown:'+this.innerHTML);
					// Markdown conversion with Showdown
					this.innerHTML = md.makeHtml(this.innerHTML);
					
					Spaz.dump('Pre-onclick conversion:'+this.innerHTML);
					
					// replace hrefs from markdown with onClick calls 
					this.innerHTML = this.innerHTML.replace(/href="([^"]+)"/gi, 'onclick="openInBrowser(\'$1\')" title="Open $1 in a browser window" class="inline-link"');
				}
				
				Spaz.dump('Post conversion:'+this.innerHTML);
				
				// cache this converted status
				Spaz.Cache.setStatus(this.id, this.innerHTML);
			}
		});
		
		// convert post times to relative
		$("span.status-created-at", "#"+data.regionID).each(function(i) {
			this.innerHTML = get_relative_time(this.innerHTML);
		});
		
		$("span.status-source-label", "#"+data.regionID).each(function(i) {
			
			var sourceHTML = Spaz.Cache.getSource(this.innerHTML);			

			if (this.innerHTML.length>0){
				if (!sourceHTML) {
					var old      = this.innerHTML;
					var linkhtml = $(Spaz.UI.decodeSourceLinkEntities(this.innerHTML));
					// Spaz.dump('linkhtml:'+linkhtml);
					var href;
					if (href = linkhtml.attr('href')) {
						linkhtml.attr('onclick', 'openInBrowser(\''+href+'\')');
						// Spaz.dump(linkhtml.attr('onclick'));
						linkhtml.removeAttr('href');
						linkhtml.attr('title', 'View information about this posting method');
						this.innerHTML=linkhtml[0].outerHTML;
						Spaz.Cache.setSource(old, this.innerHTML);
						// Spaz.dump(this);
					}
				} else {
					this.innerHTML=sourceHTML;
				}
				//
			} else {
				//Spaz.dump('nothing to convert');
			}
		});
		
		$('span.status-protected', "#"+data.regionID).each(function(i) {
			if (this.innerHTML == 'true') {
				this.innerHTML = '<img src="themes/'+Spaz.UI.currentTheme+'/images/icon-lock.png" title="Protected post - please respect this user\'s privacy" class="protected-post" />';
			} else {
				this.innerHTML = '';
			}
		});


		// tab tooltip setup
		$('a[@title]', "#"+data.regionID).Tooltip(toolTipPrefs);

		// tab tooltip setup
		$('img[@title]', "#"+data.regionID).Tooltip(toolTipPrefs);
		
		
		if (Spaz.UI.showContextMenus) {
			// add context menus
			//$('a', '#'+data.regionID).contextMenu('linkContextMenu');
			$('a', '#'+data.regionID).each( function(i) {
				$(this).bind('contextmenu', {el:this}, function(event) {
					
					var el = event.data.el;
					
					// hide any showing tooltips
					Spaz.dump('hiding tooltip');
					
					$('#tooltip').hide();
					
					// show the link context menu
					Spaz.dump('opening context menu');
					$('#linkContextMenu').css('left', event.pageX)
						.css('top',  event.pageY)
						.show();
	
					Spaz.dump('outerHTML:'+el.outerHTML);				
					var urlarray = /http:\/\/([^'"]+)/i.exec(el.outerHTML);
					if (urlarray && urlarray.length > 0) {
						var elurl = urlarray[0];
					
						Spaz.dump('url from element:'+elurl);
					
						$('#menu-copyLink').one('click', {url:elurl}, function(event) {
							Spaz.Bridge.setClipboardText(event.data.url);
							Spaz.dump('Current Clipboard:'+Spaz.Bridge.getClipboardText());
						});
						Spaz.dump('Set one-time click event on #menu-copyLink');
					
						$(document).one('click', function() {
							$('#linkContextMenu').hide();
						});
						Spaz.dump('set one-time link context menu close event for click on document');
					} else {
						Spaz.dump('no http link found');
					}
					
				});
			});
			
			$(document).one('click', function() {
				$('#linkContextMenu').hide();
			});
		}
		
		$('br[clear]').hide();
		
		
		
		// init thickbox for this stuff
		// tb_init('a.thickbox, area.thickbox, input.thickbox', "#"+data.regionID);//pass where to apply thickbox
		// imgLoader = new Image();// preload image
		// imgLoader.src = tb_pathToImage;
		
	}
}


Spaz.UI.keyboardHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	if (el.name) {
		return true;
	}

	// 'ENTER' if (e.which == 13 && e.shiftKey == true && e.srcElement.id == 'entrybox') {
	if (e.which == 13 && e.srcElement.id == 'entrybox') {
		Spaz.UI.sendUpdate();
		return false;
	}
	
	// 'r' reload the current tab
	if (e.which == 82 && e.srcElement.id == 'home') {
		Spaz.UI.reloadCurrentTab();
		Spaz.restartReloadTimer();
		return false;
	}

	// 'l' show shorten link dialog
	if (e.which == 76 && e.srcElement.id == 'home') {
		Spaz.UI.showShortLink();
		return false;
	}
	
	// '@' reply to selected user
	if (e.which == 50 && e.shiftKey && e.srcElement.id == 'home') {
		// get the current selection username
		// Spaz.dump('getting current selection');
		Spaz.dump('getting screenname from current selection');
		var screenname = $('div.ui-selected .user-screen-name').text();
		
		Spaz.dump('username for reply is:'+screenname);
//		var username = '';
		Spaz.UI.prepReply(screenname);
		return false;
	}

	// '1-9' Numbers for tabs
	if ( (e.which >= 49 && e.which <= 56) && !e.shiftKey && e.srcElement.id == 'home') {
		var panelId = e.which-49;
		Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[panelId]);
		Spaz.UI.tabbedPanels.showPanel(panelId);
		return false;
	}

	
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
	
	// Spaz.Bridge.trace(e.name);
	// Spaz.Bridge.trace(el.id);
};

Spaz.UI.blurHandler = function(event) {
	e = event || window.event;
	el = e.srcElement || e.target;
	
	// Spaz.Bridge.trace(e.name);
	// Spaz.Bridge.trace(el.id);
};

//	$('#tab-friends .timeline-pager-number').html(4);