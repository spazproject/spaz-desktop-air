var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Handlers
***********/
if (!Spaz.Handlers) Spaz.Handlers = {};




/*
	This isn't used atm
*/
Spaz.Handlers.showContextMenu = function(event) {
	
	var el = event.data.jq[0];
	var url = event.data.url;
	// hide any showing tooltips
	sch.debug('hiding tooltip');
	
	$('#tooltip').hide();
	
	// show the link context menu
	sch.debug('opening context menu');
	$('#linkContextMenu').css('left', event.pageX)
		.css('top',  event.pageY)
		.show();

	sch.debug('outerHTML:'+el.outerHTML);
	var urlarray = /http:\/\/([^'"]+)/i.exec(url);
	if (urlarray && urlarray.length > 0) {
		var elurl = urlarray[0];
	
		sch.debug('url from element:'+elurl);
	
		$('#menu-copyLink').one('click', {url:elurl}, function(event) {
			Spaz.Sys.setClipboardText(event.data.url);
			sch.debug('Current Clipboard:'+Spaz.Sys.getClipboardText());
		});
		sch.debug('Set one-time click event on #menu-copyLink');
	
		$(document).one('click', function() {
			$('#linkContextMenu').hide();
		});
		sch.debug('set one-time link context menu close event for click on document');
	} else {
		sch.debug('no http link found');
	}
	
}




