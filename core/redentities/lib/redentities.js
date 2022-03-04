/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const RedEntitiesConstants = require("./redentitiesconstants");
const SqlEntities = require("./SqlEntities");

class RedEntities {
    constructor(databaseConfig) {
        this.DatabaseConfig = databaseConfig;
    }

    Entities( schema ) {        
        switch( this.DatabaseConfig.provider ) {
            case RedEntitiesConstants.MYSQL_PROVIDER: {
                return new SqlEntities( this.DatabaseConfig, schema, getMysqlAdaptors() );
            }
            case RedEntitiesConstants.SQLITE_PROVIDER: {
                return new SqlEntities( this.DatabaseConfig, schema, getSqliteAdaptors() );
            }
            case RedEntitiesConstants.POSTGRES_PROVIDER: {
                return new SqlEntities( this.DatabaseConfig, schema, getPostgresAdaptors() );
            }
            case RedEntitiesConstants.MARIADB_PROVIDER: {
                return new SqlEntities( this.DatabaseConfig, schema, getMariaDBAdaptors() );
            }

            default: throw new Error( `Unkown provider named as '${this.DatabaseConfig.provider}'` );            
        }        
    }
};

function getMysqlAdaptors() {
    return {
        Connector: require("./providers/mysql/MySqlConnector"),
        Formatters: require("./providers/mysql/MySqlFormatters"),
        DatabaseRemover: require("./providers/mysql/MySqlDatabaseRemover"),
        DatabaseCreator: require("./providers/mysql/MySqlDatabaseCreator"),
        DatabaseExists: require("./providers/mysql/MySqlDatabaseExists")
    }
}

function getSqliteAdaptors() {
    return {
        Connector: require("./providers/sqlite/SqliteConnector"),
        Formatters: require("./providers/sqlite/SqliteFormatters"),
        DatabaseRemover: require("./providers/sqlite/SqliteDatabaseRemover"),
        DatabaseCreator: require("./providers/sqlite/SqliteDatabaseCreator"),
        DatabaseExists: require("./providers/sqlite/SqliteDatabaseExists")
    }
}

function getPostgresAdaptors() {
    return {
        Connector: require("./providers/postgresql/PostgresqlConnector"),
        Formatters: require("./providers/postgresql/PostgresqlFormatters"),
        DatabaseRemover: require("./providers/postgresql/PostgresqlDatabaseRemover"),
        DatabaseCreator: require("./providers/postgresql/PostgresqlDatabaseCreator"),
        DatabaseExists: require("./providers/postgresql/PostgresqlDatabaseExists"),
        ResultsInterpreter: require("./providers/postgresql/PostgresqlResultsInterpreter")
    }
}

function getMariaDBAdaptors() {
    return {
        Connector: require("./providers/mariadb/MariaDBConnector"),
        Formatters: require("./providers/mariadb/MariaDBFormatters"),
        DatabaseRemover: require("./providers/mariadb/MariaDBDatabaseRemover"),
        DatabaseCreator: require("./providers/mariadb/MariaDBDatabaseCreator"),
        DatabaseExists: require("./providers/mariadb/MariaDBDatabaseExists")
    }
}

module.exports = (databaseConfig) => new RedEntities(databaseConfig);