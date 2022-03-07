/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const { nanoid } = require("nanoid");
const _ = require("underscore");

const CreateTableBuilder = require("./builders/CreateTableBuilder");
const DeleteQueryBuilder = require("./builders/DeleteQueryBuilder");
const DropTableBuilder = require("./builders/DropTableBuilder");
const IndexBuilder = require("./builders/IndexBuilder");
const InsertQueryBuilder = require("./builders/InsertQueryBuilder");
const SelectQueryBuilder = require("./builders/SelectQueryBuilder");
const UniqueIndexBuilder = require("./builders/UniqueIndexBuilder");
const UpdateQueryBuilder = require("./builders/UpdateQueryBuilder");

class SqlEntities {
    constructor(databaseConfig, databaseSchema, adaptors ) {
        this.DatabaseConfig = databaseConfig;
        this.DatabaseSchema = databaseSchema;
        this.Adaptors = adaptors;

        if ( databaseSchema ) populateEntities(this);
    }

    async RenameSchemaEntity( entityName, newEntityName ) {
        const sql = this.Adaptors.Formatters.FormatRenameTable( entityName, newEntityName );
    
        await this.RunQuery(sql);
    }

    async RenameSchemaEntities( sufix ) {
        let sql = [];

        for( const entity of this.DatabaseSchema.entities ) {            
            sql.push( this.Adaptors.Formatters.FormatRenameTable( entity.name, `${entity.name}${sufix}`) );
            entity.name = `${entity.name}${sufix}`;
        }

        for (const query of sql) {
            await this.RunQuery(query);
        }

        return this.DatabaseSchema;
    }

    NewId() { return nanoid(12) };

    async ExistsSchema() {
        const result = await this.RunQuery( this.Adaptors.Formatters.FormatSelectDatabaseAndTable(this.DatabaseConfig.database, this.DatabaseSchema.entities[0].name ) );
        
        return result.length == 1;
    }

    /*
     * Create the entity schema in database
     * entitySchema: <json describing the schema for the table>
     * removeIfExists: <if true, then if table exists, it is removed and created again>
     */
    async CreateEntity( entitySchema, removeIfExists ) {        
        const existsEntity = await this.ExistsTable( entitySchema.name );
        const formatters = this.Adaptors.Formatters;

        if ( existsEntity && removeIfExists == false ) { return; }

        let sql = [];        
        if ( existsEntity && removeIfExists ) {
            sql.push( (new DropTableBuilder( entitySchema.name, formatters )).Query() );
        }
        
        const ctb = new CreateTableBuilder(entitySchema.name, formatters );

        for( const field of entitySchema.fields ) {
            ctb.AddField(field.name, field.type);
        }

        sql.push(ctb.Query());

        if (entitySchema.indexes) {
            let i = 0;            

            for( const index of entitySchema.indexes ) {
                if( !this.fieldsInEntity( entitySchema, index ) ) {
                    throw Error( `Some index fields are missing in entity fields in ${entitySchema.name}`);
                }

                sql.push( (new IndexBuilder(entitySchema.name, index, i++, formatters)).Query() );
            }
        }

        // Restrictions
        if (entitySchema.restrictions && entitySchema.restrictions.unique) {
            let i = 0;

            for( const uniqueIndex of entitySchema.restrictions.unique ) {
                if (!this.fieldsInEntity(entitySchema, uniqueIndex)) {
                    throw Error(`Some unique index fields are missing in entity fields in ${entitySchema.name}`);
                }
    
                sql.push((new UniqueIndexBuilder(entitySchema.name, uniqueIndex, i++, formatters)).Query());
            }
        }

        // Important: creation queries should be performed in array order (first create tables, then indexes...)
        for (const query of sql) {
            await this.RunQuery(query);
        }
    }

    /*
     * Creates new entities(tables) in the database according
     * to the schema indicated as parameter. If the schema is a json object,
     * one entity will be created, if it is an array of json objects, some entities
     * will be created. 
     * Returns a promise.
     * Params:
     * removeIfExists: <if true, then all entities (tables) are removed if exists, optional. Default: true>
     */
    async CreateSchema(removesIfExists) {
        const removes = typeof removesIfExists == 'undefined' ? true : removesIfExists;
        const existsDatabase = await this.ExistsDatabase();
        
        if ( !existsDatabase ) {
            await this.CreateDatabase(this.DatabaseConfig.database);
        }    

        for (const entity of this.DatabaseSchema.entities) {
            await this.CreateEntity( entity, removes );
        }
    }

    async CreateFromSchema(schema) {
        for (const entity of schema.entities) {
            await this.CreateEntity( entity, true );
        }
    }

    fieldsInEntity( entity, fieldsToCheck ) {
        const fields = entity.fields.map( (f) => f.name );
        const common = _.intersection( fields, fieldsToCheck );

        return common.length == fieldsToCheck.length;
    }

    async RemoveSchema(schema) {
        if ( typeof schema != 'undefined' ) this.DatabaseSchema = schema;

        for( const entity of this.DatabaseSchema.entities ) {
            await this.RunQuery( (new DropTableBuilder( entity.name, this.Adaptors.Formatters )).Query() );
        }
    }

    async RemoveAndCreateDatabase( databaseName ) {
        await this.RemoveDatabase( databaseName );
        await this.CreateDatabase( databaseName );
    }

    async ExistsDatabase() {
        return this.Adaptors.DatabaseExists.ExistsDatabase(this);
    }

    async ExistsTable( tableName ) {        
        const result = await this.RunQuery( this.Adaptors.Formatters.FormatShowTable(tableName, this.DatabaseConfig.database) );

        return result.length == 1;
    }

    async RemoveDatabase( databaseName ) {
        return this.Adaptors.DatabaseRemover.RemoveDatabase( databaseName, this.Adaptors.Formatters, this.Adaptors.Connector, this.DatabaseConfig );
    }

    async CreateDatabase( databaseName ) {
        return this.Adaptors.DatabaseCreator.CreateDatabase( databaseName, this.Adaptors.Formatters, this.Adaptors.Connector, this.DatabaseConfig );
    }

    Insert( entityName ) {
        return new InsertQueryBuilder( entityName, this, this.Adaptors.Formatters );
    }

    Update( entityName ) {
        return new UpdateQueryBuilder( entityName, this, this.Adaptors.Formatters );
    }

    Select( entityName, fields ) {
        return new SelectQueryBuilder( entityName, this, fields ? fields : "*", this.Adaptors.Formatters );
    }

    Delete( entityName ) {
        return new DeleteQueryBuilder( entityName, this, this.Adaptors.Formatters );
    }

    getEntitySchemaFromName( entityName ) {        
        for( const schema of this.DatabaseSchema.entities ) {
            if ( schema.name == entityName ) return schema;
        }

        throw Error(`Unkown schema for entity ${entityName}`);
    }

    async RunQuery( sql ) {
        return this.Adaptors.Connector.RunQuery( this.DatabaseConfig, sql );
    }

    GetEntityByName( entityName ) {
        for( const entity of this.DatabaseSchema["entities"] ) {
            if ( entity.name == entityName ) return entity;
        }

        throw new Error( `Unknown entity name "${entityName}"` );
    }

    GetFieldDefinitionInSchema( entityName, fieldName ) {
        for( const e of this.GetEntityByName( entityName ).fields ) {
            if ( e.name === fieldName ) return e;
        }

        throw new Error( `Unkown field name "${fieldName}" in entity "${entityName}"`);
    }
}

/*
 * Add I(), S(), U() and D() shorcuts to each entity instance in the model
 */
function populateEntities(sqlEntities) {
    const formatters = sqlEntities.Adaptors.Formatters;
    
    for( const entity of sqlEntities.DatabaseSchema.entities ) {
        sqlEntities[entity.name] = {
            I : function() { return new InsertQueryBuilder( entity.name, sqlEntities, formatters ) },
            S : function(fields) { return new SelectQueryBuilder( entity.name, sqlEntities, fields ? fields : "*", formatters, sqlEntities.Adaptors.ResultsInterpreter ) },
            U : function() { return new UpdateQueryBuilder( entity.name, sqlEntities, formatters ) },
            D : function() { return new DeleteQueryBuilder( entity.name, sqlEntities, formatters ) }
        }
    }
}

module.exports = SqlEntities;