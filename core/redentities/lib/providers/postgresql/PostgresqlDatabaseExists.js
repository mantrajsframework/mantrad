/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    async ExistsDatabase(sqlEntities) {
        let sql = sqlEntities.Adaptors.Formatters.FormatShowDatabase( sqlEntities.DatabaseConfig.database );
        let result = await sqlEntities.RunQuery(sql);

        return result.length == 1;
    }
}