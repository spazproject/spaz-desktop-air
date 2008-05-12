<tr id="${timeline}-${id}">
	<td><img src="${profile_image_url}"
			style="background-color:#dddddd;border:1px solid #999;width:24px;height:24px;margin:0 5px 0 0;-webkit-box-shadow:none;float:left"
			class="user-image" user-screen_name="${screen_name}" title="View user's profile" />
		<div class="directory-user-name" style="font-weight:bold;"><a href="http://twitter.com/${screen_name}/" user-screen_name="${screen_name}"
			title="View user's profile">${name} (${screen_name})</a></div>
		<div class="directory-user-location clickable" title="View this location on a map">${location}</div>
	</td>
	<td><a href="${url}" title="Open user's homepage">go&raquo;</a></td>
	<!-- <td><a class="clickable directory-action-follow" user-screen_name="${screen_name}"
		 title="Follow this user">Follow</a></td>
	<td><a class="clickable directory-action-unfollow" user-screen_name="${screen_name}"
		 title="Stop following this user">Unfollow</a></td> -->
</tr>