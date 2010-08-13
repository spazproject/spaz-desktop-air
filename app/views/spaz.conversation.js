Spaz.Conversation = {
	
	'initWindow' : function() {
		var container = $('#timeline-conversation');
		Spaz.UI.openPopboxInline('#conversationWindow');
		container.html('<div class="loading">Loading…</div>');
	},
	
	'build' : function(base_id) {
		var convo_array = [], added_ids = [];
		
		Spaz.Conversation.initWindow();

		sch.debug("==========Retrieving base_id "+base_id+' =======================');
		Spaz.Data.getTweet(base_id, this.trigger, onRetrieved);
		
		
		
		function onRetrieved(status_obj) {		
			
			sch.debug('Retrieved Status Object: --------------------');
			sch.debug(status_obj);
			sch.debug('---------------------------------------------');
			
			
			sch.debug("Retrieved "+status_obj.id);

			if (added_ids.indexOf(status_obj.id) !== -1) {
				sch.debug("This id has already been retrieved");
				renderConversation();
				return;
			} else {
				/*
					prep for display
				*/
				var sui = new SpazImageURL();
				/*
					to ensure we don't accidentally double-encode some stuff, use SC_text_raw as our base value
				*/
				
				sch.debug('prepping text:'+status_obj.SC_text_raw);
				sch.debug('finished text:'+status_obj.text);
				
				status_obj.SC_thumbnail_urls = sui.getThumbsForUrls(status_obj.SC_text_raw);
				status_obj.text = sc.helpers.makeClickable(status_obj.SC_text_raw, SPAZ_MAKECLICKABLE_OPTS);
				status_obj.text = Emoticons.SimpleSmileys.convertEmoticons(status_obj.text);
				
				convo_array.push(status_obj);
				added_ids.push(status_obj.id);

				sch.debug("conversation length is now "+convo_array.length);
				sch.debug("added_ids: "+added_ids.toString());

				if (status_obj.in_reply_to_status_id
						&& (added_ids.indexOf(status_obj.in_reply_to_status_id) === -1)
						&& (status_obj.in_reply_to_status_id != status_obj.id)
						) {
					Spaz.Data.getTweet(status_obj.in_reply_to_status_id, this.trigger, onRetrieved);
				} else {
					renderConversation();
					return;
				}				
			}
		}
		
		function renderConversation() {
			
			var container = $('#timeline-conversation');
			
			container.empty();
			
			for (var i=0; i < convo_array.length; i++) {
				var status_obj  = convo_array[i];
				sch.debug("Adding "+status_obj.id);
				status_obj.db_id = status_obj.id;
				status_obj.id    = status_obj.id;
				var status_html  = Spaz.Templates.timeline_entry(status_obj);
				container.append(status_html);
			};

			sc.helpers.updateRelativeTimes('a.status-created-at', 'data-created-at');
		}
		
	}
};