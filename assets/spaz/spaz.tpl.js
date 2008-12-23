var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.Tpl) Spaz.Tpl = {};

Spaz.Tpl.parse =function(template, data) {
		// var parsed  = Spaz.Sys.ClassicSB.parseTpl(tpl, data, path)
		var parsed = Spaz.Templates[template](data);
		return parsed;
};


if (!Spaz.Templates) Spaz.Templates = {};

Spaz.Templates.timeline_entry = function(d) {
	var entryHTML = '';
	entryHTML += '<div class="timeline-entry needs-cleanup new '+d.rowclass+' if (favorited) {favorited}" id="'+d.timelineid+'-'+d.id+'">';
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
							if (d.in_reply_to_screen_name) {
	entryHTML += '				<a href="'+d.base_url+''+d.in_reply_to_screen_name+'/statuses/'+d.in_reply_to_status_id+'/" title="In reply to:" class="in-reply-to" status-id="'+d.in_reply_to_status_id+'" screen-name="'+d.in_reply_to_screen_name+'">RE:</a>';
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