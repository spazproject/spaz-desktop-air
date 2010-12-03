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
			    var screenname = data.user.screen_name;
				var names = sc.helpers.extractScreenNames(data.SC_text_raw);
				
				sch.debug('names for reply 2 are:'+names);
				
				if (names.length >= 1) {
    			    var screenname_exists = false;
    				sch.debug('names for reply are:'+names);

    				for (var i=0; i < names.length; i++) {
    				    if (names[i].toLowerCase() == screenname.toLowerCase()) {
    				        screenname_exists = true;
    				    }
    				    // remove references to current username
    				    if (names[i].toLowerCase() == Spaz.Prefs.getUsername()) {
    				        names.splice(i, 1);
    				    }
    				}

    				// add screenname if it is not in the message
    				if (!screenname_exists) {
    				    names.unshift(screenname);
    				}
    				sch.debug('names for reply 2 are:'+names);

					if (names.length > 1) {
						ReplyMenu.createAndShow(e, screenname, names, data);
					} else {
						Spaz.postPanel.prepReply(screenname, data.id, data.SC_text_raw);
					}
					
					
				} else {
					Spaz.postPanel.prepReply(data.user.screen_name, data.id, data.SC_text_raw);
				}
				
			}
		);
	});
});