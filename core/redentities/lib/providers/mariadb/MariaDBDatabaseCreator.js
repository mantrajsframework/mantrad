/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    CreateDatabase: async (databaseName, formatters, connector, databaseConfig) => {
        let sql = formatters.FormatCreateDatabase( databaseName );

        // Note: remove a new database should be done with new connection
        return connector.RunQueryOwnConnection( databaseConfig, sql );
    }
}