var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Handlers
***********/
if (!Spaz.Handlers) Spaz.Handlers = {};

Spaz.Handlers.selectEntry = function(event) {
	var jqentry = event.data.jqentry;

	air.trace(event.target.tagName);
	
	air.trace('unselecting tweets');
	Spaz.dump('unselected tweets');
	$('div.timeline-entry').removeClass('ui-selected');
	
	Spaz.dump('selecting tweet');
	jqentry.addClass('ui-selected');

	var el = jqentry[0];	
	Spaz.dump('selected tweet #'+el.id+':'+el.tagName+'.'+el.className);
}


Spaz.Handlers.openInBrowser = function(event) {
	if (event.data) {
		url = event.data.url;
	}
	openInBrowser(url);
}


// event handler proxy
Spaz.Handlers.makeFavorite = function(event) {
	Spaz.Data.makeFavorite(event.data.entryid);
}

// event handler proxy
Spaz.Handlers.destroyStatus = function(event) {
	Spaz.Data.destroyStatus(event.data.entryid);
}

// event handler proxy
Spaz.Handlers.prepDirectMessage = function(event) {
	Spaz.UI.prepDirectMessage(event.data.username);
}

// event handler proxy
Spaz.Handlers.prepReply = function(event) {
	Spaz.UI.prepReply(event.data.username);
}




Spaz.Handlers.showUserTooltip = function(event) {
	air.trace('Event.data:'+event.data);
	var el = event.data.jq[0];
	var userdata = event.data.userdata;
	var data = userdata.split('|')
	var str = "<div><strong>"+data[0]+"</strong></div>";
	if(data[1]) {
		var str = str + "<div><em>"+data[1]+"</em></div>";
	}
	if(data[2]) {
		var str = str + "<div>"+data[2]+"</div>";
	}
	
	Spaz.UI.showTooltip(el, str);
};



Spaz.Handlers.showTitleTooltip = function(event) {
	Spaz.UI.showTooltip(event.target, $(event.target).attr('title'));
};



Spaz.Handlers.showTooltip = function(event) {
	var el = event.data.jq[0];
	var str = event.data.str;
	Spaz.UI.showTooltip(el, str);
};



Spaz.Handlers.showContextMenu = function(event) {
	
	var el = event.data.jq[0];
	var url = event.data.url;
	// hide any showing tooltips
	Spaz.dump('hiding tooltip');
	
	$('#tooltip').hide();
	
	// show the link context menu
	Spaz.dump('opening context menu');
	$('#linkContextMenu').css('left', event.pageX)
		.css('top',  event.pageY)
		.show();

	Spaz.dump('outerHTML:'+el.outerHTML);
	var urlarray = /http:\/\/([^'"]+)/i.exec(url);
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
	
}
