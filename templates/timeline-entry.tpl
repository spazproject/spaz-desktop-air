<div class="timeline-entry needs-cleanup new ${rowclass} {if favorited}favorited{/if}" id="${timelineid}-${id}">
	<div class="entry-timestamp" style="display:none">${timestamp}</div>
	<div class="entry-id" style="display:none">[${id}]</div>
	<div class="entry-time" style="display:none">${created_at}</div>
	<div class="entry-user-id" style="display:none">${user.id}</div>
	<div class="entry-user-screenname" style="display:none">${user.screen_name}</div>
	<div class="entry-user-img" style="display:none">${user.profile_image_url}</div>
	<div class="entry-text" style="display:none">${text}</div>
	<div class="user" id="user-${user.id}" user-screen_name="${user.screen_name}">
		<img class="user-image clickable" height="48" width="48" src="${user.profile_image_url}" alt="${user.screen_name}" title="View user's profile" user-id="${user.id}" user-screen_name="${user.screen_name}" />
		<div class="user-screen-name clickable" title="View user's profile" user-id="${user.id}" user-screen_name="${user.screen_name}">${user.screen_name}</div>
	</div>
	<div class="status" id="status-${id}">
		<div class="status-text" id="status-text-${id}">${text}</div>
		{if isDM}
			<div class="status-actions">
				<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-${id}-dm" id="${id}" user-screen_name="${user.screen_name}" ></span>
				{if isSent}
					<a title="Delete this message" class="status-action-del clickable" id="status-${id}-del" id="${id}">del</a>
				{/if}
			</div>
			<div class="status-link">
				<!-- ${created_at} -->
			</div>
		{else}
			<div class="status-actions">
				<span title="Make this message a favorite" class="status-action status-action-fav clickable" id="status-${id}-fav" entry-id="${id}" user-screen_name="${user.screen_name}" ></span>
				<span title="Send direct message to this user" class="status-action status-action-dm clickable" id="status-${id}-dm" entry-id="${id}" user-screen_name="${user.screen_name}" ></span>
				<span title="Send reply to this user" class="status-action status-action-reply clickable" id="status-${id}-reply" entry-id="${id}" user-screen_name="${user.screen_name}" ></span>
				{if isSent}
					<a title="Delete this message" class="status-action-del clickable" id="status-${id}-del" entry-id="${id}">del</a>
				{/if}
				</div>
				<div class="status-link">
					<a href="${base_url}/${user.screen_name}/statuses/${id}/" data-created-at="${created_at}" class="status-created-at clickable" title="View full post in browser">${created_at}</a>
					<span class="status-source">from
						<span class="status-source-label">${source}</span>
					</span>
					{if user.protected}
						<span class="status-protected">&nbsp;</span>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>