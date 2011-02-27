/*
	hide the tools toggle and use the header label to trigger it
*/
(function() {
	var $tmtoggle = $('#tools-menu-toggle');
	var $headerlabel = $('#header-label');

	$tmtoggle.hide();

	$headerlabel.bind('click', 
    	function(e) {
    		$tmtoggle
    		// show it quickly at a certain position so we can position the menu
    		.show()
    		.css('left', '20px')
    		.css('top', '21px')
    		.css('opacity', 0);
    		$tmtoggle.trigger(e);
    		$tmtoggle.hide();
    		return false;

    	}
    );
    
    /*
        remove "Spaz" from header label
    */
    $headerlabel.html($headerlabel.html().replace(/Spaz/, ''));
    
})();


// Make #entryform resizable
// TODO: Remember height in prefs
 (function() {
	var $body = $('body'),
		$timeline = $('#timeline-tabs-content, .TabbedPanelsContentGroup'),
		$entryForm = $('#entryform'),
		entryFormBottom = parseInt($entryForm.css('bottom'), 10),
		$entryBoxPopup = $('#entrybox-popup'),
		$resize = $('<div id="entryform-resize"></div>'),
		resizing = false,
		maxEntryFormHeight = function() {
			return nativeWindow.height - 96;
		},
		setEntryFormHeight = function(newHeight) {
			$timeline.css('bottom', newHeight + 28);
			$entryForm.height(newHeight);
			$entryBoxPopup.css('bottom', newHeight - 1);

		},
		onMouseMove = function(ev) {
			if (!resizing) {
				return;
			}

			var newHeight = nativeWindow.height - ev.pageY - entryFormBottom;

			// Set max height: don't overlap header
			newHeight = Math.min(maxEntryFormHeight(), newHeight);

			// Set min height: fit at least one line of text
			newHeight = Math.max(35, newHeight);

			setEntryFormHeight(newHeight);

		},
		onMouseUp = function(ev) {
			resizing = false;
		},
		onMouseEnter = function(ev) {
			resizing = false;
		},
		onMouseOut = function(ev) {
			if (resizing && $(ev.target).is('body')) {
				resizing = false;

			}

		};

	$resize.prependTo($entryForm)
		.mousedown(function(ev) {
			sch.error('mousedown');
			resizing = true;
			$body
			.mouseout(onMouseOut)
			// Must bind this first so it runs first
			.mouseenter(onMouseEnter)
			// Backup for when body mouseout isn't caught
			.mouseup(onMouseUp)
			.mousemove(onMouseMove);

		})
		.mouseup(onMouseUp);

	window.nativeWindow.addEventListener(
		air.NativeWindowBoundsEvent.RESIZE, 
		function() {
			sch.error('air.NativeWindowBoundsEvent.RESIZE');
			var max = maxEntryFormHeight();
			sch.error("max:"+max);
			$entryForm.height();
			if ($entryForm.height() > max) {
				setEntryFormHeight(max);
			}
		}
	);

})();



/*
    set up mini tpl
*/
    Spaz.Templates.timeline_entry = function(d) {
    	d.isSent = (d.user.screen_name.toLowerCase() === Spaz.Prefs.getUsername().toLowerCase());

    	d.SC_base_url = Spaz.Data.getBaseURL();

    	var entryHTML = '';
    	entryHTML += '<div class="timeline-entry ';
    	if (d.SC_is_read) {
    		sch.debug(d.id + " is being marked as read");
    		entryHTML += ' read ';
    	} else {
    		sch.debug(d.id + " is being marked as NOT read");
    		entryHTML += ' new ';
    	}
    	if (d.favorited) {
    		entryHTML += ' favorited ';
    	}
    	if (d.SC_is_reply) {
    		entryHTML += ' reply ';
    	}
    	if (d.SC_is_retweet) {
    		entryHTML += ' retweet ';
    		d.retweeting_user = d.user;
    		d.user = d.retweeted_status.user;
    		d.id = d.retweeted_status.id;
    		d.in_reply_to_status_id = d.retweeted_status.in_reply_to_status_id;
    		d.isSent = d.isSent;
    		d.text = d.retweeted_status.text;
    	}
    	entryHTML += '"  data-status-id="'+d.id+'" data-user-screen_name="'+d.user.screen_name+'" data-user-id="'+d.user.id+'" data-timestamp="'+d.SC_created_at_unixtime+'">';
    	entryHTML += '	<div class="user" id="user-'+d.user.id+'" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">';
    	entryHTML += '		<div class="user-image clickable" style="background-image:url('+d.user.profile_image_url+')" title="View profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">'+d.user.screen_name+'</div>';
    	entryHTML += '	</div>';
    	entryHTML += '	<div class="status" id="status-'+d.id+'">';
    						if (d.SC_thumbnail_urls) {
    	entryHTML += '		<div class="status-thumbnails">';
    							for (var key in d.SC_thumbnail_urls) {
    								entryHTML += '<img class="clickable status-thumbnail" title="View full version" data-href="'+key+'" src="'+d.SC_thumbnail_urls[key]+'">';
    							}
    	entryHTML += '		</div>';
    						}
    	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
    							if (d.in_reply_to_status_id) {
    	entryHTML += '				<span href="'+d.SC_base_url+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="View conversation" class="in-reply-to clickable" data-status-id="'+d.id+'" data-user-screen-name="'+d.user.screen_name+'" data-irt-status-id="'+d.in_reply_to_status_id+'" data-irt-screen-name="'+d.in_reply_to_screen_name+'">Re:</span>';
    							}
    	entryHTML += '		<div class="user-screen-name clickable" title="View profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">'+d.user.screen_name+'</div>';
        
    	entryHTML += '			'+d.text+'';
    	entryHTML += '		</div>';
    	entryHTML += '		<div class="status-meta">';
    						if (d.SC_is_dm) {
    	entryHTML += '			<div class="status-actions">';
    	entryHTML += '				<span title="Send direct message to '+d.user.screen_name+'" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
    								if (d.isSent) {
    	entryHTML += '					<span title="Delete" class="status-action status-action-del clickable" id="status-'+d.id+'-del" id="'+d.id+'"></span>';
    								}
    	entryHTML += '			</div>';
    	entryHTML += '			<div class="status-link">';
    	entryHTML += '				<span data-created-at="'+d.created_at+'" class="status-created-at">'+d.created_at+'</span>';
    	entryHTML += '			</div>';
    						} else {
    	entryHTML += '			<div class="status-actions">';
    	entryHTML += '				<span title="'+(d.favorited ? 'Remove favorite' : 'Add favorite')+'" class="status-action status-action-fav clickable" id="status-'+d.id+'-fav" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
    								if (!d.isSent){
    	entryHTML += '					<span title="Retweet" class="status-action status-action-retweet clickable" id="status-'+d.id+'-retweet" entry-id="'+d.id+'" timeline-id="'+d.timelineid+'" user-screen_name="'+d.user.screen_name+'" ></span>';
    								}
    	entryHTML += '				<span title="Send direct message to '+d.user.screen_name+'" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
    	entryHTML += '				<span title="Reply to '+d.user.screen_name+'" class="status-action status-action-reply clickable" id="status-'+d.id+'-reply" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
    								if (d.isSent) {
    	entryHTML += '					<span title="Delete" class="status-action status-action-del clickable" id="status-'+d.id+'-del" entry-id="'+d.id+'"></span>';
    								}
    	entryHTML += '				</div>';
    	entryHTML += '				<div class="status-link">';
    	entryHTML += '					<a href="http://twitter.com/'+d.user.screen_name+'/statuses/'+d.id+'/" data-created-at="'+d.created_at+'" class="status-created-at clickable" title="View full post in browser">'+d.created_at+'</a>';
    									if (d.retweeting_user) {
    	entryHTML += '						<span class="status-rt-by">RTed by <span class="user-screen-name clickable" title="View profile" user-screen_name="'+d.retweeting_user.screen_name+'">'+d.retweeting_user.screen_name+'</span></span>';
    									}
    	entryHTML += '					<span class="status-source">from';
    	entryHTML += '						<span class="status-source-label">'+d.source+'</span>';
    	entryHTML += '					</span>';
    									if (d.user['protected']) {
    	entryHTML += '						<span class="status-protected">&nbsp;</span>';
    									}
    	entryHTML += '				</div>';
    	entryHTML += '			</div>';
    						}
    	entryHTML += '		</div><!-- end status-meta -->';

    	entryHTML += '	</div>';
    	entryHTML += '</div>';
    	return entryHTML;
    };

    Spaz.Templates.timeline_entry_dm = function(d) {
    	var read_or_new;

    	d.isSent = (d.sender_screen_name.toLowerCase() === Spaz.Prefs.getUsername().toLowerCase());

    	// sch.dump(sch.enJSON(d));

    	if (d.SC_is_read) {
    		sch.debug(d.id + " is being marked as read");
    		read_or_new = ' read ';
    	} else {
    		sch.debug(d.id + " is being marked as NOT read");
    		read_or_new = ' new ';
    	}


    	var entryHTML = '';
    	entryHTML += '<div class="timeline-entry dm '+read_or_new+'" data-status-id="'+d.id+'" data-user-screen_name="'+d.sender_screen_name+'" data-user-id="'+d.sender.id+'" data-timestamp="'+d.SC_created_at_unixtime+'">';
    	entryHTML += '	<div class="user" id="user-'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">';
    	entryHTML += '		<div class="user-image clickable" style="background-image:url('+d.sender.profile_image_url+')" title="View profile" user-id="'+d.sender.id+'" user-screen_name="'+d.sender.screen_name+'">'+d.sender.screen_name+'</div>';
    	entryHTML += '	</div>';
    	entryHTML += '	<div class="status" id="status-'+d.id+'">';
    	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
    							if (d.in_reply_to_status_id) {
    	entryHTML += '				<a href="'+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="View conversation" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">Re:</a>';
    							}
    	entryHTML += '		<div class="user-screen-name clickable" title="View profile" user-id="'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">'+d.sender_screen_name+'</div>';
    	entryHTML += '			'+d.text+'';
    	entryHTML += '		</div>';
    	entryHTML += '		<div class="status-thumbnails"></div>';
    	entryHTML += '		<div class="status-actions">';
    	entryHTML += '			<span title="Send direct message to '+d.sender_screen_name+'" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" id="'+d.id+'" user-screen_name="'+d.sender_screen_name+'" ></span>';
    							if (d.isSent) {
    	entryHTML += '				<span title="Delete" class="status-action status-action-del clickable" id="status-'+d.id+'-del" entry-id="'+d.id+'"></span>';
    							}
    	entryHTML += '		</div>';
    	entryHTML += '		<div class="status-link">';
    	entryHTML += '			<span data-created-at="'+d.created_at+'" class="status-created-at">'+d.created_at+'</span>';
    	entryHTML += '		</div>';
    	entryHTML += '	</div>';
    	entryHTML += '</div>';
    	return entryHTML;
    };

// Add the following to your user.js file to customize the interface:
// Single scrollbar arrows at both the start and the end
// $('body').addClass('scrollbar-single-both');
// Double scrollbar arrows at both the start and the end
// $('body').addClass('scrollbar-double-both');
