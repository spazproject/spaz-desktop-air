var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Intercept
************/
if (!Spaz.Intercept) Spaz.Intercept = {};

// ***************************************************************
// Event delegation handling
// ***************************************************************
Spaz.Intercept.init = function() {

	$('body').intercept('mouseover', {
			'.user-screen-name[title]':function(e) {
				var tt = new Spaz_Tooltip({
					'e'		:e,
					'el'	:this,
					'str'	:$(this).attr('title'),
					// 'previewurl':href,
				});
				tt.show();

				// Spaz.UI.showTooltip(this, $(this).attr('title'));
			},
			'.user-image[title]':function(e) {
				var tt = new Spaz_Tooltip({
					'e'		:e,
					'el'	:this,
					'str'	:$(this).attr('title'),
					// 'previewurl':href,
				});
				tt.show();


				// Spaz.UI.showTooltip(this, $(this).attr('title'));
			},
			'a.inline-link':function(e) {
				var href = $(this).attr('href');
				// Spaz.UI.showTooltip(this, "Open "+href+" in a browser window", href);
				var tt = new Spaz_Tooltip({
					'e'		:e,
					'el'	:this,
					'str'	:"Open "+href+" in a browser window",
					'previewurl':href,
				});
				tt.show();
				
				// Spaz.UI.showTooltip(this, "Open "+href+" in a browser window", href);
			},
			'a .highlight':function(e) {
				if ($(this).parents('a').attr('href')) {
					var href = $(this).parents('a').attr('href');
					var tt = new Spaz_Tooltip({
						'e'		:e,
						'el'	:this,
						'str'	:"Open "+href+" in a browser window",
						'previewurl':href,
					});
					tt.show();
					// Spaz.UI.showTooltip(this, "Open "+href+" in a browser window", href);
				}
			},
			'a[title]':function(e) {
				var tt = new Spaz_Tooltip({
					'e'		:e,
					'el'	:this,
					'str'	:$(this).attr('title'),
					'previewurl':$(this).attr('href'),
				});
				tt.show();
				
				// Spaz.UI.showTooltip(this, $(this).attr('title'), $(this).attr('href'));

			},
			'a[user-screen_name]':function(e) {
				var tt = new Spaz_Tooltip({
					'e'		:e,
					'el'	:this,
					'str'	:$(this).attr('title'),
					'previewurl':$(this).attr('href'),
				});
				tt.show();
			},
		})
	
		.intercept('mouseout', {
			'[title]':function(e) {
				Spaz.UI.hideTooltips();
			}
		})
	
		.intercept('click', {
			'#friendslist-showfriends':function(e) {
				$('#timeline-followers').fadeOut();
				$('#timeline-friendslist').fadeIn();
			},
			'#friendslist-showfollowers':function(e) {
				$('#timeline-friendslist').fadeOut();
				$('#timeline-followers').fadeIn();
			},
			'#search-go':function(e) {
				Spaz.Section.search.build();
			},
			'#search-help':function(e) {
				openInBrowser('http://summize.com/operators');
			},
			'#mainMenu-help':function(e) {
				Spaz.UI.showHelp();
			},
			'#mainMenu-prefs':function(e) {
				Spaz.UI.showPrefs();
			},
			'#mainMenu-about':function(e) {
				Spaz.UI.showAbout();
			},
			'#mainMenu-view-toggle':function(e) {
				Spaz.UI.toggleTimelineFilter();
			},
			'#mainMenu-view-reloadCurrentView':function(e) {
				Spaz.UI.reloadCurrentTab(true);
				Spaz.restartReloadTimer();
			},
			'#mainMenu-view-markAsReadCurrentView':function(e) {
				Spaz.UI.markCurrentTimelineAsRead();
			},
			'#mainMenu-view-clearReloadCurrentView':function(e) {
				Spaz.UI.clearCurrentTimeline();
				Spaz.UI.reloadCurrentTab(true);
				Spaz.restartReloadTimer();
			},
			'#mainMenu-sendDM':function(e) {
				Spaz.UI.prepDirectMessage('');
			},
			'#mainmenu-shortenLink':function(e) {
				Spaz.UI.showShortLink();
			},
			'#mainMenu-sendReply':function(e) {
				Spaz.UI.prepReply('');
			},
			'#mainMenu-followSpaz':function(e) {
				Spaz.Data.followUser('spaz');
			},
			
			
			// prefs buttons handlers
			'#prefs-autosetrefresh-button':function(e) {
				Spaz.Data.getRateLimitInfo( Spaz.Prefs.setRateLimit );
			},
			
			
			// user context menu handlers
			'#userContextMenu-viewProfile':function(e) {
				Spaz.Sys.openInBrowser('http://twitter.com/'+$(this).attr('user-screen_name'))
			},
			'#userContextMenu-follow':function(e) {
				Spaz.Data.followUser($(this).attr('user-screen_name'));
			},
			'#userContextMenu-unfollow':function(e) {
				Spaz.Data.stopFollowingUser($(this).attr('user-screen_name'));
			},
			'#userContextMenu-sendReply':function(e) {
				Spaz.UI.prepReply($(this).attr('user-screen_name'));
			},
			'#userContextMenu-sendDM':function(e) {
				Spaz.UI.prepDirectMessage($(this).attr('user-screen_name'));
			},
			
			
			'a[href]':function(e) {
				var url = $(this).attr('href');
				openInBrowser(url);
				return false;
			},
			'.user-screen-name':function(e) {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.user-image':function(e) {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.status-action-fav':function(e) {
				Spaz.Data.makeFavorite($(this).attr('entry-id'))
			},
			'.status-action-dm':function(e) {
				Spaz.UI.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'.status-action-reply':function(e) {
				Spaz.UI.prepReply($(this).attr('user-screen_name'));
			},
			'.status-action-del':function(e) {
				Spaz.Data.destroyStatus($(this).attr('entry-id'))
			},
			'.directory-action-follow':function(e) {
				Spaz.Data.followUser($(this).attr('user-screen_name'));
			},
			'.directory-action-unfollow':function(e) {
				Spaz.Data.stopFollowingUser($(this).attr('user-screen_name'));
			},
			'.directory-user-location': function(e) {
				Spaz.UI.showLocationOnMap($(this).text());
			},
			'.timeline-entry':function(e) {
				Spaz.UI.selectEntry(this);
			},
			'.timeline-entry *':function(e) { // this one needs to be last so the more specific ones above take precedence
				// $('div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
				var entry = $(this).parents('.timeline-entry');
				Spaz.UI.selectEntry(entry);
				// entry.addClass('ui-selected');
			},
			'a .highlight':function(e) {
				if ($(this).parents('a').attr('href')) {
					openInBrowser($(this).parents('a').attr('href'));
				}
				return false;
			},
			'a':function(e) {
				Spaz.dump(this.outerHTML);
				if ($(this).attr('href')) {
					openInBrowser($(this).attr('href'));
				}
				return false;
			},
			
			'document':function(e){
				$('#userContextMenu').hide();
			},
			
			// '#header-label':function(e) {
			//	Spaz.UI.showMainMenu($(this));
			// },
		})
		.intercept('contextmenu', {
			// 'div.timeline-entry .user, div.timeline-entry .user-image, div.timeline-entry .user-screen-name':function(e) {
			'.user,.user-image,.user-screen-name,a[user-screen_name]':function(e) {
				// air.trace(this.outerHTML);
				var screen_name = $(this).attr('user-screen_name');
				Spaz.UI.showUserContextMenu($(this), screen_name);
			},
			'a[href]':function(e) {
				var url = $(this).attr('href');
				Spaz.UI.showLinkContextMenu($(this), url);
			},
		})
	// end intercept
	
	
	
	/*
		Set-up drag and drop events
	*/


	var target = document.getElementById('container');
	target.addEventListener("dragenter", dragEnterOverHandler);
	target.addEventListener("dragover", dragEnterOverHandler);
	target.addEventListener("drop", dropHandler);
    
    function dragEnterOverHandler(event){
        event.preventDefault();
    }    

    function dropHandler(event){
		event.preventDefault();

		// Spaz.dump(event);
		//         for(var prop in event){
		//             air.trace(prop + " = " + event[prop]);
		//         }
		// 
		// air.trace('-----------------------------');
		//         for(var prop in event.dataTransfer){
		//             air.trace(prop + " = " + event[prop]);
		//         }
		
		
		
		// $('#spaz-dialog')
		// 	.attr('title','Upload image to Twitpic')
		// 	.html('Uploading to Twitpic requires that you share your Twitter username and password with the service. Are you sure you want to do this?')
		// 	.dialog({
		// 		stack:true,
		// 		// hide:'fadeOut',
		// 		// show:'fadeIn',
		// 		width:225,
		// 		// maxWidth:225,
		// 		height:180,
		// 		// maxHeight:180,
		// 		// resizable:false,
		// 		buttons: { 
		// 			"Yes": function() { 
		// 				uploadDraggedImage();
		// 			}, 
		// 			"No": function() { 
		// 				$(this).dialog("close");
		// 			} 
		// 		}
		// 	
		// 	});
		
		if ( confirm('Uploading to Twitpic requires that you share your Twitter username and password with the service. Are you sure you want to do this?') ) {
			uploadDraggedImage();
		}
		
		/*
			Upload the dragged image to Twitpic
		*/
		function uploadDraggedImage() {
			var fileUrl = event.dataTransfer.getData("text/uri-list");
			
			air.trace(fileUrl);
			
			// return;
			
			var request = new air.URLRequest("http://twitpic.com/api/upload");
			var loader = new air.URLLoader();
			var file = new air.File(fileUrl); //use file.browseForOpen() on ur wish
			var stream = new air.FileStream();
			var buf = new air.ByteArray();
			var extra = {
				"username": Spaz.Prefs.getUser(),
				"password": Spaz.Prefs.getPass(),
			};

			if (fileUrl.match(/^(.+)\.(jpg|jpeg|gif|png)$/i)<1) {
				alert("File must be one of the following:\n .jpg, .jpeg, .gif, .png");
				return;
			}



			stream.open(file, air.FileMode.READ);
			stream.readBytes(buf);
			PrepareMultipartRequest(request, buf, 'media', file.nativePath, extra);

			loader.addEventListener(air.Event.COMPLETE, completeHandler);
			// loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
			loader.addEventListener(air.Event.OPEN, openHandler);
			loader.load(request);

			
			function openHandler(event) {
				Spaz.UI.showLoading();
				Spaz.UI.statusBar('Uploading image to Twitpic…');
				
			}
			

			// function progressHandler(event) {
			// 	var percentage = Math.round(event.bytesLoaded/event.bytesTotal*100);
			// 	Spaz.UI.statusBar('Uploading image '+percentage+'%');
			// }
			

			function completeHandler(event)
			{
			    Spaz.UI.hideLoading
			
				var loader = event.target;
			    air.trace(loader.data);
			
				var parser=new DOMParser();
				xmldoc = parser.parseFromString(loader.data,"text/xml");
				var mediaurl = $(xmldoc).find('mediaurl').text();
			
				air.trace(mediaurl);
				
				Spaz.UI.prepPhotoPost(mediaurl);
			}

			/**
			 * Multipart File Upload Request Helper Function
			 * 
			 * A function to help prepare URLRequest object for uploading.
			 * The script works without FileReference.upload().
			 * 
			 * @author FreeWizard
			 * 
			 * Function Parameters:
			 * void PrepareMultipartRequest(URLRequest request, ByteArray file_bytes,
			 *                              string field_name = "file", string native_path = "C:\FILE",
			 *                              object data_before = {}, object data_after = {});
			 * 
			 * Sample JS Code:
			 * <script>
			 * var request = new air.URLRequest('http://example.com/upload.php');
			 * var loader = new air.URLLoader();
			 * var file = new air.File('C:\\TEST.TXT'); //use file.browseForOpen() on ur wish
			 * var stream = new air.FileStream();
			 * var buf = new air.ByteArray();
			 * var extra = {
			 *     "id": "abcd"
			 *     };
			 * stream.open(file, air.FileMode.READ);
			 * stream.readBytes(buf);
			 * MultipartRequest(request, buf, 'myfile', file.nativePath, extra);
			 * loader.load(request);
			 * </script>
			 * 
			 * Sample PHP Code:
			 * <?php
			 * $id = $_POST['id'];
			 * move_uploaded_file($_FILES['myfile']['tmp_name'], '/opt/blahblah');
			 * ?>\
			 * @link http://rollingcode.org/blog/2007/11/file-upload-with-urlrequest-in-air.html
			 */
			function PrepareMultipartRequest(request, file_bytes, field_name, native_path, data_before, data_after) {
				var boundary = '---------------------------1076DEAD1076DEAD1076DEAD';
				var header1 = '';
				var header2 = '\r\n';
				var header1_bytes = new air.ByteArray();
				var header2_bytes = new air.ByteArray();
				var body_bytes = new air.ByteArray();
				var n;
				if (!field_name) field_name = 'file';
				if (!native_path) native_path = 'C:\FILE';
				if (!data_before) data_before = {};
				if (!data_after) data_after = {};
				for (n in data_before) {
					header1 += '--' + boundary + '\r\n'
							+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
							+ data_before[n] + '\r\n';
				}
				header1 += '--' + boundary + '\r\n'
						+ 'Content-Disposition: form-data; name="' + field_name + '"; filename="' + native_path + '"\r\n'
						+ 'Content-Type: application/octet-stream\r\n\r\n';
				for (n in data_after) {
					header2 += '--' + boundary + '\r\n'
							+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
							+ data_after[n] + '\r\n';
				}
				header2 += '--' + boundary + '--';
				header1_bytes.writeMultiByte(header1, "ascii");
				header2_bytes.writeMultiByte(header2, "ascii");
				body_bytes.writeBytes(header1_bytes, 0, header1_bytes.length);
				body_bytes.writeBytes(file_bytes, 0, file_bytes.length);
				body_bytes.writeBytes(header2_bytes, 0, header2_bytes.length);
				request.method = air.URLRequestMethod.POST;
				request.contentType = 'multipart/form-data; boundary='+boundary;
				request.data = body_bytes;
			}
		}


    }
	
};