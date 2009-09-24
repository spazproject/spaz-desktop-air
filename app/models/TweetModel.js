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
				sch.dump('Tweet '+thisobj.id+' exists');
				return false;
			}
			
			if (thisobj.SC_is_dm) {
				sch.dump('Tweet '+thisobj.id+' is DM');
				return false;
			}
			
			sch.dump('adding user');
			
			var user_id = TwUserModel.findOrCreate(thisobj.user);
			thisobj.user_id = user_id;
			sch.dump('user_id:'+user_id);
			delete thisobj.user;

			thisobj.twitter_id = thisobj.id;
			delete thisobj.id;
			sch.dump('userid:'+thisobj.twitter_id);
			
			sch.dump(thisobj);

			return this.create(thisobj);
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
		}
	}
});



// u = User.create({name: "dummy", twitter_id: 22});
// t = u.newTweet();
// t.text = "this is the text of my tweet";
// t.save();
// t.send();
