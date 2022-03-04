/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MySql = require("mysql2");

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
            DatabasePool[databaseConfig.database] = MySql.createPool( {
                connectionLimit: 10,
                host: databaseConfig.host,
                user: databaseConfig.user,
                password: databaseConfig.password,
                database: databaseConfig.database
            });  
        }        

        return new Promise( (resolve, reject) => {
            DatabasePool[databaseConfig.database].query( sqlQuery, (err, result) => {
                if ( !!err ) { reject(err); }
                else resolve( JSON.parse(JSON.stringify(result)) );
            });
        });
    },
    
    /*
     * Run a query in its own connection. Connection to mysql database is open and closed
     */
    RunQueryOwnConnection: async (databaseConfig, sql) => {
        const conn = MySql.createConnection( {
            host: databaseConfig.host,
            user: databaseConfig.user,
            password: databaseConfig.password
        });
 
        return new Promise( (resolve, reject) => {
            conn.connect( (err) => {
                if ( err) reject(err);
                else {
                    conn.query( sql, (error) => {
                        if (error) reject(error);
                        else { 
                            conn.end(); 
                            resolve(); }
                    });
                }
            });   
        });
   }
}