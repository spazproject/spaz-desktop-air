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
	entryHTML += '		<div class="user-screen-name clickable" title="View profile" user-id="'+d.user.id+'" user-screen_name="'+d.user.screen_name+'">'+d.user.screen_name+'</div>';
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
	// 								if (d.in_reply_to_status_id) {
	// entryHTML += '						<!-- <a href="/'+d.in_reply_to_user_id+'/statuses/'+d.in_reply_to_status_id+'/"  class="status-in-reply-to clickable" title="View message this responds to">&crarr;</a> -->';
	// 								}
									if (d.retweeting_user) {
	entryHTML += '						<span class="status-rt-by">RTed by <a href="http://twitter.com/'+d.retweeting_user.screen_name+'" class="user-screen-name clickable" title="View profile" user-screen_name="'+d.retweeting_user.screen_name+'">'+d.retweeting_user.screen_name+'</a></span>';
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
	
	d.isSent = (d.sender_screen_name.toLowerCase() === Spaz.Prefs.getUsername().toLowerCase());
	
	// sch.dump(sch.enJSON(d));

	var entryHTML = '';
	entryHTML += '<div class="timeline-entry dm new" data-status-id="'+d.id+'" data-user-screen_name="'+d.sender_screen_name+'" data-user-id="'+d.sender.id+'" data-timestamp="'+d.SC_created_at_unixtime+'">';
	entryHTML += '	<div class="user" id="user-'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">';
	entryHTML += '		<div class="user-image clickable" style="background-image:url('+d.sender.profile_image_url+')" title="View profile" user-id="'+d.sender.id+'" user-screen_name="'+d.sender.screen_name+'">'+d.sender.screen_name+'</div>';
	entryHTML += '		<div class="user-screen-name clickable" title="View profile" user-id="'+d.sender_id+'" user-screen_name="'+d.sender_screen_name+'">'+d.sender_screen_name+'</div>';
	entryHTML += '	</div>';
	entryHTML += '	<div class="status" id="status-'+d.id+'">';
	entryHTML += '		<div class="status-text" id="status-text-'+d.id+'">';
							if (d.in_reply_to_status_id) {
	entryHTML += '				<a href="'+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="View conversation" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">Re:</a>';
							}
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
	entryHTML += '		<img src="'+d.profile_image_url+'" class="user-image" user-screen_name="'+d.screen_name+'" title="View profile" />';
	entryHTML += '		<div class="directory-user-name">';
							if (d.name && d.name != d.screen_name) {
	entryHTML += '				<div class="name"><a class="inline-link" href="'+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View profile">'+d.name+'</a></div>';
							}
	entryHTML += '			<div class="screen-name"><a class="inline-link" href="'+d.screen_name+'/" user-screen_name="'+d.screen_name+'" title="View profile">'+d.screen_name+'</a></div>';
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