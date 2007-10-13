var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

Spaz.UI.currentTheme = '';
Spaz.UI.userStyleSheet = '';
Spaz.UI.themeDir = '';

Spaz.UI.tabbedPanels = {};

Spaz.UI.entryBox = {};

Spaz.UI.playSounds = 1; // default state

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
	$('#statusbar').Pulsate(400, 2);
}

Spaz.UI.showLoading = function() {
	//$('#loading').show();
	$('#loading').DropInLeft(500);
}

Spaz.UI.hideLoading = function() {
	//$('#loading').hide();
	$('#loading').DropOutLeft(500);
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


Spaz.UI.showAbout = function() {
	Spaz.UI.centerPopup('aboutWindow');
	Spaz.UI.hideHelp();
	Spaz.dump('showing aboutWindow...');
	$('#aboutWindow').fadeTo('fast', 1.0, function() {
		Spaz.dump('fadeIn:'+'faded in!');
		Spaz.dump('fadeIn:'+$('#aboutWindow').css('display'));
		Spaz.dump('fadeIn:'+$('#aboutWindow').css('opacity'));
	});
	var info = Spaz.Bridge.getRuntimeInfo();
	$('#sysinfo-os').text(info.os);
	$('#sysinfo-totalMemory').text(info.totalMemory+"");
}
Spaz.UI.updateMemoryUsage = function() {
	var info = Spaz.Bridge.getRuntimeInfo();
	Spaz.dump('NEW Memory Usage: ' + info.totalMemory);
	$('#sysinfo-totalMemory').text(info.totalMemory+"");
}
Spaz.UI.hideAbout = function() {
	Spaz.dump('hiding aboutWindow...');
	$('#aboutWindow').fadeTo('fast', 0, function(){
		Spaz.dump('fadeOut:'+'faded out!');
		Spaz.dump('fadeOut:'+$('#aboutWindow').css('display'));
		Spaz.dump('fadeOut:'+$('#aboutWindow').css('opacity'));
		$('#aboutWindow').hide();
	});
}
Spaz.UI.showHelp = function() {
	Spaz.UI.centerPopup('helpWindow');
	Spaz.UI.hideAbout();
	Spaz.dump('showing helpWindow...');
	$('#helpWindow').fadeTo('fast', 1.0, function() {
		Spaz.dump('fadeIn:'+'faded in!');
		Spaz.dump('fadeIn:'+$('#helpWindow').css('display'));
		Spaz.dump('fadeIn:'+$('#helpWindow').css('opacity'));
	});
}
Spaz.UI.hideHelp = function() {
	Spaz.dump('hiding helpWindow...');
	$('#helpWindow').fadeTo('fast', 0, function(){
		Spaz.dump('fadeOut:'+'faded out!');
		Spaz.dump('fadeOut:'+$('#helpWindow').css('display'));
		Spaz.dump('fadeOut:'+$('#helpWindow').css('opacity'));
		$('#helpWindow').hide();
	});
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

Spaz.UI.showPopup = function(contentid) {
	if (!Spaz.UI.popupPanel) {
		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
	}
	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
}

Spaz.UI.showWhatsNew = function() {
	Spaz.UI.popupPanel.loadContent('whatsnew.html');
}


// taken from ThickBox 
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
	var jqWin  		= $('#'+windowid);
	var jqBody 		= $('body');
	var pageHeight 	= jqBody.height();
	var pageWidth  	= jqBody.width();
	var winHeight  	= jqWin.height();
	var winWidth   	= jqWin.width();

	jqWin.css('margin', 0);	
	jqWin.css('top',  (pageHeight/2)-(winHeight/2));
	jqWin.css('left', (pageWidth/2)-(winWidth/2));

	Spaz.dump("pageHeight:"+pageHeight);
	Spaz.dump("pageWidth :"+pageWidth );
	Spaz.dump("winHeight :"+winHeight );
	Spaz.dump("winWidth  :"+winWidth  );
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
	eb.focus();
	eb.val('@'+username+': ...');
	eb[0].setSelectionRange(eb.val().length-3, eb.val().length)
};



//	$('#tab-friends .timeline-pager-number').html(4);