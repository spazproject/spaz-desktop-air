Spaz.Conversation = {
	'build' : function(base_id) {
		var convo_array = [], added_ids = [];
		
		sch.error("Retrieving base_id "+base_id);
		Spaz.Data.getTweet(base_id, this.trigger, onRetrieved);
		
		
		
		function onRetrieved(status_obj) {		
			
			if (!status_obj.twitter_id) { // this must have been retrieved from Twitter				
				/*
					Save to DB via JazzRecord
				*/
				TweetModel.saveTweet(status_obj);
			}
			
			sch.debug("Retrieved "+status_obj.twitter_id+"================================");
			sch.debug("ID: "+status_obj.twitter_id);
			sch.debug("IRT:"+status_obj.in_reply_to_status_id);
			sch.debug("TXT:"+status_obj.SC_text_raw);
			sch.debug("===================================================================");
			
			if (added_ids.indexOf(status_obj.twitter_id) !== -1) {
				sch.error("This id has already been retrieved")
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
				status_obj.SC_thumbnail_urls = sui.getThumbsForUrls(status_obj.SC_text_raw);
				status_obj.text = sc.helpers.makeClickable(status_obj.SC_text_raw, SPAZ_MAKECLICKABLE_OPTS);
				status_obj.text = Emoticons.SimpleSmileys.convertEmoticons(status_obj.text);
				
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