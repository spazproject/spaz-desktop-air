if (!Spaz.Accounts) Spaz.Accounts = {};

const ELS_KEY_PW = 'twitter_password_';

/**
 * Handles multiple account manipulation. Spaz provides fast account switching,
 * NOT tracking tweets for multiple accounts at the same time.
 */

/**
 * Check whether this is the first time this user has hit the multiple account
 * function. If so, perform transition tasks.
 * @returns void
 */
Spaz.Accounts.checkForFirstTimeUse = function() {
    if (Spaz.DB.getUserCount() == 0) {
        sch.dump("Attempting to add initial user: " + Spaz.Prefs.user);
        if (!Spaz.Accounts.addUser(Spaz.Prefs.user)) {
            Spaz.dump("Failed to add first time user " + Spaz.Prefs.user);
        }
    }
}

/**
 * Add a Twitter username to Spaz.
 * @param username The Twitter username to add.
 * @returns true if action is successful; otherwise false;
 */
Spaz.Accounts.addUser = function(username) {
    if (Spaz.DB.maintainUser("add", username)) {
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
Spaz.Accounts.removeUser = function(username) {
    if (Spaz.DB.maintainUser("remove", username)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Switch accounts.
 * @param username The Twitter username to switch to.
 * @returns true if successful; false otherwise.
 */
Spaz.Accounts.switchAccount = function(username) {
	var result = true;

	if (username) {
		// Retrieve password
		var pw = Spaz.Accounts.loadAccountPassword(username);
		if (pw) {
			Spaz.Prefs.user = username;
			Spaz.Prefs.pass = pw;
		} else {
			result = false;
		}
		// Switch accounts
		if (switched) {
			result = true;
		}
	}

	return result;
}

/**
 * Save the password for a specified username.
 * @param username The Twitter username for which we're saving the password.
 * @param pw The password to be saved.
 * @returns void
 */
Spaz.Accounts.saveAccountPassword = function(username, pw) {
	if (accountName && pw) {
		Spaz.dump('saving password for account ' + username);
		var bytes = new air.ByteArray();
		bytes.writeUTFBytes(pw);
		air.EncryptedLocalStore.setItem(ELS_KEY_PW + username.toLowerCase(), bytes);
	}
};

/**
 * Retrieve the password for a specified username.
 * @param username The Twitter username for which we're retrieving the password.
 * @returns The password, or false if unable to retreive.
 */
Spaz.Accounts.loadAccountPassword = function(username) {
	Spaz.dump('loading password for account ' + username);
    var storedValue = air.EncryptedLocalStore.getItem(ELS_KEY_PW + username.toLowerCase());
    if (storedValue) {
        return storedValue.readUTFBytes(storedValue.length);
    } else {
        Spaz.dump('Password for account ' + username + ' COULD NOT BE LOADED');
        return false;
    }
};