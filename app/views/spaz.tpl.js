var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Tpl
***********/
if (!Spaz.Tpl) Spaz.Tpl = {};

/**
 * @param string  template  the template method to call in Spaz.Templates
 * @param mixed   data      data to be used by the template method 
 */
Spaz.Tpl.parse =function(template, data) {
		var parsed = Spaz.Templates[template](data);
		return parsed;
};


if (!Spaz.Templates) Spaz.Templates = {};

Spaz.Templates.timeline_entry = function(d) {
	
	d.isSent = (d.user.screen_name.toLowerCase() === Spaz.Prefs.getUser().toLowerCase());

	var entryHTML = '';
	entryHTML += '<div class="timeline-entry new ';
	if (d.favorited) {
		entryHTML += ' favorited ';
	}
	if (d.SC_is_reply) {
		entryHTML += ' reply ';
	}
	entryHTML += '"  data-status-id="'+d.id+'" data-user-screen_name="'+d.user.screen_name+'" data-user-id="'+d.user.id+'" data-timestamp="'+d.SC_created_at_unixtime+'">';
	entryHTML += '	<div class="user" id="user-'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">';
	entryHTML += '		<img class="user-image clickable" height="48" width="48" src="'+d.user.profile_image_url+'" alt="'+d.user.screen_name+'" title="View user\'s profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'" />';
	entryHTML += '		<div class="user-screen-name clickable" title="View user\'s profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">'+d.user.screen_name+'</div>';
	entryHTML += '	</div>';
	entryHTML += '	<div class="status" id="status-'+d.id+'">';
	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
							if (d.in_reply_to_status_id) {
	entryHTML += '				<a href="'+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="In reply to:" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">Re:</a>';
							}
	entryHTML += '			'+d.text+'';
	entryHTML += '		</div>';
	entryHTML += '		<div class="status-thumbnails">';
						if (d.SC_thumbnail_urls) {
							for (var key in d.SC_thumbnail_urls) {
								entryHTML += '<span class="clickable" href="'+key+'"><img src="'+d.SC_thumbnail_urls[key]+'" class="status-thumbnail"></a>';
							}
						}
	entryHTML += '		</div>';
						if (d.SC_is_dm) {
	entryHTML += '			<div class="status-actions">';
	entryHTML += '				<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
								if (d.isSent) {
	entryHTML += '					<a title="Delete this message" class="status-action-del clickable" id="status-'+d.id+'-del" id="'+d.id+'">del</a>';
								}
	entryHTML += '			</div>';
	entryHTML += '			<div class="status-link">';
	entryHTML += '				<!-- '+d.created_at+' -->';
	entryHTML += '			</div>';
						} else {
	entryHTML += '			<div class="status-actions">';
	entryHTML += '				<span title="Make this message a favorite" class="status-action status-action-fav clickable" id="status-'+d.id+'-fav" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
	entryHTML += '				<span title="Retweet this message" class="status-action status-action-retweet clickable" id="status-'+d.id+'-rewteet" entry-id="'+d.id+'" timeline-id="'+d.timelineid+'" user-screen_name="'+d.user.screen_name+'" ></span>';
	entryHTML += '				<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
	entryHTML += '				<span title="Send reply to this user" class="status-action status-action-reply clickable" id="status-'+d.id+'-reply" entry-id="'+d.id+'" user-screen_name="'+d.user.screen_name+'" ></span>';
								if (d.isSent) {
	entryHTML += '					<a title="Delete this message" class="status-action-del clickable" id="status-'+d.id+'-del" entry-id="'+d.id+'">del</a>';
								}
	entryHTML += '				</div>';
	entryHTML += '				<div class="status-link">';
	entryHTML += '					<a href="'+d.user.screen_name+'/statuses/'+d.id+'/" data-created-at="'+d.created_at+'" class="status-created-at clickable" title="View full post in browser">'+d.created_at+'</a>';
									if (d.in_reply_to_status_id) {
	entryHTML += '						<!-- <a href="/'+d.in_reply_to_user_id+'/statuses/'+d.in_reply_to_status_id+'/"  class="status-in-reply-to clickable" title="View message this responds to">&crarr;</a> -->';
									}
	entryHTML += '					<span class="status-source">from';
	entryHTML += '						<span class="status-source-label">'+d.source+'</span>';
	entryHTML += '					</span>';
									if (d.user.protected) {
	entryHTML += '						<span class="status-protected">&nbsp;</span>';
									}
	entryHTML += '				</div>';
	entryHTML += '			</div>';
						}
	entryHTML += '	</div>';
	entryHTML += '</div>';
	return entryHTML;
}


Spaz.Templates.timeline_entry_dm = function(d) {
	
	d.isSent = (d.sender_screen_name.toLowerCase() === Spaz.Prefs.getUser().toLowerCase());
	
	// sch.dump(sch.enJSON(d));

	var entryHTML = '';
	entryHTML += '<div class="timeline-entry dm new data-status-id="'+d.id+'" data-user-screen_name="'+d.sender_screen_name+'" data-user-id="'+d.sender.id+'" data-timestamp="'+d.SC_created_at_unixtime+'">';
	entryHTML += '	<div class="user" id="user-'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">';
	entryHTML += '		<img class="user-image clickable" height="48" width="48" src="'+d.sender.profile_image_url+'" alt="'+d.sender_screen_name+'" title="View user\'s profile" user-id="'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'" />';
	entryHTML += '		<div class="user-screen-name clickable" title="View user\'s profile" user-id="'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">'+d.sender_screen_name+'</div>';
	entryHTML += '	</div>';
	entryHTML += '	<div class="status" id="status-'+d.id+'">';
	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
							if (d.in_reply_to_status_id) {
	entryHTML += '				<a href="'+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="In reply to:" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">Re:</a>';
							}
	entryHTML += '			'+d.text+'';
	entryHTML += '		</div>';
	entryHTML += '		<div class="status-thumbnails"></div>';
	entryHTML += '		<div class="status-actions">';
	entryHTML += '			<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-'+d.id+'-dm" id="'+d.id+'" user-screen_name="'+d.sender_screen_name+'" ></span>';
							if (d.isSent) {
	entryHTML += '				<a title="Delete this message" class="status-action-del clickable" id="status-'+d.id+'-del" id="'+d.id+'">del</a>';
							}
	entryHTML += '		</div>';
	entryHTML += '		<div class="status-link">';
	entryHTML += '			<!-- '+d.created_at+' -->';
	entryHTML += '		</div>';
	entryHTML += '	</div>';
	entryHTML += '</div>';
	return entryHTML;
}



Spaz.Templates.followerslist_row = function(d) {
	var entryHTML = '';
	entryHTML += '<div screenname="'+d.screen_name+'" user-id="'+d.id+'" id="'+d.timeline+'-'+d.id+'" class="followerslist-row">';
	// entryHTML += '		<span class="directory-user-followstatus" screen-name="'+d.screen_name+'" user-id="'+d.id+'"';
	// 					if (d.is_mutual) {
	// entryHTML += '			rel="mutual" title="'+d.screen_name+' is a mutual follower">&laquo;mutual&raquo;</span>';
	// 					} else if (d.is_follower) {
	// entryHTML += '			rel="follower" title="'+d.screen_name+' is following you">&laquo;follower</span>';
	// 					} else if (d.is_following) {
	// entryHTML += '			rel="following" title="You are following '+d.screen_name+'">friend&raquo;</span>';
	// 					} else {
	// entryHTML += '			>?</span>';
	// 					}
	entryHTML += '	<div class="directory-user">';
	entryHTML += '		<img src="'+d.profile_image_url+'" class="user-image" user-screen_name="'+d.screen_name+'" title="View user\'s profile" />';
	entryHTML += '		<div class="directory-user-name">';
							if (d.name && d.name != d.screen_name) {
	entryHTML += '				<div class="name"><a class="inline-link" href="'+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View user\'s profile">'+d.name+'</a></div>';
							}
	entryHTML += '			<div class="screen-name"><a class="inline-link" href="'+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View user\'s profile">'+d.screen_name+'</a></div>';
	entryHTML += '		</div>';
	entryHTML += '		<div class="directory-user-info">';
							if (d.location) {
	entryHTML += '		    	<span class="directory-user-location clickable" title="View this location on a map">'+d.location+'</span>&nbsp;';
							}
							if (d.url) {
	entryHTML += '		    	<a class="directory-user-homepage clickable" href="'+d.url+'" title="Open user\'s homepage">www&raquo;</a>';
							}
	entryHTML += '		    &nbsp;';
	entryHTML += '    	</div>';
	entryHTML += '	</div>';
	entryHTML += '</div>';
	return entryHTML;
};