Spaz.UserMenu = {};

Spaz.UserMenu.create = function(userobj, menuOpts) {
	var userid     = userobj.id,
	    screenName = userobj.screen_name;
	sch.debug('Spaz.UserMenu: userid='+userid);
	sch.debug('Spaz.UserMenu: screenName='+screenName);
	sch.debug(userobj);
	
	if(Spaz.UserMenu.menu){
		Spaz.UserMenu.menu.hideAndDestroy();
	}

	Spaz.UserMenu.menu = new SpazMenu(jQuery.extend({
		base_id:    'user-menu',
		base_class: 'spaz-menu',
		li_class:   'spaz-menu-item',
		items_func: function(itemsData){
			var i, iMax, itemData, items = [];

			items.push({
				label:   $L('@Mention'),
				handler: function(e, data) {
					Spaz.postPanel.prepReply(screenName);
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Direct message'),
				handler: function(e, data) {
					Spaz.postPanel.prepDirectMessage(screenName);
				},
				data:    {'userid':userid}
			});
			if(!Spaz.Profile.isVisible(screenName)){
				items.push({
					label:   $L('View profile'),
					handler: function(e, data) {
						Spaz.Profile.show(screenName);
					},
					data:    {'userid':userid}
				});
			}

			items.push(null);

			items.push({
				label:   $L('Search for')+' '+screenName,
				handler: function(e, data) { 
					var searchStr = "from:"+screenName+" OR to:"+screenName;
					Spaz.UI.showTab('tab-search');
					Spaz.Timelines.search.searchFor(searchStr);
					Spaz.Profile.hide();
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Filter by')+' &ldquo;'+screenName+'&rdquo;',
				handler: function(e, data) {
					jQuery('#filter-friends').val(screenName).trigger('keyup');
					Spaz.UI.showTab('tab-friends');
				},
				data:    {'userid':userid}
			});

			items.push(null);

			items.push({
				label:   $L('Loading…'),
				'class': 'follow-toggle',
				handler: function(e, data) {
					if (Spaz.UserMenu._friendshipInfo.target.followed_by) {
						Spaz.Data.removeFriend(data.userid);
					} else {
						Spaz.Data.addFriend(data.userid);
					}

					// Force rebuilding the follow/unfollow item
					Spaz.UserMenu.menu.hideAndDestroy();
				},
				data:    {'userid': userid}
			});

			items.push(null);

			items.push({
				label:   $L('Block'),
				handler: function(e, data) {
					Spaz.Data.blockUser(data.userid);
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Block and report'),
				handler: function(e, data) { 
					Spaz.Data.reportUser(data.userid);
				},
				data:    {'userid':userid}
			});

			return items;
		}
	}, menuOpts));
};

Spaz.UserMenu.show = function(event){
	Spaz.UserMenu.menu && Spaz.UserMenu.menu.show(event);
};

Spaz.UserMenu.updateFollowToggle = function(userobj){
	Spaz.UserMenu._friendshipInfo = null;
	Spaz.Data.getFriendshipInfo(userobj.id, function(data) {
		Spaz.UserMenu._friendshipInfo = data.relationship;
		var $followToggle = jQuery('#user-menu li.follow-toggle span');
		if (data.relationship.target.followed_by) {
			$followToggle.html($L('Stop Following'));
		} else {
			$followToggle.html($L('Follow'));
		}
	});
};

/**
 * this onReady binds clicks on the appropriate elements to the user menu creation method 
 */

jQuery(function($){
	jQuery('.user, .user-image, .user-screen-name, a[user-screen_name], div.followers-row').live('contextmenu', function(e) {
		var $this = $(this), userid;
		sch.debug('Spaz.UserMenu: this.outerHTML = ' + this.outerHTML);

		userid = $this.attr('user-id');
		if (!userid) {
			// Try to get screen name instead
			userid = '@' + $this.attr('user-screen_name');
		}
		sch.debug('Spaz.UserMenu: userid = ' + userid);

		Spaz.Data.getUser(userid, null, function(userData) {
			Spaz.UserMenu.updateFollowToggle(userData);
			Spaz.UserMenu.create(userData, {close_on_any_click: true});
			Spaz.UserMenu.show(e);
		});
	});
});
