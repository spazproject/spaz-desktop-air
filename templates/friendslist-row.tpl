<tr id="${timeline}-${id}">
	<td><img src="${profile_image_url}"
			style="background-color:#dddddd;border:1px solid #999;width:24px;height:24px;margin:0 5px 0 0;-webkit-box-shadow:none;float:left"
			class="user-image" user-screen_name="${screen_name}" title="View user's profile" />
		<div class="directory-user-name" style="font-weight:bold;"><a href="http://twitter.com/${screen_name}/" user-screen_name="${screen_name}"
			title="View user's profile">{if name}${name}{/if} (${screen_name})</a></div>
		{if location}
			<div class="directory-user-location clickable" title="View this location on a map">${location}</div>
		{/if}
	</td>
	
	<td>
		{if url}
			<a href="${url}" title="Open user's homepage">go&raquo;</a>
		{/if}
	</td>
</tr>
