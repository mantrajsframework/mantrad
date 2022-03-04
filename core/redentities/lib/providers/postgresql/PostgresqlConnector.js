/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const { Pool, Client } = require("pg");
const DEFAULT_POSTGRES_PORT = 5432;

var DatabasePool = [];

module.exports = {
    ClearPool: async () => {
        // Postgres maintain open database connections in pool, so for Postgres tests,
        // each "before" removes and creates de database again and previous pools should be ended.
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
            DatabasePool[databaseConfig.database] = new Pool({
                user: databaseConfig.user,
                host: databaseConfig.host,
                database: databaseConfig.database,
                password: databaseConfig.password,
                port: databaseConfig.port ? databaseConfig.port : DEFAULT_POSTGRES_PORT              
            });
        }        

        const pool = DatabasePool[databaseConfig.database];

        const result = await pool.query( sqlQuery );

        return JSON.parse(JSON.stringify(result)).rows;
    },
    
    /*
     * Run a query in its own connection. Connection to postgres database is open and closed
     */
    RunQueryOwnConnection: async (databaseConfig, sql) => {
        const client = new Client({
            user: databaseConfig.user,
            host: databaseConfig.host,
            database: "",
            password: databaseConfig.password,
            port: databaseConfig.port ? databaseConfig.port : DEFAULT_POSTGRES_PORT              
        });

        await client.connect();
        const result = await client.query(sql);
        await client.end();
        return result;
   }
}