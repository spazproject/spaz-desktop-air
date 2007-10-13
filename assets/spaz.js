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
		ifModified:false,
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