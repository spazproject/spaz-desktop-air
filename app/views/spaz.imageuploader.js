Spaz.ImageUploader = function() {
	
	var that = this;
	
	this.SIU = new SpazImageUploader();
	
	this.init = function() {
		
		var container = jQuery('#imageUploadWindow');
		
		jQuery('#imageupload-loading').hide();
		
		var target = jQuery('.content', container).get(0);
		target.addEventListener("dragenter", that.dragEnterOverHandler);
		target.addEventListener("dragover", that.dragEnterOverHandler);
		target.addEventListener("drop", that.dropHandler);

		// get the pref
		var sharepass = Spaz.Prefs.get('services-twitpic-sharepassword');
		sch.debug("sharepass is "+ sharepass);
		
		/*
			populate the dropdown
		*/
		var labels = this.SIU.getServiceLabels();

		for (var i=0; i < labels.length; i++) {
			var this_service = labels[i];
			jQuery('#imageupload-file-uploader').append('<option value="'+this_service+'">'+this_service+'</option>');
		};
		// set dropdown value
		jQuery('#imageupload-file-uploader').val(Spaz.Prefs.get('file-uploader'));
		
		
		/*
			bind click on droplet
		*/
		jQuery('#imageupload-droplet').click(function() {
			that.browseForImage();
		});
		
		
		/*
			bind service dropdown
		*/
		jQuery('#imageupload-file-uploader').bind('change', function() {
			Spaz.Prefs.set('file-uploader', jQuery('#imageupload-file-uploader').val());
		});
		

		// bind click to upload
		jQuery('#imageupload-button').bind('click', function() {
			var fileUrl = jQuery('#imageupload-file-url').val();
			if (fileUrl) {
				that.uploadDraggedImage(fileUrl);
			} else {
				that.browseForImage();
			}
		});
		
		
		jQuery('#imageupload-post-message').keyup(function(e) {
			if (jQuery('#imageupload-post-message').val().length>110) {
				jQuery('#imageupload-post-message').val( jQuery('#imageupload-post-message').val().substr(0,110) );
			}
			sch.debug(jQuery('#imageupload-post-message').val().length);
		});
				
		// sch.debug(air.NativeApplication.nativeApplication.spazPrefs);
	};



	/*
		Browse for the image!
	*/
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
			that.displayChosenFile(event.target.url);
			return true;
		});
	};


	/*
		Really a proxy for the Spaz.postPanel.prepPhotoPost method created in app initialization
	*/
	this.prepPhotoPost = function(url) {
	    if (url) {
			Spaz.postPanel.prepPhotoPost(url);			
	        return true;
	    } else {
	        return false;
	    }
	};

	/*
		handle dropped file
	*/
	this.displayChosenFile = function(fileUrl) {
		jQuery('#imageupload-droplet').html('<img src="'+fileUrl+'" />');
		jQuery('#imageupload-droplet>img').css('width', jQuery('#imageupload-droplet').width());
		jQuery('#imageupload-droplet>img').css('height', jQuery('#imageupload-droplet').height());
		jQuery('#imageupload-file-url').val(fileUrl);
	};

	/*
		prevent default happening
	*/
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
		that.displayChosenFile(fileUrl);
		return true;
	};

	/*
		Upload the dragged image to the service
	*/
	this.uploadDraggedImage = function(fileUrl) {
		var service = Spaz.Prefs.get('file-uploader');
		
		if (this.SIU.getServiceLabels().indexOf(service) === -1 ) {
			Spaz.Prefs.set('file-uploader', this.SIU.getServiceLabels()[0]);
		}
		
		var auth = Spaz.Prefs.getAuthObject();
		var image_uploader = new SpazImageUploader();
		
		jQuery('#imageupload-loading').show();
		jQuery('#imageupload-status-text').show().text('Uploading…');
		
		image_uploader_opts = {
			'auth_obj': auth,
			'service' : Spaz.Prefs.get('file-uploader') || 'drippic',
			'file_url': fileUrl,
			'onSuccess':function(event_data) { // onSuccess
				jQuery('#imageupload-loading').hide();
				if (event_data.url) {
					that.prepPhotoPost(event_data.url);
					jQuery('#imageupload-status-text').html($L('Complete'));
					Spaz.UI.closePopbox();
				} else if (event_data.error) {
					jQuery('#imageupload-status-text').html($L("Posting image failed:") + " " + event_data.error);
				} else {
					jQuery('#imageupload-status-text').html($L("Posting image failed"));
				}
			},
			'onFailure':function(event_obj) { // onFailure
				sch.error('Posting image FAILED');
				ech.error("Error!");
				ech.error(event_obj);
				jQuery('#imageupload-loading').hide();
				jQuery('#imageupload-status-text').html($L("Posting image failed"));
			}
		};
		
		// force pikchur uploading if using identi.ca
		if (Spaz.Prefs.getAccountType() == SPAZCORE_ACCOUNT_IDENTICA) {
			image_uploader_opts['service'] = 'pikchur';
			image_uploader_opts['extra']['service'] = 'identi.ca';
		}
		
		image_uploader.setOpts(image_uploader_opts);
		image_uploader.upload();
		
	};
};

