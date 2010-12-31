Spaz.ReplyMenu = function() {};

Spaz.ReplyMenu.prototype.createAndShow = function(event, screen_name, names, status_obj) {
	
	var status_id = status_obj.id;
	
	sch.debug('status_id:'+status_id);
	sch.debug('screen_name:'+screen_name);
	sch.debug('names:'+names);
	sch.debug(status_obj);
	
	var menu = new SpazMenu({
		base_id:    'reply-menu',
		base_class: 'spaz-menu',
		li_class:   'spaz-menu-item',
		close_on_any_click: true,
		items_func: function(itemsData){
			var i, iMax, itemData, items = [];
			
			items.push({
				label:   $L('@Reply'),
				handler: function(e, data) {
					Spaz.postPanel.prepReply(screen_name, status_obj.id, status_obj.SC_text_raw);
				},
				data:    {'status_id':status_id}
			});
			
			// add reply to all if more than one name
			if (names.length > 1) {
				items.push({
					label:   $L('@Reply&nbsp;to&nbsp;all'),
					handler: function(e, data) {
						Spaz.postPanel.prepReply(names, status_obj.id, status_obj.SC_text_raw);
					},
					data:    {'status_id':status_id}
				});
			}

			return items;
		}
	});
	
	menu.show(event);
};

/**
 * this onReady binds clicks on the appropriate elements to the menu creation method
 */
jQuery(document).ready(function(){    
	jQuery('.status-action-reply').live('click', function(e) {
		
		var tweet_id = $(this).attr('entry-id');
		var ReplyMenu = new Spaz.ReplyMenu();
		
		Spaz.TweetsModel.getById(
			tweet_id,
			false,
			function(data) {
				sch.debug("data:"+sch.enJSON(data));
				
				var resp = Spaz.TweetsModel.getScreenNamesFromStatus(data);
				
				if (resp.names.length > 1) {
					ReplyMenu.createAndShow(e, resp.screen_name, resp.names, data);
				} else {
					Spaz.postPanel.prepReply(resp.screen_name, data.id, data.SC_text_raw||data.text);
				}
			}
		);
	});
});