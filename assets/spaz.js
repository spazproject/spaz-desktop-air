var Spaz; if (!Spaz) Spaz = {};

Spaz.verified = false;

Spaz.sourceStr = "spaz";

/*
short vars for referring to particular tabs
*/
Spaz.PUBLIC_TL = 'public_timeline';
Spaz.FRIENDS_TL = 'friends_timeline';
Spaz.REPLIES_TL = 'replies_timeline';
Spaz.USER_TL = 'user_timeline';
Spaz.DM_TL = 'dm_timeline';
Spaz.ME_TL = 'user_timeline';
Spaz.FRIEND_LS = 'friend_list';
Spaz.FOLLOWER_LS = 'follower_list';

/*
Spaz
*/
$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true,
		cache:false
	}
);



Spaz.loadMainPage = function() {
	window.location.href='index.html';
};




Spaz.getUrlForTab = function(tab) {
	
}

Spaz.getPathForTab = function(tab) {
	
}

Spaz.getSubpathForTab = function(tab) {
	
}

Spaz.getRegionForTab = function(tab) {
	
}



Spaz.startReloadTimer = function() {
	var refreshInterval = Spaz.Bridge.getRefreshInterval();
	Spaz.dump('started timer with refresh of ' + refreshInterval + ' msecs');
	reloadID = window.setInterval(Spaz.UI.autoReloadCurrentTab, refreshInterval);
	
	return reloadID;
}


Spaz.stopReloadTimer = function() {
	if (reloadID) {
		window.clearInterval(reloadID);
		Spaz.dump('stopped timer');
	}
	
}

Spaz.restartReloadTimer = function() {
	Spaz.dump('trying to restart timer');
	Spaz.stopReloadTimer();
	Spaz.startReloadTimer();
}



Spaz.childFrameInit = function() {
	
	//*************************
	// START ME UP
	//*************************



	// insert theme CSS links
	var themePaths = Spaz.Bridge.getThemePaths();
	for(x in themePaths) {
		$('head').append('<link href="'+themePaths[x].themecss+'" title="'+themePaths[x].themename+'" rel="stylesheet" type="text/css" />');
	}


	// build the dropdown menu
	$('#prefs-base-theme').empty();

	/**
	* Styleswitch stylesheet switcher built on jQuery
	* Under an Attribution, Share Alike License
	* By Kelvin Luck ( http://www.kelvinluck.com/ )
	**/
	$('link[@rel*=style][@title]').each(function(i){
		var title = this.getAttribute('title');
		$('#prefs-base-theme').append('<option value="'+title+'">'+title+'</option>');
		Spaz.dump("css:"+this.title);
	});

	if (Spaz.UI.currentTheme) {
		$('#prefs-base-theme').val(Spaz.UI.currentTheme);
	}
	Spaz.UI.setCurrentTheme();
	
	





	/*************************** 
	 * Apply prefs 
	 **************************/	 
	$('#prefs-username').val(Spaz.Bridge.getUser());
	$('#prefs-password').val(Spaz.Bridge.getPass());
	$('#prefs-refresh-interval').val(Spaz.Bridge.getRefreshInterval()/60000);


	// User Stylesheet
	if (Spaz.UI.userStyleSheet) {
		Spaz.UI.setUserStyleSheet(Spaz.UI.userStyleSheet);
		$('#prefs-user-stylesheet').val(Spaz.UI.userStyleSheet);
	}

	// Markdown
	if (Spaz.UI.useMarkdown) {
		Spaz.UI.markdownOn();
		$('#prefs-markdown-enabled').attr('checked', 'checked');
	} else {
		Spaz.UI.markdownOff();
		$('#prefs-markdown-enabled').attr('checked', '');
	}

	// Sounds
	if (Spaz.UI.playSounds) {
		Spaz.UI.soundOn();
		$('#prefs-sound-enabled').attr('checked', 'checked');
	} else {
		Spaz.UI.soundOff();
		$('#prefs-sound-enabled').attr('checked', '');
	}


	//DONE: Check for Update
	if (Spaz.Update.checkUpdate()) {
	//	Spaz.Update.setCheckUpdateState(true);
		$('#prefs-checkupdate-enabled').attr('checked', 'checked');
		Spaz.dump('Starting check for update');
		Spaz.Bridge.checkForUpdate();
		Spaz.dump('Ending check for update');
	} else {
	//	Spaz.Update.setCheckUpdateState(false);
		$('#prefs-checkupdate-enabled').attr('checked', '');
	}
	Spaz.dump('Prefs Apply: check for update')

	if ($('html').attr('debug') == 'true') {
		$('#prefs-debugging-enabled').attr('checked', 'checked');
	}else{
		$('#prefs-debugging-enabled').attr('checked', '');
	}
	Spaz.dump('Prefs Apply: debugging');
	
	

	/************************
	 * Other stuff to do when document is ready
	 ***********************/
	//memoryRefreshID = window.setInterval(Spaz.UI.updateMemoryUsage, 5000);
	Spaz.dump('Started MemoryUsage timer');

	
	Spry.Data.Region.addObserver("public-timeline",			Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("friends-timeline",		Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("replies-timeline",		Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("user-timeline",			Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("dm-timeline",				Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("friendslist-detail",		Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("friendslist",				Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("followerslist-detail",	Spaz.UI.regionObserver);
	Spry.Data.Region.addObserver("followerslist",			Spaz.UI.regionObserver);
	Spaz.dump('Added region observers');

	
	Spaz.UI.playSoundStartup(Spaz.Bridge.makeWindowVisible);
	Spaz.dump('Added region observers');
	
	Spaz.Bridge.makeWindowVisible();

	$('#about-version').text("v"+Spaz.Bridge.getVersion());


	Spaz.UI.tabbedPanels = new Spry.Widget.TabbedPanels("tabs");


	Spaz.UI.entryBox = new Spry.Widget.ValidationTextarea("entrybox",
		{ maxChars:140,
		counterType:"chars_remaining",
		counterId:'chars-left',
		hint:entryBoxHint,
		useCharacterMasking:true }
	);

	Spaz.UI.prefsCPG = new Spry.Widget.CollapsiblePanelGroup("prefsCPG",
		{ contentIsOpen:false, duration:200 }
	);
	// var AccountPanel = Spaz.UI.prefsCPG.openPanel(0);

	// Make Draggables
	$('div.popupWindow').each(function(i){
		$('#'+this.id).draggable({
			handle: 	$('#'+this.id+' popupWindowBar')[0],
			containment:'#container',
			opacity: 	0.7,
		});
	});
	
	

	// make tweets selectable
	// $('div.timeline-entry').bind('click', function(event){
	// 	$('#'+event.target.id).toggleClass('ui-selected');
	// });	
	// $('#friends-timeline').selectable({
	// 	filter:'div.timeline-entry'
	// });


	$('img.tab-icon').each( function(i) {
		this.title = this.title + '<br />Shortcut: <strong>'+(parseInt(i)+1)+'</strong>';
	});
	Spaz.dump('Set shortcut info in tab titles');

	$('*[@title]').Tooltip(toolTipPrefs);
	Spaz.dump('Added tooltips');

	if ($('html').attr('debug') == 'true') {
		console.open();
		Spaz.dump('debug console opened');
	}

	Spaz.UI.setSelectedTab(document.getElementById('tab-friends'));
	Spaz.dump('set selected tab');

//	$('#header').contextMenu('linkContentMenu');

	Spaz.dump('ended document.ready()');
	
}


/*
makes relative time out of "Sun Jul 08 19:01:12 +0000 2007" type string
Borrowed from Mike Demers (slightly altered)
https://twitter.pbwiki.com/RelativeTimeScripts
*/
function get_relative_time(time_value) {
	var parsed_date = new Date;
	parsed_date.setTime(Date.parse(time_value));
	var now = new Date;
	var delta = parseInt( (now.getTime() - parsed_date.getTime()) / 1000);

	if(delta < 60) {
		return 'less than a minute ago';
	} else if(delta < 120) {
		return 'about a minute ago';
	} else if(delta < (45*60)) {
		return (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (90*60)) {
		return 'about an hour ago';
	} else if(delta < (24*60*60)) {
		if (parseInt(delta / 3600) == 1) {
			return 'about 2 hours ago';
		} else {
			return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
		}
	} else if(delta < (48*60*60)) {
		return '1 day ago';
	} else {
		return (parseInt(delta / 86400)).toString() + ' days ago';
	}
}

//DONE: we should allow this call through bridge
function openInBrowser(url) {
	Spaz.dump('opening '+url);
	Spaz.Bridge.navigateToURL(url);
}


/*TODO: UNUSED FUNCTIONS

// Configure listeners for URLLoaders 
function configureURLLoaderListeners(dispatcher)  {
	dispatcher.addEventListener(air.Event.COMPLETE, completeHandler);
	dispatcher.addEventListener(air.Event.OPEN, openHandler);
	dispatcher.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
	dispatcher.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
	dispatcher.addEventListener(air.HTTPStatusEvent.HTTP_STATUS, httpStatusHandler);
	dispatcher.addEventListener(air.IOErrorEvent.IO_ERROR, ioErrorHandler);	
}



// Event listeners for URLLoader 
function completeHandler(event) {
   var loader = air.URLLoader(event.target);
   Spaz.dump("completeHandler: " + loader.data);
}

function openHandler(event) {
   Spaz.dump("openHandler: " + event);
}

function progressHandler(event) {
   Spaz.dump("progressHandler loaded:" + event.bytesLoaded + " total: " + event.bytesTotal);
}

function securityErrorHandler(event) {
   Spaz.dump("securityErrorHandler: " + event);
}

function httpStatusHandler(event) {
   Spaz.dump("httpStatusHandler: status=" + event.status + "; " + event);
}

function ioErrorHandler(event) {
   Spaz.dump("ioErrorHandler: " + event);
}
*/


function createXMLFromString (string) {
  var xmlParser, xmlDocument;
  try {
    xmlParser = new DOMParser();
    xmlDocument = xmlParser.parseFromString(string, 'text/xml');
    return xmlDocument;
  }
  catch (e) {
    output("Can't create XML document.");
    return null;
  }
}



// Return a boolean value telling whether
// the first argument is a string. 
function isString() {
	if (typeof arguments[0] == 'string') return true;
	if (typeof arguments[0] == 'object') {
		var criterion = arguments[0].constructor.toString().match(/string/i);
		return (criterion != null);
	}
	return false;
}

// http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C720080D723
function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}