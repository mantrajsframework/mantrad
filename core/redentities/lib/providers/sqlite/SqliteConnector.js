/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Sqlite = require("sqlite3");

module.exports = {
    /*
     * Runs a query
     * Returns the result of the query
     */
    RunQuery: async (databaseConfig, sqlQuery) => {
        let db = await CreateSqliteDatabaseInstance(databaseConfig);

        return new Promise( (resolve, reject) => {
            db.all( sqlQuery, (err, result) => {
                if ( !!err ) { db.close(); reject(err); }
                else {
                    result = result ? result : [];
                    db.close();
                    resolve( JSON.parse(JSON.stringify(result)) );
                }
            });
        });
    },

    /*
     * Run a query in its own connection. Connection to sqlite database is open and closed.
     * In sqlite connector, all access has its own connections (it is open and closed in each sql sentence)
     */
    RunQueryOwnConnection: async (databaseConfig, sqlQuery) => {
        return this.RunQuery( databaseConfig, sqlQuery );
   }
}

async function CreateSqliteDatabaseInstance(databaseConfig) {
    return new Promise((res, rej) => {
        let db = new Sqlite.Database(databaseConfig.databasepath, Sqlite.OPEN_READWRITE, (err) => {
            if (err) return rej(err);
            
            res(db);
        });
    })
}