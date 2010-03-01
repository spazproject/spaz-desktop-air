var TwUserModel = new JazzRecord.Model({
	table: "twusers",
	foreignKey: "user_id",
	hasMany: {
		tweets: "tweets"
	},
	columns: {
		profile_sidebar_border_color: "string",
		description: "text",
		utc_offset: "int",
		following: "bool",
		profile_text_color: "string",
		profile_background_image_url: "string",
		followers_count: "int",
		url: "string",
		profile_image_url: "string",
		name: "string",
		statuses_count: "int",
		profile_link_color: "string",
		protected: "bool",
		notifications: "bool",
		profile_background_tile: "bool",
		created_at: "string",
		friends_count: "int",
		screen_name: "string",
		profile_background_color: "string",
		favourites_count: "int",
		verified: "bool",
		profile_sidebar_fill_color: "string",
		location: "string",
		twitter_id: "int",
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
			var user = this.all({
				select:"id",
				conditions:'screen_name LIKE ' + '\'' + screen_name + '\'',
				limit:1
			});
			
			if (user) {
				if (return_id) {
					return user.id;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},

		userExistsId: function(twitter_id, return_id) {
			var user = this.all({
				select:"id",
				conditions:'twitter_id = ' + twitter_id,
				limit:1
			});
			
			if (user) {
				if (return_id) {
					return user.id;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},

		/**
		 * given a user object, return the id if it exists, or create a new record
		 * and return that id 
		 * @return {integer} the user id
		 */
		findOrCreate: function(userobj) {
			var user_id;
			
			sch.dump(userobj);
			
			user_id = this.userExistsId(userobj.id, true);
			
			if ( user_id ) {
				return user_id;
			} else {
				userobj.twitter_id = userobj.id;
				delete userobj.id;
				return this.create(userobj).id;
			}
		},

		/**
		 * given a user object, return the id if it exists, or create a new record
		 * and return that id 
		 * @return {integer} the user id
		 */
		updateOrCreate: function(userobj) {
			var user_id, olduser, numchanges;
			
			sch.dump(userobj);
			
			user_id = this.userExistsId(userobj.id, true);

			if ( user_id ) { // user_id is the DB record's id, not the twitter id

				userobj.twitter_id = userobj.id;
				delete userobj.id;			
				
				olduser = this.find(user_id);
				numchanges = 0;
				for(var index in userobj) {
					if (olduser[index] && userobj[index] != olduser[index]) {
						olduser[index] = userobj[index];
						numchanges++;
					}
				}
				if (numchanges > 0) {
					olduser.save();
				}
				return user_id;
			} else {
				userobj.twitter_id = userobj.id;
				delete userobj.id;
				return this.create(userobj).id;
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
		
		setScreenName: function(twitter_id, screen_name) {
			var user_id = this.userExistsId(userobj.id, true);
			if (user_id) {
				var user = this.getUserById(user_id);
			}
			user.updateAttribute('screen_name', screen_name);
		}
	}
});