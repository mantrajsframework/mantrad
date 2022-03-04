/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const FsExtra = require("fs-extra");

module.exports = {
    async ExistsDatabase(sqlEntities) {
        return FsExtra.pathExists( sqlEntities.DatabaseConfig.databasepath );
    }
}