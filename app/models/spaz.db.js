if (!Spaz.DB) Spaz.DB = {};

var SPAZ_DB_NAME = "spaz.db";
var TABLE_READ_ENTRIES = 'read_entries_1';
var TABLE_READ_DMS = 'read_dms_1';

/***********
Spaz.DB takes care of persisting a portion of the application state
***********/

/**
 * Initialize the runtime of the DB. If the database does not exist it is created
 * and then a global connection is made available for the life time of the
 * application's runtime.
 */
Spaz.DB.init = function() {
	var spazDB = air.File.applicationStorageDirectory.resolvePath(SPAZ_DB_NAME);
	var conn = new air.SQLConnection();
	var create;

	// The initializer
	var initListener = function() {
		sch.debug("Creating "+TABLE_READ_ENTRIES+" table if necessary : " + conn.connected);
		create = new air.SQLStatement();
		create.text =
		"CREATE TABLE IF NOT EXISTS "+TABLE_READ_ENTRIES+" (entry_id VARCHAR(32) PRIMARY KEY)";
		create.sqlConnection = conn;
		create.execute();

		sch.debug("Creating "+TABLE_READ_DMS+" table if necessary : " + conn.connected);
		create = new air.SQLStatement();
		create.text =
		"CREATE TABLE IF NOT EXISTS "+TABLE_READ_DMS+" (entry_id VARCHAR(32) PRIMARY KEY)";
		create.sqlConnection = conn;
		create.execute();
	};
	
	conn.addEventListener(air.SQLEvent.OPEN, initListener);

	sch.debug("Opening database");
	conn.openAsync(spazDB);

	// Save connection for later reuse, for now I am supposing that a conn is thread safe...
	Spaz.DB.conn = conn;
};

/**
 * Mark an entry as read using the provided entry id. The entry id must be
 * an integer which is the value of the id returned by Twitter.
 */
Spaz.DB.markEntryAsRead = function(entryId, is_dm) {
	var conn = Spaz.DB.conn;
	var table = TABLE_READ_ENTRIES;	

	
	if (conn.connected) {
		// We insert the value only if it does not exist already (otherwise will have an SQL error due to the existing PK)
		Spaz.DB.asyncGetAsRead(entryId, is_dm, function(data) {
			if (!data) {
				if (is_dm) {
					table = TABLE_READ_DMS;
				}
				sch.debug("Marking as read entry " + entryId);
				var markAsReadSt = new air.SQLStatement();
				sch.debug('USING '+table+" for entryId "+entryId);
				markAsReadSt.text = "INSERT INTO "+table+" (entry_id) VALUES (:entryId)";
				markAsReadSt.parameters[":entryId"] = entryId;
				markAsReadSt.sqlConnection = conn;
				try {
					markAsReadSt.execute();
				} catch (error) {
					sch.error("Failed to mark '"+entryId+"' as read:", error);
					sch.error(error.message);
					sch.error(error.details);
				}
			}
		});
	}
};



Spaz.DB.isRead = function(entryId, is_dm) {
	
	var table = TABLE_READ_ENTRIES;	
	var conn = Spaz.DB.getSyncConnection(air.SQLMode.READ);
	if (conn.connected) {
		
		if (is_dm) { table = TABLE_READ_DMS; }
		
		var stmt = new air.SQLStatement();
		sch.debug('USING '+table+" for entryId "+entryId);
		stmt.text = "SELECT entry_id FROM "+table+" WHERE entry_id=:entryId";
		stmt.parameters[":entryId"] = entryId;
		stmt.sqlConnection = conn;
		try {			
			stmt.execute();
			var result = stmt.getResult(); // we can't read the result until we assign it to a var
			sch.debug("Result for "+entryId+":"+JSON.stringify(result));
			if (result.data) {
				sch.debug("result.data for "+entryId+":"+JSON.stringify(result.data));
				return result.data.length > 0;
			} else {
				return false;
			}
		} catch (error) {
			sch.error("Failed to find out if entry '"+entryId+"' is read:", error);
			sch.error(error.message);
			sch.error(error.details);
			return false; // we return 0, assuming it is not read
		}
	}

	sch.error('Could not connect');
	return -1;
};

/* Check against the database if the entry should be marked as read or not. The first argument is the entry id which must
 * be an integer and the second argument is the callback function made once it has been determined if the entry should be marked as
 * read or not. The callback function takes as unique argument a boolean value which is true if the entry should be marked as read.
 */
Spaz.DB.asyncGetAsRead = function(entryId, is_dm, callback) {
	var table = TABLE_READ_ENTRIES;	
	if (is_dm) {
		table = TABLE_READ_DMS;
	}
	var conn = Spaz.DB.conn;
	if (conn.connected)
	{
		sch.debug("Read read entry status " + entryId);
		var markAsReadSt = new air.SQLStatement();
		var callbackAdapter = function(event) {
			markAsReadSt.removeEventListener(air.SQLEvent.RESULT, callbackAdapter);
			markAsReadSt.removeEventListener(air.SQLErrorEvent.ERROR, errorHandler);
			var data =  markAsReadSt.getResult().data;
			sch.debug("Entry status of " + entryId + " read=" + sch.enJSON(data));

			callback.call(this, data);
		};
		var errorHandler = function(event) {
			sch.debug("Async get read for entry id " + entryId + " failed " + event.error);
		};
		markAsReadSt.addEventListener(air.SQLEvent.RESULT, callbackAdapter);
		markAsReadSt.addEventListener(air.SQLErrorEvent.ERROR, errorHandler);
		sch.debug('USING '+table+" for entryId "+entryId);
		markAsReadSt.text = "SELECT entry_id FROM "+table+" WHERE entry_id=:entryId";
		markAsReadSt.parameters[":entryId"] = entryId;
		markAsReadSt.sqlConnection = conn;
		markAsReadSt.execute();
	}
};

/**
 * Open a database in synchronous mode and return the SQLConnection
 * @param   mode The mode in which to open the database: any of the
 *          constants defined in the AIR SQLMode class.
 * @returns An active synchronous connection to the database, or false
 *          if unable to connect.
 */
Spaz.DB.getSyncConnection = function(mode) {
	var spazDB = air.File.applicationStorageDirectory.resolvePath(SPAZ_DB_NAME);
	var conn = new air.SQLConnection();

	try {
		conn.open(spazDB, mode);
		return conn;
	} catch (error)	{
		sch.error("Failed to open database in sync mode:", error);
		return false;
	}
};

