if (!Spaz.DB) Spaz.DB = {};

/***********
Spaz.DB takes care of persisting a portion of the application state
***********/

/* Initialize the runtime of the DB. If the database does not exist it is created and then a global connection is made available
 * for the life time of the application's runtime.
 */
Spaz.DB.init = function() {

	var spazDB = air.File.applicationStorageDirectory.resolvePath("spaz.db");
	var conn = new air.SQLConnection();

	// The initializer 
	var initListener = function() {
		air.trace("Creating read_entries table if necessary : " + conn.connected);
		var create = new air.SQLStatement();
		create.text = 
		"CREATE TABLE IF NOT EXISTS read_entries (" +
		"entry_id INTEGER PRIMARY KEY" +
		")";
		create.sqlConnection = conn;
		create.execute();
	};
	conn.addEventListener(air.SQLEvent.OPEN, initListener);

	//
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