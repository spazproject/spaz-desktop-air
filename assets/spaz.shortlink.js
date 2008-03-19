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
	
	Spaz.dump('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			Spaz.dump('Response-headers:');
			Spaz.dump(xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump('XHR Object:');
			Spaz.dump(xhr, 'dir');
			Spaz.dump("COMPLETE: " + rstr);
			Spaz.dump(xhr.responseText);
			air.Clipboard.generalClipboard.clear();
			air.Clipboard.generalClipboard.setData(xhr.responseText,air.ClipboardFormats.TEXT_FORMAT,false);
			$('#verification-result').text("URL shortened and copied to clipboard");
			$('#shorten-short-link').val(xhr.responseText);
			$('#shorten-short-link').focus();
			$('#shorten-short-link').select();
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			$('#verification-result').text('Error trying to shorten link');
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			// Spaz.dump(data);
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
	
	Spaz.dump('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr){
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			Spaz.dump('Response-headers:');
			Spaz.dump(xhr.getAllResponseHeaders(), 'dir');
			Spaz.dump('XHR Object:');
			Spaz.dump(xhr, 'dir');
			Spaz.dump("COMPLETE: " + rstr);
			Spaz.dump(xhr.responseText);
			air.Clipboard.generalClipboard.clear();
			var cliprs = air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,xhr.responseText);
			
			Spaz.dump(xhr.responseText + ' cliprs is '+cliprs);
			
			Spaz.dump("formats: " + air.Clipboard.generalClipboard.formats);
			Spaz.dump("getting data : " + air.Clipboard.generalClipboard.getData(air.ClipboardFormats.TEXT_FORMAT));
			
			$('#verification-result').text("URL shortened and copied to clipboard");
			$('#shorten-short-link').val(xhr.responseText);
			$('#shorten-short-link').focus();
			$('#shorten-short-link').select();
		},
		error:function(xhr, rstr){
			Spaz.dump("ERROR: " + rstr);
			$('#verification-result').text('Error trying to shorten link');
			if (xhr.readyState < 3) {
				Spaz.dump("ERROR: Timeout");
			}
			
		},
		success:function(data){
			// Spaz.dump(data);
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