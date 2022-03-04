/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MySql = require("mysql2");

const INDEXPREFIX = "idx";
const UNIQUEINDEXPREFIX = "uidx";

module.exports = {
    FormatSelect: (selectProperties) => {
        let fields = typeof selectProperties.fields == 'string' ? selectProperties.fields : selectProperties.fields.join(',');
        let s = `SELECT ${fields}`;
        let f = `FROM ${selectProperties.entityName}`;
        let w = selectProperties.where == "" ? "" : `WHERE ${selectProperties.where}`;
        let l = selectProperties.limitStart == -1 ? "" : `LIMIT ${selectProperties.limitCount} OFFSET ${selectProperties.limitStart}`;

        l = (l == "" && selectProperties.take != -1) ? `LIMIT ${selectProperties.take}` : l;

        let o = buildOrderBy(selectProperties);

        return `${s} ${f} ${w} ${o} ${l}`;
    },

    FormatInsert: (entityName, fields, newIdFnc) => {
        if ( typeof fields.ID == 'undefined' ) { fields.ID = newIdFnc();}
        let f = `(${Object.keys(fields).join(',')})`;
        let v = [];
        
        Object.keys(fields).forEach( (key) => {
            let value = fields[key];

            v.push( "'" + (typeof value=='string' ? value.replace(/'/g, "''") : value) + "'" );
        });

        return `INSERT INTO ${entityName} ${f} VALUES (${v.join(",")})`;
    },

    FormatUpdate: (entityName, fields, where) => {
        let u = `UPDATE ${entityName}`;
        let s = `SET ${fields.join(",")}`;
        let w = where == "" ? "" : `WHERE ${where}`;

        return `${u} ${s} ${w}`;
    },

    FormatWhere: (expression, values) => {
        return MySql.format(expression, values).replace(/\\"/g, '"');
    },

    FormatCreateTable: (tableName, fields) => {
        let q = "CREATE TABLE {tablename} ( {fields}PRIMARY KEY (ID) );"
        let f = "ID VARCHAR(12), ";
        
        q = Replace( q, "tablename", tableName );

        for( let i = 0; i < fields.length; i++ ) {
            let t = "{fieldname} {fieldtype} NOT NULL, ";
            let c = Replace( t, "fieldname", fields[i].name);

            c = Replace( c, "fieldtype", RedEntitiesTypeToProviderType(fields[i].type) );            
            f += c;
        }

        return Replace( q, "fields", f );
    },

    FormatDelete: (entityName, where) => {
        let d = `DELETE FROM ${entityName}`;
        let w = `WHERE ${where}`;
    
        return `${d} ${w}`;     
    },

    FormatDropTable: (tableName) => {
        return `DROP TABLE IF EXISTS ${tableName};`;
    },

    FormatIndex: (tableName, fields, indexCount) => {
        // In Postgres, index names should be differents despite they belongs to differents tables
        return `CREATE INDEX ${INDEXPREFIX}_${indexCount}_${tableName} ON ${tableName} (${fields.join(",")})`;                
    },

    FormatUniqueIndex: (tableName, fields, indexCount) => {
        // In Postgres, index names should be differents despite they belongs to differents tables
        return `CREATE UNIQUE INDEX ${UNIQUEINDEXPREFIX}_${indexCount}_${tableName} ON ${tableName} (${fields.join(",")})`;                
    },

    FormatRenameTable: (tableName, newTableName) => {
        return `ALTER TABLE ${tableName} RENAME TO ${newTableName};` 
    },

    FormatSelectDatabaseAndTable: (databaseName, tableName) => {
        // In Postgres, database name is skipped because the connection is done with it
        return MySql.format("SELECT * FROM information_schema.tables WHERE table_schema='public' AND table_name=? LIMIT 1", [tableName]);
    },

    FormatShowTable: (tableName, databaseName) => {
        // In Postgres, database name is skipped because the connection is done with it
        return MySql.format("SELECT * FROM information_schema.tables WHERE table_schema='public' AND table_name=? LIMIT 1", [tableName]);
    },

    FormatShowDatabase: (databaseName) => {
        return `SELECT datname FROM pg_database WHERE datname='${databaseName}';`;
    },

    FormatCreateDatabase: (databaseName) => {
        return `CREATE DATABASE ${databaseName};`;
    },

    FormatDropDatabase: (databaseName) => {
        return `DROP DATABASE IF EXISTS ${databaseName};`;
    },

    GetCountAll: () => "COUNT(*)"
}

function buildOrderBy(selectProperties) {
    let sentences = [];

    for( let o of selectProperties.orderBy ) {
        sentences.push( `${o.field} ${o.isAsc ? 'ASC' : 'DESC'}`);
    }

    return sentences.length ? `ORDER BY ${sentences.join(",")}` : "";
}


function Replace( data, dataName, dataValue ) {
    return data.replace( `{${dataName}}`, dataValue );
}

function RedEntitiesTypeToProviderType( type, mysqltype ) {
    switch( type ) {
        case "string": return "VARCHAR(512)";
        case "key": return "VARCHAR(24)";
        case "integer": return "INT";
        case "boolean": return "BOOLEAN";
        case "datetime": return "TIMESTAMP";
        case "json": return "TEXT";
        case "float": return "FLOAT";
        case "longtext": return "TEXT";
        default: throw Error(`Type not supported "${type}"`)
    }
}