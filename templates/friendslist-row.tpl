<div screenname="${screen_name}" id="${timeline}-${id}" class="friendslist-row" style="clear:both; padding:8px">
	<div><img src="${profile_image_url}"
			style="background-color:#dddddd;border:1px solid #999;width:24px;height:24px;margin:0 5px 0 0;-webkit-box-shadow:none;float:left"
			class="user-image" user-screen_name="${screen_name}" title="View user's profile" />
		<div class="directory-user-name" style="font-weight:bold;"><a href="http://twitter.com/${screen_name}/" user-screen_name="${screen_name}"
			title="View user's profile">{if name}${name}{/if} (${screen_name})</a></div>
		<div>
		    {if location}<span class="directory-user-location clickable" title="View this location on a map">${location}</span>{/if}
		    {if url} &middot; <span><a href="${url}" title="Open user's homepage">Homepage&raquo;</a></span>{/if}
		    &nbsp;
    	</div>
	</div>
	

</div>
