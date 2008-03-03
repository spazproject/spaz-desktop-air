var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Handlers
***********/
if (!Spaz.Handlers) Spaz.Handlers = {};

Spaz.Handlers.selectEntry = function(event) {

	var jqentry = event.data.jqentry;

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
	// Spaz.dump('Event.data:'+event.data);
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
			Spaz.Sys.setClipboardText(event.data.url);
			Spaz.dump('Current Clipboard:'+Spaz.Sys.getClipboardText());
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



Spaz.Handlers.keyboardMove = function(dir, selector) {
	
	if (!selector) {
		selector = '';
	}
	
	Spaz.dump("selector is '" + selector+"'")
	
	var timelineid = 'timeline-friends';

	if (!dir) { dir = 'down' }
	
	if (dir == 'down') {
		var movefunc = 'nextAll';
		var wrapselc = 'first';
	} else if (dir == 'up') {
		dir = 'up'
		var movefunc = 'prevAll';
		var wrapselc = 'last';
	} else {
		return false;
	}
	
	// get current selected
	var jqsel = $('#'+timelineid+' div.ui-selected');
	// alert('selected:'+selected.length);
	//alert('moving:'+movefunc+'/'+wrapselc+"\n"+'selected:'+selected.length + "\n"+'current:'+selected.html());
	
	// if none selected, or there is no 'next', select first
	if (selector == ":first" || selector == ":last") {
		Spaz.dump('first in timeline')
		Spaz.Handlers.keyboardMoveSelect($('#'+timelineid+' div.timeline-entry'+selector), timelineid)
	} else if (jqsel.length == 0 ) {
		Spaz.dump('nothing is selected')
		Spaz.Handlers.keyboardMoveSelect($('#'+timelineid+' div.timeline-entry'+selector+':'+wrapselc), timelineid)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);
	} else if (jqsel[movefunc]('div.timeline-entry'+selector).eq(0).length == 0) {
		Spaz.dump('we are at the beginning or end')
		Spaz.Handlers.keyboardMoveSelect($('#'+timelineid+' div.timeline-entry'+selector+':'+wrapselc), timelineid)
		jqsel = $('#'+timelineid+' div.timeline-entry.ui-selected'+selector);				
	} else {
		Spaz.dump('something is now selected');
		Spaz.Handlers.keyboardMoveSelect(jqsel[movefunc]('div.timeline-entry'+selector).eq(0), timelineid);
	}
	// if selected is at bottom, go to top
}



Spaz.Handlers.keyboardMoveSelect = function(jqelement, timelineid) {	
	
	Spaz.dump('Moving to new selected item');
	
	Spaz.dump('jqelement.length:'+jqelement.length);
	
	// unselect everything
	$('#'+timelineid+' div.timeline-entry').removeClass('ui-selected');
	
	// select passed
	if (jqelement.length > 0) {
		jqelement.toggleClass('ui-selected');
		$('#'+timelineid+'').scrollTo(jqelement, {
								offset:-25,
								speed:90,
								easing:'swing'
								}
		);
	} else {
		Spaz.dump("Problem - jqelement passed length = 0 - can't scroll to anything");
	}
}
