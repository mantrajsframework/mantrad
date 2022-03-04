/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Moment = require("moment");
const RedEntitiesUtils = require("../redentitiesutils");

class InsertQueryBuilder {
    constructor( entityName, sqlEntities, formatters ) {
        this.sqlEntities = sqlEntities;
        this.entityName = entityName;
        this.fields = {};
        this.Formatters = formatters;
    }

    Values( f ) {
        this.fields = f;        

        return this;
    }

    V( f ) { return this.Values( f ) }

    Query() {
        return this.buildInsertQuery();
    }

    Q() {
        return this.Query();
    }

    async Run() {
        this.fields = this.checkDefaultValues();
        this.sanitizeValues();        

        await this.sqlEntities.RunQuery( this.buildInsertQuery() );

        return this.fields.ID;
    }

    R() { return this.Run() }

    buildInsertQuery() {        
        return this.Formatters.FormatInsert( this.entityName, this.fields, this.sqlEntities.NewId );
    }

    sanitizeValues() {
        Object.keys(this.fields).forEach( (fieldName) => {                        
            if ( fieldName != "ID" ) {
                let valueTypeInModel = this.sqlEntities.GetFieldDefinitionInSchema( this.entityName, fieldName );
    
                switch( valueTypeInModel.type ) {
                    case "boolean": {
                        if ( typeof this.fields[fieldName] == "string" ) {
                            this.fields[fieldName] = this.fields[fieldName] == "true" ? 1 : 0;
                        } else if ( typeof this.fields[fieldName] == "boolean" ) {
                            this.fields[fieldName] = this.fields[fieldName] == true ? 1 : 0;
                        }
                        break;
                    }
                    case "datetime": {
                        let m = Moment(this.fields[fieldName]);
                        this.fields[fieldName] = m.format("YYYY-MM-DD HH:mm:ss");
                        break;
                    }
                    case "json": {
                        this.fields[fieldName] = RedEntitiesUtils.FromJsonToBase64( this.fields[fieldName] );
                        break;
                    };
                    case "string", "longtext": {
                        this.fields[fieldName] = this.fields[fieldName].replace(/[^\x00-\x7F áéíóúÁÉÍÓÚüÜ]/g, "");
                        break;
                    }
                }
            }
        });
    }

    checkDefaultValues() {
        let finalFields = [];                
        let schema = this.sqlEntities.getEntitySchemaFromName( this.entityName );
        
        schema.fields.forEach( (f) => {
            if ( this.fields[f.name] ) { // Exists in fields to insert
                finalFields[f.name] = this.fields[f.name];
            } else {
                finalFields[f.name] = this.getDefaultValue( f );
            }    
        });

        if ( typeof this.fields.ID != 'undefined') finalFields.ID = this.fields.ID;

        return finalFields;
    }

    getDefaultValue( fieldDefinition ) {
        switch( fieldDefinition.type ) {
            case "string": return fieldDefinition.default ? fieldDefinition.default : ""; break;
            case "key": return fieldDefinition.default ? fieldDefinition.default : ""; break;
            case "boolean": return fieldDefinition.default ? fieldDefinition.default : false; break;
            case "datetime": return fieldDefinition.default ? fieldDefinition.default : new Date(new Date().toUTCString()); break;
            case "integer": return fieldDefinition.default ? fieldDefinition.default : 0; break;
            case "json": return fieldDefinition.default ? fieldDefinition.default : {}; break;
            case "float": return fieldDefinition.default ? fieldDefinition.default : 0; break;
            case "longtext": return fieldDefinition.default ? fieldDefinition.default : ""; break;
            default: throw Error( `Unknown type of ${fieldDefinition.type}`);
        }
    }
};

module.exports = InsertQueryBuilder;