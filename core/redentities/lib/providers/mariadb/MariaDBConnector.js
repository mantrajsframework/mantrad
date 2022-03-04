/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MariaDB = require("mariadb");

var DatabasePool = [];

module.exports = {
    ClearPool: async () => {
        for( const poolName of Object.keys(DatabasePool) ) {
            await DatabasePool[poolName].end();
        } 
        
        DatabasePool = [];
    },

    /*
     * Runs a query using connections in pool
     * Returns the result of the query
     */
    RunQuery: async (databaseConfig, sqlQuery) => {
        if ( DatabasePool[databaseConfig.database] == null ) {
            DatabasePool[databaseConfig.database] = MariaDB.createPool( {
                connectionLimit: 10,
                host: databaseConfig.host,
                user: databaseConfig.user,
                password: databaseConfig.password,
                database: databaseConfig.database
            });  
        }        
        
        let conn;

        try {
            conn = await DatabasePool[databaseConfig.database].getConnection();
            let result = await conn.query( sqlQuery );
    
            return JSON.parse(JSON.stringify(result))
        } catch(err) {
            throw err;
        } finally {
            if ( conn ) conn.end();
        }        
    },
    
    /*
     * Run a query in its own connection. Connection to mysql database is open and closed
     */
    RunQueryOwnConnection: async (databaseConfig, sql) => {
        let conn;

        try {
            conn = await MariaDB.createConnection( {
                host: databaseConfig.host,
                user: databaseConfig.user,
                password: databaseConfig.password
            });

            await conn.query(sql);
        } catch(err) { 
            throw err; 
        } finally {   
            if ( conn ) return conn.end();
        }
   }
}