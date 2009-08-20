var Tweet = new JazzRecord.Model({
  table: "tweets",
  belongsTo: {user: "users"},
  columns: {
    user_id: "integer",
    favorited: "bool",
    in_reply_to_user_id: "integer",
    in_reply_to_screen_name: "string",
    text: "text",
    created_at: "string",
    truncated: "bool",
    twitter_id: "integer",
    in_reply_to_status_id: "integer",
    source: "string",
    SC_timeline_from: "string",
    SC_user_received_by: "string",
    SC_is_reply: "bool",
    SC_created_at_unixtime: "integer",
    SC_text_raw: "text",
    SC_retrieved_unixtime: "integer",
    isSent: "bool"
  },
  recordMethods: {
	saveTweet: function(obj) {
		
	},
    send: function() {
      //code to send tweet
    }
  }
});



// u = User.create({name: "dummy", twitter_id: 22});
// t = u.newTweet();
// t.text = "this is the text of my tweet";
// t.save();
// t.send();