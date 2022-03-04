/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    RemoveDatabase: async (databaseName, formatters, connector, databaseConfig) => {
        const sql = formatters.FormatDropDatabase( databaseName );

        // Note: remove a new database should be done with new connection
        return connector.RunQueryOwnConnection( databaseConfig, sql );
    }
}