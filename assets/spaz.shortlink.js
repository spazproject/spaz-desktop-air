var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Data
*************/
if (!Spaz.Shortlink) Spaz.Shortlink = {};

$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true
		// cache:false
	}
);

Spaz.Shortlink.urltea = function(url) {
	var origlink = encodeURI(url);
	
	// air.trace('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			// air.trace('Response-headers:');
			// air.trace(xhr.getAllResponseHeaders());
			// air.trace('XHR Object:');
			// air.trace(xhr);
			// air.trace("COMPLETE: " + rstr);
			// air.trace(xhr.responseText);
			var shorturl = trim(xhr.responseText);
			alert(shorturl);
			air.Clipboard.generalClipboard.clear();
			air.Clipboard.generalClipboard.setData(shorturl,air.ClipboardFormats.TEXT_FORMAT,false);
			$('#verification-result').text("URL shortened and copied to clipboard");
			$('#shorten-short-link').val(shorturl);
			$('#shorten-short-link').focus();
			$('#shorten-short-link').select();
		},
		error:function(xhr, rstr){
			// air.trace("ERROR: " + rstr);
			$('#verification-result').text('Error trying to shorten link');
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
			}
			
		},
		success:function(data){
			// air.trace(data);
			// Spaz.UI.statusBar("Shortened URL");
			// $('#shorten-short-link').val(data);
		},
		beforeSend:function(xhr){},
		processData:false,
		type:"GET",
		url:'http://urltea.com/api/text/',
		data:"&url="+origlink
	});
};



Spaz.Shortlink.snurl = function(url) {
	var origlink = encodeURI(url);
	
	// air.trace('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			// air.trace('Response-headers:');
			// air.trace(xhr.getAllResponseHeaders());
			// air.trace('XHR Object:');
			// air.trace(xhr);
			// air.trace("COMPLETE: " + rstr);
			// air.trace(xhr.responseText);
			
			var shorturl = trim(xhr.responseText);
			
			air.Clipboard.generalClipboard.clear();
			air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,shorturl,false);
			$('#verification-result').text("URL shortened and copied to clipboard");
			$('#shorten-short-link').val(shorturl);
			$('#shorten-short-link').focus();
			$('#shorten-short-link').select();
			
		},
		error:function(xhr, rstr){
			// air.trace("ERROR: " + rstr);
			$('#verification-result').text('Error trying to shorten link');
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
			}
			
		},
		success:function(data){
			// air.trace(data);
			// Spaz.UI.statusBar("Shortened URL");
			// $('#shorten-short-link').val(data);
		},
		beforeSend:function(xhr){},
		processData:false,
		type:"GET",
		url:'http://snipr.com/site/snip',
		data:"&r=simple&link="+origlink
	});
};