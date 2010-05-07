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
		sch.debug("service is "+ thisA.service);
		sch.debug("service url "+ thisA.service_url);

		var sharepass = Spaz.Prefs.get('services-twitpic-sharepassword');
		sch.debug("sharepass is "+ sharepass);
		
		/*
			populate the dropdown
		*/
		var labels = this.SFU.getAPILabels();

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
		$('#imageupload-file-uploader').bind('change', function() {
		    alert('changed');
			thisA.service = $('#imageupload-file-uploader').val();
			Spaz.Prefs.set('file-uploader', thisA.service);
			
			thisA.service_url = thisA.SFU.apis[thisA.service].upload_url;
			sch.debug("service is "+ thisA.service);
			sch.debug("service url "+ thisA.service_url);
			
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
			// sch.debug("service is "+ service);
			// Spaz.Upload[service]($('#shorten-original-link').val());
		});
		
		
		$('#imageupload-post-message').keyup(function(e) {
			if ($('#imageupload-post-message').val().length>110) {
				$('#imageupload-post-message').val( $('#imageupload-post-message').val().substr(0,110) );
			}
			sch.debug($('#imageupload-post-message').val().length);
		});
				
		// sch.debug(air.NativeApplication.nativeApplication.spazPrefs);
	};




	this.browseForImage = function() {
		var imageFilter = new air.FileFilter("Images", "*.jpg;*.jpeg;*.gif;*.png");
		var userFile = new air.File();
		userFile.browseForOpen("Choose an image file", [imageFilter]);

		userFile.addEventListener(air.Event.SELECT, function(event) {

			sch.debug('Chosen file: '+event.target.url);

			if (!Spaz.Prefs.get('services-twitpic-sharepassword') ) {
				if ( !confirm('Uploading requires that you share your Twitter username and password with the service. Are you sure you want to do this?') ) {
					return false;
				}
			}

			if (event.target.url.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
				alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
				return false;
			}
			thisA.handleDrop(event.target.url);
			return true;
		});
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

		sch.debug(fileUrl);

		if (fileUrl.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
			alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
			return false;
		}
		thisA.handleDrop(fileUrl);
		return true;
	};

	/*
		Upload the dragged image to the service
	*/
	this.uploadDraggedImage = function(fileUrl) {
		sch.debug(fileUrl);

		Spaz.UI.showLoading();

		// upload the file
		Spaz.Data.uploadFile({
			'extra'  :{
				"username": Spaz.Prefs.getUsername(),
				"password": Spaz.Prefs.getPassword(),
				"source"  : Spaz.Prefs.get('twitter-source'),
				"message" : $('#imageupload-post-message').val()
			},
			'url'    :thisA.service_url,
			'fileUrl':fileUrl,
			'open'   : Spaz.UI.showLoading,
			'complete': function(event) {
				Spaz.UI.hideLoading();

				var loader = event.target;
			    sch.debug(loader.data);

				var parser=new DOMParser();
				xmldoc = parser.parseFromString(loader.data,"text/xml");

				//var mediaurl = $(xmldoc).find('mediaurl').text();
				//sch.debug(mediaurl);
				//prepPhotoPost(mediaurl);
				//$('#status-text').html('Complete');
				var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
				if (rspAttr.getNamedItem("stat").nodeValue == 'ok')
				{
					var mediaurl = $(xmldoc).find('mediaurl').text();
					sch.debug(mediaurl);
					thisA.prepPhotoPost(mediaurl);
					$('#imageupload-status-text').html('Complete');
					closePopbox();
				} 
				else
				{
					var errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
					sch.debug(errAttributes);
					errMsg = errAttributes.getNamedItem("msg").nodeValue;
					sch.debug(errMsg);
					$('#imageupload-status-text').html(errMsg);
				} 
			}
		});
	};
};

