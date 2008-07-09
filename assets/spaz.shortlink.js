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


Spaz.Shortlink.$copyToClipboard = function(shorturl) {
	// alert(shorturl);
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,shorturl,false);
	$('#verification-result').text("URL shortened and copied to clipboard");
	$('#shorten-short-link').val(shorturl);
	$('#shorten-short-link').focus();
	$('#shorten-short-link').select();
};



Spaz.Shortlink.bitly = function(url) {
	var origlink = encodeURI(url);
	
	// air.trace('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr) {
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			
			var shorturl = trim(xhr.responseText);
			
			if (shorturl.search(/^http/i)!=-1) {
				Spaz.Shortlink.$copyToClipboard(shorturl)
			} else {
				$('#verification-result').text("Service returned an error: '"+shorturl+"'");
			}
			
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
		url:'http://bit.ly/api',
		data:"url="+origlink,
	});
};


Spaz.Shortlink.xrlus = function(url) {
	var origlink = encodeURI(url);
	
	// air.trace('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr) {
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			
			var shorturl = trim(xhr.responseText);
			
			if (shorturl.search(/^http/i)!=-1) {
				Spaz.Shortlink.$copyToClipboard(shorturl)
			} else {
				$('#verification-result').text("Service returned an error: '"+shorturl+"'");
			}
			
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
		url:'http://metamark.net/api/rest/simple',
		data:"long_url="+origlink,
	});
};


// Spaz.Shortlink.urlie = function(url) {
// 	var origlink = encodeURI(url);
// 	
// 	// air.trace('OrigLink:'+origlink);
// 	
// 	$('#verification-result').text('Shortening URL...');
// 	
// 	var xhr = $.ajax({
// 		complete:function(xhr, rstr){
// 			if (xhr.readyState < 3) {
// 				// air.trace("ERROR: Timeout");
// 				$('#verification-result').text('ERROR: Timeout');
// 				return;
// 			}
// 			var shorturl = trim(xhr.responseText);
// 			
// 			if (shorturl.search(/^http/i)!=-1) {
// 				Spaz.Shortlink.$copyToClipboard(shorturl)
// 			} else {
// 				$('#verification-result').text("Service returned an error: '"+shorturl+"'");
// 			}	
// 			
// 		},
// 		error:function(xhr, rstr){
// 			// air.trace("ERROR: " + rstr);
// 			$('#verification-result').text('Error trying to shorten link');
// 			if (xhr.readyState < 3) {
// 				// air.trace("ERROR: Timeout");
// 			}
// 			
// 		},
// 		success:function(data){
// 			// air.trace(data);
// 			// Spaz.UI.statusBar("Shortened URL");
// 			// $('#shorten-short-link').val(data);
// 		},
// 		beforeSend:function(xhr){},
// 		processData:false,
// 		type:"GET",
// 		url:'http://url.ie/',
// 		data:"&save=y&ver=12&url="+origlink+"&tighturlaction=Truncate%21",
// 	});
// };



Spaz.Shortlink.snipr = function(url) {
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
			
			if (shorturl.search(/^http/i)!=-1) {
				Spaz.Shortlink.$copyToClipboard(shorturl)
			} else {
				$('#verification-result').text("Service returned an error: '"+shorturl+"'");
			}

			
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




Spaz.Shortlink.isgd = function(url) {
	var origlink = encodeURI(url);
	
	// air.trace('OrigLink:'+origlink);
	
	$('#verification-result').text('Shortening URL...');
	
	var xhr = $.ajax({
		complete:function(xhr, rstr) {
			if (xhr.readyState < 3) {
				// air.trace("ERROR: Timeout");
				$('#verification-result').text('ERROR: Timeout');
				return;
			}
			
			var shorturl = trim(xhr.responseText);
			
			if (shorturl.search(/^http/i)!=-1) {
				Spaz.Shortlink.$copyToClipboard(shorturl)
			} else {
				$('#verification-result').text("Service returned an error: '"+shorturl+"'");
			}
			
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
		url:'http://is.gd/api.php',
		data:"longurl="+origlink,
	});
};