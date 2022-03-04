/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Sqlite = require("sqlite3");

module.exports = {
    CreateDatabase: async (databaseName, formatters, connector, databaseConfig) => {
        await createEmptyFile(databaseConfig.databasepath);
        // Next query force to create db file with sqlite database structure, not an empty file
        
        return connector.RunQuery( databaseConfig, "create table t(f int); drop table t;" );
    }
}

async function createEmptyFile(databasepath) {
    return new Promise((res, rej) => {
        new Sqlite.Database(databasepath, (err) => {
            if (err) {
                return rej(err);
            }
            res();
        });
    });
}