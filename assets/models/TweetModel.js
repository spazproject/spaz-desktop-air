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
	},
	recordMethods: {
		send: function() {
			//code to send tweet
			}
	},
	modelMethods: {
		saveTweet : function(obj) {			
			/*
				we clone to avoid modifying the original object we passed in by ref
			*/
			thisobj = sch.clone(obj);
			
			if (this.tweetExists(thisobj.id)) {
				return false;
			}
			
			if (thisobj.SC_is_dm) {
				return false;
			}
			
			var user_id = TwUserModel.findOrCreate(thisobj.user);
			delete thisobj.user;

			thisobj.twitter_id = thisobj.id;
			delete thisobj.id;
		
			thisobj.user_id = user_id;

			return this.create(thisobj);
		},
		tweetExists : function(twitter_id) {
			var count = this.count('twitter_id = ' + twitter_id);
			if (count > 0) {
				return true;
			} else {
				return false;
			}
		},
		getById : function(twitter_id) {
			return this.findBy('twitter_id', twitter_id, 1);
		}
	}
});



// u = User.create({name: "dummy", twitter_id: 22});
// t = u.newTweet();
// t.text = "this is the text of my tweet";
// t.save();
// t.send();
