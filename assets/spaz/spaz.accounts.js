if (!Spaz.Accounts) Spaz.Accounts = {};

/**
 * Handles multiple account manipulation. Spaz provides fast account switching,
 * NOT tracking tweets for multiple accounts at the same time.
 */

/**
 * Check whether this is the first time this user has hit the multiple account
 * function. If so, performs transition tasks.
 * @returns void
 */
Spaz.Accounts.checkForFirstTimeUse = function() {
	if (Spaz.DB.getUserCount() == 0) {
		air.trace("Attempting to add initial user: " + Spaz.Prefs.user);
		if (!Spaz.Accounts.addUser(Spaz.Prefs.user)) {
			air.trace("Failed to add initial user " + Spaz.Prefs.user);
			Spaz.dump("Failed to add initial user " + Spaz.Prefs.user);
		}
	}
}

/**
 * Add a Twitter username to Spaz.
 * @param username The Twitter username to add.
 * @returns true if action is successful; otherwise false;
 */
Spaz.Accounts.addUser = function(user) {
	if (Spaz.DB.maintainUser("add", user)) {
		return true;
	} else {
		return false;
	}
}

/**
 * Remove a Twitter username from Spaz.
 * @param username The Twitter username to remove.
 * @returns true if action is successful; otherwise false;
 */
Spaz.Accounts.removeUser() = function(user) {
	if (Spaz.DB.maintainUser("remove", user)) {
		return true;
	} else {
		return false;
	}
}