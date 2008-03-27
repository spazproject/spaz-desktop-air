var Spaz; if (!Spaz) Spaz = {};


if (!Spaz.Sys) Spaz.Sys = {};

Spaz.Sys.getClipboardText = function() {
	if(air.Clipboard.generalClipboard.hasFormat("text/plain")){
	    var text = air.Clipboard.generalClipboard.getData("text/plain");
		return text;
	} else {
		return '';
	}
}

Spaz.Sys.setClipboardText = function(text) {
	Spaz.dump('Copying "' + text + '" to clipboard');
	air.System.setClipboard(text);
}



/***********
Spaz.Bridge
************/
if (!Spaz.Bridge) Spaz.Bridge = {};

