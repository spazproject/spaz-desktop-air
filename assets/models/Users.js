var User = new JazzRecord.Model({
  table: "users",
  foreignKey: "user_id",
  hasMany: {tweets: "tweets"},
  columns: {
    profile_sidebar_border_color:"string",
    description:"text",
    utc_offset: "integer",
    following: "bool",
    profile_text_color: "string",
    profile_background_image_url: "string",
    followers_count: "integer",
    url: "string",
    profile_image_url:"string",
    name:"string",
    statuses_count: "integer",
    profile_link_color:"string",
    protected: "bool",
    notifications: "bool",
    profile_background_tile: "bool",
    created_at: "string",
    friends_count: "integer",
    screen_name: "string",
    profile_background_color: "string",
    favourites_count: "integer",
    verified: "bool",
    profile_sidebar_fill_color: "string",
    location: "string",
    twitter_id: "integer",
    time_zone:"string"
  },
  recordMethods: {
	userExists: function(screen_name) {
		var count = this.count('screen_name LIKE '+'\''+screen_name+'\'');
		if (count > 0) {
			return true;
		} else {
			return false;
		}
	},
	getUserById: function(twitter_id) {
		return this.findBy('twitter_id', twitter_id);
	},
	getUser: function(screen_name) {
		return this.findBy('screen_name', screen_name);
	},
	getTweetsByUser: function(screen_name) {
		var user = this.getUser(screen_name);
		return user.load('Tweets', 1);
	},
    newTweet: function() {
	
      return Tweet.newRecord({user_id: this.id});
    }
  }
});