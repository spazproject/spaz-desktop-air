var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Handlers
***********/
if (!Spaz.Handlers) Spaz.Handlers = {};






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




