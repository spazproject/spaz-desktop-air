Spaz.Conversation = {
	'build' : function(base_id) {
		var convo_array = [], added_ids = [];
		
		sch.error("Retrieving base_id "+base_id);
		Spaz.Data.getTweet(base_id, this.trigger, onRetrieved);
		
		
		
		function onRetrieved(status_obj) {		
			
			sch.error("Retrieved "+status_obj.twitter_id);
			sch.error('in_reply_to_status_id:'+status_obj.in_reply_to_status_id);
			
			if (added_ids.indexOf(status_obj.twitter_id) !== -1) {
				sch.error("This id has already been retrieved")
				renderConversation();
				return;
			} else {
				convo_array.push(status_obj);
				added_ids.push(status_obj.twitter_id);

				sch.error("conversation length is now "+convo_array.length);
				sch.error("added_ids: "+added_ids.toString());

				if (status_obj.in_reply_to_status_id
						&& (added_ids.indexOf(status_obj.in_reply_to_status_id) === -1)
						&& (status_obj.in_reply_to_status_id != status_obj.twitter_id)
						) {
					Spaz.Data.getTweet(status_obj.in_reply_to_status_id, this.trigger, onRetrieved);
				} else {
					renderConversation();
					return;
				}				
			}
		}
		
		function renderConversation() {
			
			var container = $('#conversationWindow .timeline-conversation');
			
			container.empty();
			
			for (var i=0; i < convo_array.length; i++) {
				var status_obj  = convo_array[i];
				sch.error("Adding "+status_obj.twitter_id);
				status_obj.db_id = status_obj.id;
				status_obj.id    = status_obj.twitter_id;
				var status_html  = Spaz.Templates.timeline_entry(status_obj);
				container.append(status_html);
			};
			
			sc.helpers.updateRelativeTimes('#conversationWindow a.status-created-at', 'data-created-at');
			
			openPopboxInline('#conversationWindow');
			
			
		}
		
	}
};