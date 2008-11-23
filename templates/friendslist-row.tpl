<div screenname="${screen_name}" id="${timeline}-${id}" class="friendslist-row">
	<div class='directory-user'>
		<img src="${profile_image_url}" class="user-image" user-screen_name="${screen_name}" title="View user's profile" />
		<div class="directory-user-name">
			<a href="${base_url}${screen_name}/" user-screen_name="${screen_name}" title="View user's profile">{if name}${name}{/if} (${screen_name})</a>
		</div>
		<div class="directory-user-info">
		    {if location}<span class="directory-user-location clickable" title="View this location on a map">${location}</span>{/if}
		    {if url} &middot; <a class="directory-user-homepage" href="${url}" title="Open user's homepage">www&raquo;</a>{/if}
		    &nbsp;
    	</div>
	</div>
</div>
