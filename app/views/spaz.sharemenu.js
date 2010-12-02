Spaz.ShareMenu = function() {};

Spaz.ShareMenu.prototype.createAndShow = function(event, status_obj) {
	
	var status_id = status_obj.id;
	sch.debug('status_id:'+status_id);
	sch.debug(status_obj);
	
	var menu = new SpazMenu({
		base_id:    'share-menu',
		base_class: 'spaz-menu',
		li_class:   'spaz-menu-item',
		close_on_any_click: true,
		items_func: function(itemsData){
			var i, iMax, itemData, items = [];
			
			items.push({
				label:   $L('Retweet'),
				handler: function(e, data) {
					Spaz.Data.retweet(status_obj.id);
				},
				data:    {'status_id':status_id}
			});
			items.push({
				label:   $L('RT @…'),
				handler: function(e, data) {
					Spaz.postPanel.prepRetweet(status_obj.user.screen_name, status_obj.SC_text_raw);
				},
				data:    {'status_id':status_id}
			});
			items.push({
				label:   $L('/via…'),
				handler: function(e, data) { 
					Spaz.postPanel.prepVia(status_obj.user.screen_name, status_obj.SC_text_raw);
				},
				data:    {'status_id':status_id}
			});

			return items;
		}
	});
	
	menu.show(event);
};

/**
 * this onReady binds clicks on the appropriate elements to the menu creation method
 */
jQuery(document).ready(function(){    
	jQuery('.status-action-retweet').live('click', function(e) {
        sch.debug(this.outerHTML);
		var entryid = $(this).attr('entry-id');

		var sharemenu = new Spaz.ShareMenu();
		
		sch.debug(entryid);

		Spaz.Data.getTweet(entryid, null, function(data) {
		    sharemenu.createAndShow(e, data);
		});
	});
});