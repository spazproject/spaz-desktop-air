Spaz.UserMenu = function() {};

Spaz.UserMenu.prototype.createAndShow = function(event, userobj) {
	
	var userid = userobj.id;
	sch.error('userid:'+userid);
	sch.error('userobj.screen_name:'+userobj.screen_name);
	sch.error(userobj);
	
	var menu = new SpazMenu({
		base_id:    'user-menu',
		base_class: 'spaz-menu',
		li_class:   'spaz-menu-item',
		close_on_any_click: true,
		items_func: function(itemsData){
			var i, iMax, itemData, items = [];
			
			items.push({
				label:   $L('@Mention'),
				handler: function(e, data) {
					Spaz.postPanel.prepReply(userobj.screen_name);
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Direct Message'),
				handler: function(e, data) {
					Spaz.postPanel.prepDirectMessage(userobj.screen_name);
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Search for')+' '+userobj.screen_name,
				handler: function(e, data) { 
					var screen_name = userobj.screen_name;
					var search_str = "from:"+screen_name+" OR to:"+screen_name;			
					Spaz.UI.showTab('tab-search');
					Spaz.Timelines.search.searchFor(search_str);
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('Filter by')+' "'+userobj.screen_name+'"',
				handler: function(e, data) {
					var screen_name = userobj.screen_name;
					$('#filter-friends').val(screen_name);
					$('#filter-friends').trigger('keyup');
				    Spaz.UI.showTab('tab-friends');
				},
				data:    {'userid':userid}
			});
			items.push({
				label:   $L('View profile'),
				handler: function(e, data) {
					sch.openInBrowser(Spaz.Prefs.get('twitter-base-url')+userobj.screen_name);
				},
				data:    {'userid':userid}
			});
			
			if (userobj.following === true) {
				items.push({
					label:   $L('Stop following'),
					handler: function(e, data) {
						Spaz.Data.removeFriend(userobj.screen_name);
					},
					data:    {'userid':userid}
				});				
			} else {
				items.push({
					label:   $L('Follow'),
					handler: function(e, data) {
						Spaz.Data.addFriend(userobj.screen_name);
					},
					data:    {'userid':userid}
				});			
			}
			
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
	});
	
	menu.show(event);
};

/**
 * this onReady binds clicks on the appropriate elements to the user menu creation method 
 */
jQuery(document).ready(function(){
	jQuery('.user,.user-image,.user-screen-name,a[user-screen_name]').live('contextmenu', function(e) {
        sch.error(this.outerHTML);
		var userid = $(this).attr('user-id');
		if (!userid) { userid = '@'+$(this).attr('user-screen_name'); } // try to get screen name instead
	
		var usermenu = new Spaz.UserMenu();
		
		sch.error(userid);

		Spaz.Data.getUser(userid, null, function(data) {
		    usermenu.createAndShow(e, data);
		});
	});
});