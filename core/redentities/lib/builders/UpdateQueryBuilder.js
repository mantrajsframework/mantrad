/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Moment = require("moment");
const RedEntitiesUtils = require("../redentitiesutils");

class UpdateQueryBuilder {
    constructor( entityName, sqlEntities, formatters ) {
        this.entityName = entityName;
        this.sqlEntities = sqlEntities;
        this.where = "";
        this.fields = [];
        this.Formatters = formatters;
    }

    Query() {
        return this.buildUpdateQuery();
    }    

    Q() {
        return this.Query();
    }

    async Run() {
        await this.sqlEntities.RunQuery( this.buildUpdateQuery() );

        return this.fields.ID;
    }

    R() { return this.Run() }

    Where( expression, values ) {
        this.where = this.Formatters.FormatWhere( expression, values );
        
        return this;
    }

    W(e,v) { return this.Where(e,v) }

    Values( fields, values ) {
        if ( Array.isArray(fields) ) {
            for( let i = 0; i < fields.length; i++ ) {
                this.fields.push( this.Formatters.FormatWhere( `${fields[i]} = ?`, this.sanitizeValue(fields[i], values[i]) ) );
            }
        } else if ( typeof fields == 'object' ) {
            for( const field of Object.keys(fields) ) {
                this.fields.push( this.Formatters.FormatWhere( `${field} = ?`, this.sanitizeValue(field, fields[field]) ) );
            }
        } else throw Error('Expected array of field names of json object');

        return this;
    }

    V(f,v) { return this.Values(f,v) }

    buildUpdateQuery() {
        return this.Formatters.FormatUpdate( this.entityName, this.fields, this.where );
    }

    sanitizeValue( fieldName, value ) {
        let valueTypeInModel = this.sqlEntities.GetFieldDefinitionInSchema( this.entityName, fieldName );

        switch( valueTypeInModel.type ) {
            case "datetime": {
                let m = Moment(value);
                return m.format("YYYY-MM-DD HH:mm:ss");
            }
            case "boolean": {
                if ( typeof value == "string" ) {
                    return value == "true" ? true : false;
                } else if ( typeof value == "boolean" ) {
                    return value == true ? true : false;
                } else if ( typeof value == 'integer' ) {
                    return value == 1 ? true : false
                }
            }
            case "json": {
                return RedEntitiesUtils.FromJsonToBase64(value);
            }
            case "string", "longtext": {
                return value.replace(/[^\x00-\x7F áéíóúÁÉÍÓÚüÜ]/g, "");
            }
            
            default: return value;
        }
    }
}

module.exports = UpdateQueryBuilder;