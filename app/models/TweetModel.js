var TweetModel = new JazzRecord.Model({
	table: "tweets",
	belongsTo: {
		user: "twusers"
	},
	columns: {
		user_id: "int",
		favorited: "bool",
		in_reply_to_user_id: "int",
		in_reply_to_screen_name: "string",
		text: "text",
		created_at: "string",
		truncated: "bool",
		twitter_id: "int",
		in_reply_to_status_id: "int",
		source: "string",
		SC_timeline_from: "string",
		SC_user_received_by: "string",
		SC_is_reply: "bool",
		SC_created_at_unixtime: "int",
		SC_text_raw: "text",
		SC_retrieved_unixtime: "int",
		isSent: "bool"
		// isRead: "bool"
	},
	recordMethods: {
		send: function() {
			//code to send tweet
		},
		markRead : function() {
			this.isRead = true;
			this.save();
		}
	},
	modelMethods: {
		saveTweet : function(obj) {
			/*
				we clone to avoid modifying the original object we passed in by ref
			*/
			thisobj = sch.clone(obj);
			
			if (this.tweetExists(thisobj.id)) {
				sch.debug('Tweet '+thisobj.id+' exists'); 
				return this.getById(thisobj.id); // .id is twitter_id
			}
			
			if (thisobj.SC_is_dm) {
				sch.error('Tweet '+thisobj.id+' is DM');
				return false;
			}
			
			sch.debug('adding user');
			
			var user_id = TwUserModel.updateOrCreate(thisobj.user);
			thisobj.user_id = user_id;
			sch.debug('user_id:'+user_id);
			delete thisobj.user;

			thisobj.twitter_id = thisobj.id;
			delete thisobj.id;
			sch.debug('twitter_id:'+thisobj.twitter_id);
			
			this.create(thisobj);
			return this.getById(thisobj.twitter_id);
		},
		tweetExists : function(twitter_id) {
			
			var rs = this.all({
				select:"twitter_id",
				conditions:"twitter_id = "+twitter_id,
				limit:1
			});
			
			if (rs) {
				return true;
			} else {
				return false;
			}
		},
		getById : function(twitter_id) {
			return this.findBy('twitter_id', twitter_id, 1);
		},
		markRead : function(twitter_id) {
			var msg = this.getById(twitter_id);
			msg.markRead();
		}
	}
});



// u = User.create({name: "dummy", twitter_id: 22});
// t = u.newTweet();
// t.text = "this is the text of my tweet";
// t.save();
// t.send();
