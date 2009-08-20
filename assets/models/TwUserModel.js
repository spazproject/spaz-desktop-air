var TwUserModel = new JazzRecord.Model({
	table: "twusers",
	foreignKey: "user_id",
	hasMany: {
		tweets: "tweets"
	},
	columns: {
		profile_sidebar_border_color: "string",
		description: "text",
		utc_offset: "integer",
		following: "bool",
		profile_text_color: "string",
		profile_background_image_url: "string",
		followers_count: "integer",
		url: "string",
		profile_image_url: "string",
		name: "string",
		statuses_count: "integer",
		profile_link_color: "string",
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
		time_zone: "string"
	},
	recordMethods: {
		newTweet: function() {
			return Tweet.newRecord({
				user_id: this.id
			});
		}
	},

	modelMethods: {
		userExists: function(screen_name, return_id) {
			if (return_id) {
				var user = this.findBy('screen_name', screen_name);
				if (user) {
					return user.id;
				} else {
					return false;
				}
			} else {
				var count = this.count('screen_name LIKE ' + '\'' + screen_name + '\'');
				if (count > 0) {
					return true;
				} else {
					return false;
				}
			}
		},

		userExistsId: function(twitter_id, return_id) {
			if (return_id) {
				sch.dump("return user_id for "+twitter_id);
				var user = this.findBy('twitter_id', twitter_id);
				sch.dump(user);
				if (user) {
					return user.id;
				} else {
					return false;
				}
			} else {
				var count = this.count('twitter_id = ' + twitter_id);
				if (count > 0) {
					return true;
				} else {
					return false;
				}
			}
		},

		/**
		 * given a user object, return the id if it exists, or create a new record
		 * and return that id 
		 */
		findOrCreate: function(userobj) {
			var user_id;
			sch.dump("findOrCreate "+userobj.id);
			if ((user_id = this.userExistsId(userobj.id, true))) {
				return user_id;
			} else {
				userobj.twitter_id = userobj.id;
				delete userobj.id;
				return this.create(userobj).twitter_id;
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
	}
});