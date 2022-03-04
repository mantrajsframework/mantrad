/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const FsExtra = require("fs-extra");

module.exports = {
    RemoveDatabase: async (databaseName, formatters, connector, databaseConfig) => {
        let existsFile = await FsExtra.pathExists( databaseConfig.databasepath );

        if ( existsFile ) {
            await FsExtra.remove( databaseConfig.databasepath );
        }
    }
}