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
	var entryHTML = '';
	entryHTML += '<div class="timeline-entry needs-cleanup new '+d.rowclass;
	if (d.favorited) {
		entryHTML += ' favorited ';
	}
	entryHTML += '"  id="'+d.timelineid+'-'+d.id+'">';
	entryHTML += '	<div class="entry-timestamp" style="display:none">'+d.timestamp+'</div>';
	entryHTML += '	<div class="entry-id" style="display:none">['+d.id+']</div>';
	entryHTML += '	<div class="entry-time" style="display:none">'+d.created_at+'</div>';
	entryHTML += '	<div class="entry-user-id" style="display:none">'+d.user.id+'</div>';
	entryHTML += '	<div class="entry-user-screenname" style="display:none">'+d.user.screen_name+'</div>';
	entryHTML += '	<div class="entry-user-img" style="display:none">'+d.user.profile_image_url+'</div>';
	entryHTML += '	<div class="entry-text" style="display:none">'+d.rawtext+'</div>';
	entryHTML += '	<div class="user" id="user-'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">';
	entryHTML += '		<img class="user-image clickable" height="48" width="48" src="'+d.user.profile_image_url+'" alt="'+d.user.screen_name+'" title="View user\'s profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'" />';
	entryHTML += '		<div class="user-screen-name clickable" title="View user\'s profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">'+d.user.screen_name+'</div>';
	entryHTML += '	</div>';
	entryHTML += '	<div class="status" id="status-'+d.id+'">';
	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
							if (d.in_reply_to_status_id) {
	entryHTML += '				<a href="'+d.base_url+''+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="In reply to:" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">Re:</a>';
							}
	entryHTML += '			'+d.text+'';
	entryHTML += '		</div>';
						if (d.isDM) {
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
	entryHTML += '					<a href="'+d.base_url+''+d.user.screen_name+'/statuses/'+d.id+'/" data-created-at="'+d.created_at+'" class="status-created-at clickable" title="View full post in browser">'+d.created_at+'</a>';
									if (d.in_reply_to_status_id) {
	entryHTML += '						<!-- <a href="'+d.base_url+'/'+d.in_reply_to_user_id+'/statuses/'+d.in_reply_to_status_id+'/"  class="status-in-reply-to clickable" title="View message this responds to">&crarr;</a> -->';
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

Spaz.Templates.friendslist_row = function(d) {
	var entryHTML = '';
	entryHTML += '<div screenname="'+d.screen_name+'" user-id="'+d.id+'" id="'+d.timeline+'-'+d.id+'" class="friendslist-row">';
	entryHTML += '		<span class="directory-user-followstatus" screen-name="'+d.screen_name+'" user-id="'+d.id+'"';
						if (d.is_mutual) {
	entryHTML += '			rel="mutual" title="'+d.screen_name+' is a mutual follower">&laquo;mutual&raquo;</span>';
						} else if (d.is_follower) {
	entryHTML += '			rel="follower" title="'+d.screen_name+' is following you">&laquo;follower</span>';
						} else if (d.is_following) {
	entryHTML += '			rel="following" title="You are following '+d.screen_name+'">friend&raquo;</span>';
						} else {
	entryHTML += '			>?</span>';
						}
	entryHTML += '	<div class="directory-user">';
	entryHTML += '		<img src="'+d.profile_image_url+'" class="user-image" user-screen_name="'+d.screen_name+'" title="View user\'s profile" />';
	entryHTML += '		<div class="directory-user-name">';
							if (d.name && d.name != d.screen_name) {
	entryHTML += '				<div class="name"><a class="inline-link" href="'+d.base_url+''+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View user\'s profile">'+d.name+'</a></div>';
							}
	entryHTML += '			<div class="screen-name"><a class="inline-link" href="'+d.base_url+''+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View user\'s profile">'+d.screen_name+'</a></div>';
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