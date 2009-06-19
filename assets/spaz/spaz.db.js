if (!Spaz.DB) Spaz.DB = {};

const SPAZ_DB_NAME = "spaz.db";

/***********
Spaz.DB takes care of persisting a portion of the application state
***********/

/* Initialize the runtime of the DB. If the database does not exist it is created and then a global connection is made available
 * for the life time of the application's runtime.
 */
Spaz.DB.init = function() {
	var spazDB = air.File.applicationStorageDirectory.resolvePath(SPAZ_DB_NAME);
	var conn = new air.SQLConnection();

	// The initializer
	var initListener = function() {
		air.trace("Creating read_entries table if necessary : " + conn.connected);
		var create = new air.SQLStatement();
		create.text =
		"CREATE TABLE IF NOT EXISTS read_entries (entry_id INTEGER PRIMARY KEY)";
		create.sqlConnection = conn;
		create.execute();

		air.trace("Creating users table if necessary : " + conn.connected);
		var create2 = new air.SQLStatement();
		create2.text =
		"CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY)";
		create2.sqlConnection = conn;
		create2.execute();

		var nbrUsers = Spaz.DB.getUserCount();
		air.trace("nbr users: " + nbrUsers);
	};
	conn.addEventListener(air.SQLEvent.OPEN, initListener);

	air.trace("Opening database");
	conn.openAsync(spazDB);

	// Save connection for later reuse, for now I am supposing that a conn is thread safe...
	Spaz.DB.conn = conn;
}

/* Mark an entry as read using the provided entry id. The entry id must be an integer which is the value of the id returned
 * by Twitter.
 */
Spaz.DB.markEntryAsRead = function(entryId) {
	var conn = Spaz.DB.conn;
	if (conn.connected)
	{
		// We insert the value only if it does not exist already (otherwise will have an SQL error due to the existing PK)
		Spaz.DB.asyncGetAsRead(entryId, function(read) {
			if (!read) {
				// air.trace("Marking as read entry " + entryId);
				var markAsReadSt = new air.SQLStatement();
				markAsReadSt.text = "INSERT INTO read_entries (entry_id) VALUES (:entryId)";
				markAsReadSt.parameters[":entryId"] = entryId;
				markAsReadSt.sqlConnection = conn;
				markAsReadSt.execute();
			}
		});
	}
}

/* Check against the database if the entry should be marked as read or not. The first argument is the entry id which must
 * be an integer and the second argument is the callback function made once it has been determined if the entry should be marked as
 * read or not. The callback function takes as unique argument a boolean value which is true if the entry should be marked as read.
 */
Spaz.DB.asyncGetAsRead = function(entryId, callback) {
	var conn = Spaz.DB.conn;
	if (conn.connected)
	{
		// air.trace("Read read entry status " + entryId);
		var markAsReadSt = new air.SQLStatement();
		var callbackAdapter = function(event) {
			markAsReadSt.removeEventListener(air.SQLEvent.RESULT, callbackAdapter);
			markAsReadSt.removeEventListener(air.SQLErrorEvent.ERROR, errorHandler);
			var read =  markAsReadSt.getResult().data != null;
			// air.trace("Entry status of " + entryId + " read=" + read);

			callback.call(this, read);
		};
		var errorHandler = function(event) {
			air.trace("Async get read for entry id " + entryId + " failed " + event.error);
		};
		markAsReadSt.addEventListener(air.SQLEvent.RESULT, callbackAdapter);
		markAsReadSt.addEventListener(air.SQLErrorEvent.ERROR, errorHandler);
		markAsReadSt.text = "SELECT entry_id FROM read_entries WHERE entry_id=:entryId";
		markAsReadSt.parameters[":entryId"] = entryId;
		markAsReadSt.sqlConnection = conn;
		markAsReadSt.execute();
	}
}

/**
 * How many users are registered with Spaz? Uses a synchronous database
 * connection.
 * @returns The number of users registered with Spaz; -1 if unable
 *          to retrieve the count.
 */
Spaz.DB.getUserCount = function() {
	var spazDB = air.File.applicationStorageDirectory.resolvePath(SPAZ_DB_NAME);
	var localConn = new air.SQLConnection();

	try {
		localConn.open(spazDB, air.SQLMode.READ);
	} catch (error)	{
		Spaz.dump("Failed to open database:", error.message);
		Spaz.dump("Details:", error.details);
		return -1;
	}

	if (localConn.connected) {
		var sql = new air.SQLStatement();
		sql.text = "SELECT count(*) FROM users";
		sql.sqlConnection = localConn;
		try {
			sql.execute();
			return sql.getResult().data[0]["count(*)"];
		} catch (error) {
			Spaz.dump("Failed to retrieve user count:", error.message);
			Spaz.dump("Details:", error.details);
			return -1;
		}
	}

	return -1;
}

/**
 * Get a list of all users registered with Spaz. Uses a synchronous
 * database connection.
 * @returns An array containing a sorted list of usernames registered
 *          with Spaz; NULL if unable to retrieve the list.
 */
Spaz.DB.getUserList = function() {
	var spazDB = air.File.applicationStorageDirectory.resolvePath(SPAZ_DB_NAME);
	var localConn = new air.SQLConnection();

	try {
		localConn.open(spazDB, air.SQLMode.READ);
	} catch (error)	{
		Spaz.dump("Failed to open database:", error.message);
		Spaz.dump("Details:", error.details);
		return null;
	}

	if (localConn.connected) {
		var sql = new air.SQLStatement();
		sql.text = "SELECT name FROM users ORDER BY 1";
		sql.sqlConnection = localConn;
		try {
			sql.execute();
			var result = sql.getResult();
			var list = new Array();
			for (i = 0; i < result.data.length; i++) {
				list[i] = result.data[i]["name"];
			}
			return list;
		} catch (error) {
			Spaz.dump("Failed to retrieve user list:", error.message);
			Spaz.dump("Details:", error.details);
			return null;
		}
	}

	return null;
}

/**
 * Add/remove a user from the table of registered users.
 * @param action   The action to perform: "add" or "remove".
 * @param username The Twitter username to add/remove
 * @param callback A callback function to receive the result of the
 *                 request: true if successful, false if not.
 * @returns void
 */
Spaz.DB.maintainUser = function(action, username, callback) {
	var conn = Spaz.DB.conn;
	if (conn.connected)	{
		var sql = new air.SQLStatement();

		var onResult = function(event) {
			var read = sql.getResult().data != null;
			callback.call(this, read);
		};

		var onError = function(event) {
			Spaz.dump("Failed to " + action + " user " +  username + ":", error.message);
			Spaz.dump("Details:", error.details);
			callback.call(this, false);
		};

		sql.addEventListener(air.SQLEvent.RESULT, onResult);
		sql.addEventListener(air.SQLErrorEvent.ERROR, onError);

		switch(action) {
		case "add":
			sql.text = "INSERT INTO users (name) VALUES(name=:name)";
			break;
		case "remove":
			sql.text = "DELETE FROM users WHERE name=:name";
			break;
		default:
			Spaz.dump("Invalid action (" + action + ") sent to Spaz.DB.maintainUser");
			sql.text = "this will fail";
		}

		sql.parameters[":name"] = username;
		sql.sqlConnection = conn;
		sql.execute();
	}
}