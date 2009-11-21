Spaz.ImageUploader = function() {
	
	var thisA = this;
	
	this.SFU = new SpazFileUploader();
	
	this.service_url = null;
	this.service = null;
	



	this.init = function() {
		
		var container = $('#imageUploadWindow');
		
		$('#imageupload-loading').hide();
		
		var target = $('.content', container).get(0);
		target.addEventListener("dragenter", thisA.dragEnterOverHandler);
		target.addEventListener("dragover", thisA.dragEnterOverHandler);
		target.addEventListener("drop", thisA.dropHandler);

		// get the pref
		thisA.service = Spaz.Prefs.get('file-uploader');
		thisA.service_url = thisA.SFU.apis[thisA.service].upload_url;
		sch.dump("service is "+ thisA.service);
		sch.dump("service url "+ thisA.service_url);

		var sharepass = Spaz.Prefs.get('services-twitpic-sharepassword');
		sch.dump("sharepass is "+ sharepass);
		
		/*
			populate the dropdown
		*/
		var labels = this.SFU.getAPILabels();
		sch.error(labels);
		for (var i=0; i < labels.length; i++) {
			var this_service = labels[i];
			if (this_service == thisA.service) {
				$('#imageupload-file-uploader').append('<option value="'+this_service+'" selected="selected">'+this_service+'</option>');
				$('#imageupload-extra-'+thisA.service).show();
			} else {
				$('#imageupload-file-uploader').append('<option value="'+this_service+'">'+this_service+'</option>');
				$('#imageupload-extra-'+thisA.service).hide();
			}			
		};
		
		/*
			bind click on droplet
		*/
		$('#imageupload-droplet').click(function() {
			thisA.browseForImage();
		});
		
		
		/*
			bind service dropdown
		*/
		$('#file-uploader').bind('change', function() {
			thisA.service = $('#imageupload-file-uploader').val()
			Spaz.Prefs.set('file-uploader', thisA.service);
			
			thisA.service_url = thisA.SFU.apis[thisA.service].upload_url;
			sch.dump("service is "+ thisA.service);
			sch.dump("service url "+ thisA.service_url);
			
			$('.service-extras', thisA.container).fadeOut();
			$('#imageupload-extra-'+thisA.service).fadeIn();
			
		});
		

		
		
		// bind click to shorten action
		$('#imageupload-button').bind('click', function() {
			var fileUrl = $('#imageupload-file-url').val();
			if (fileUrl) {
				thisA.uploadDraggedImage(fileUrl);
			} else {
				thisA.browseForImage();
			}
			
			// var service = Spaz.Prefs.get('file-uploader');
			// sch.dump("service is "+ service);
			// Spaz.Upload[service]($('#shorten-original-link').val());
		});
		
		
		$('#imageupload-post-message').keyup(function(e) {
			if ($('#imageupload-post-message').val().length>110) {
				$('#imageupload-post-message').val( $('#imageupload-post-message').val().substr(0,110) );
			}
			sch.dump($('#imageupload-post-message').val().length);
		})
				
		// sch.dump(air.NativeApplication.nativeApplication.spazPrefs);
	};




	this.browseForImage = function() {
		var imageFilter = new air.FileFilter("Images", "*.jpg;*.jpeg;*.gif;*.png");
		var userFile = new air.File();
		userFile.browseForOpen("Choose an image file", [imageFilter]);

		userFile.addEventListener(air.Event.SELECT, function(event) {

			sch.dump('Chosen file: '+event.target.url);

			if (!Spaz.Prefs.get('services-twitpic-sharepassword') ) {
				if ( !confirm('Uploading requires that you share your Twitter username and password with the service. Are you sure you want to do this?') ) {
					return false;
				}
			}

			if (event.target.url.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
				alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
				return;
			}
			thisA.handleDrop(event.target.url);
		})
	};


	/*
		Really a proxy for the Spaz.postPanel.prepPhotoPost method created in app initialization
	*/
	this.prepPhotoPost = function(url) {
	    if (url) {
	        var msg = $('#imageupload-post-message').val() + ' ' + url;
	
			Spaz.postPanel.prepPhotoPost(msg);
			
	        return true;
	    } else {
	        return false;
	    }
	};

	this.handleDrop = function(fileUrl) {
		$('#imageupload-droplet').html('<img src="'+fileUrl+'" />');
		$('#imageupload-droplet>img').css('width', $('#imageupload-droplet').width());
		$('#imageupload-droplet>img').css('height', $('#imageupload-droplet').height());
		$('#imageupload-file-url').val(fileUrl);
	};

	
	this.dragEnterOverHandler = function(event){
	    event.preventDefault();
	};

	this.dropHandler = function(event){

		event.preventDefault();

		if (!Spaz.Prefs.get('services-twitpic-sharepassword') ) {
			if ( !confirm('Uploading requires that you share your Twitter username and password with the service. Are you sure you want to do this?') ) {
				return false;
			}
		}

		var fileUrl = event.dataTransfer.getData("text/uri-list");

		sch.dump(fileUrl);

		if (fileUrl.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
			alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
			return;
		}
		thisA.handleDrop(fileUrl);
		return;
	};

	/*
		Upload the dragged image to the service
	*/
	this.uploadDraggedImage = function(fileUrl) {
		sch.dump(fileUrl);

		Spaz.UI.showLoading();

		// upload the file
		Spaz.Data.uploadFile({
			'extra'  :{
				"username": Spaz.Prefs.getUser(),
				"password": Spaz.Prefs.getPass(),
				"source"  : Spaz.Prefs.get('twitter-source'),
				"message" : $('#imageupload-post-message').val()
			},
			'url'    :thisA.service_url,
			'fileUrl':fileUrl,
			'open'   : Spaz.UI.showLoading,
			'complete': function(event) {
				Spaz.UI.hideLoading();

				var loader = event.target;
			    sch.dump(loader.data);

				var parser=new DOMParser();
				xmldoc = parser.parseFromString(loader.data,"text/xml");

				//var mediaurl = $(xmldoc).find('mediaurl').text();
				//sch.dump(mediaurl);
				//prepPhotoPost(mediaurl);
				//$('#status-text').html('Complete');
				var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
				if (rspAttr.getNamedItem("stat").nodeValue == 'ok')
				{
					var mediaurl = $(xmldoc).find('mediaurl').text();
					sch.dump(mediaurl);
					thisA.prepPhotoPost(mediaurl);
					$('#imageupload-status-text').html('Complete');
					closePopbox();
				} 
				else
				{
					var errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
					sch.dump(errAttributes);
					errMsg = errAttributes.getNamedItem("msg").nodeValue;
					sch.dump(errMsg);
					$('#imageupload-status-text').html(errMsg);
				} 
			}
		});
	};
}

