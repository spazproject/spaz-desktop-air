<div class="timeline-entry needs-cleanup new '+rowclass+'" id="'+timelineid+'-'+entry.id+'">
	<div class="entry-timestamp" style="display:none">'+timestamp+'</div>
	<div class="entry-id" style="display:none">['+entry.id+']</div>
	<div class="entry-time" style="display:none">'+entry.created_at+'</div>
	<div class="entry-user-id" style="display:none">'+entry.user.id+'</div>
	<div class="entry-user-screenname" style="display:none">'+entry.user.screen_name+'</div>
	<div class="entry-user-img" style="display:none">'+entry.user.profile_image_url+'</div>
	<div class="entry-text" style="display:none">'+entry.text+'</div>'
	<div class="user" id="user-'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'">
		<img class="user-image clickable" height="48" width="48" src="'+entry.user.profile_image_url+'" alt="'+entry.user.screen_name+'" title="View user\'s profile" user-id="'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'" />
		<div class="user-screen-name clickable" title="View user\'s profile" user-id="'+entry.user.id+'" user-screen_name="'+entry.user.screen_name+'">'+entry.user.screen_name+'</div>
	</div>
	<div class="status" id="status-'+entry.id+'">
		<div class="status-text" id="status-text-'+entry.id+'">'+entry.text+'</div>
if (!isDM) {
		<div class="status-actions">
			<span title="Make this message a favorite" class="status-action status-action-fav clickable" id="status-'+entry.id+'-fav" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" ></span>
			<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" ></span>
			<span title="Send reply to this user" class="status-action status-action-reply clickable" id="status-'+entry.id+'-reply" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" ></span>
	if (isSent) {
			<a title="Delete this message" class="status-action-del clickable" id="status-'+entry.id+'-del" entry-id="'+entry.id+'">del</a>
	}
		</div>
		<div class="status-link">
			<a href="http://twitter.com/'+entry.user.screen_name+'/statuses/'+entry.id+'/" class="status-created-at clickable" title="View full post in browser">'+entry.created_at+'</a>
			<span class="status-source">from <span class="status-source-label">'+entry.source+'</span></span>
			<span class="status-protected">'+entry.user.protected+'</span>
		</div>
} else {
		<div class="status-actions">
			<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-'+entry.id+'-dm" entry-id="'+entry.id+'" user-screen_name="'+entry.user.screen_name+'" ></span>
	if (isSent) {
			<a title="Delete this message" class="status-action-del clickable" id="status-'+entry.id+'-del" entry-id="'+entry.id+'">del</a>
	}

		</div>
}
	</div>
</div>