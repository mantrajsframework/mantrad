/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

class CreateTableBuilder {
    constructor( tableName, formatters ) {
        this.TableName = tableName;
        this.Fields = [];
        this.Formatters = formatters;
    }

    AddField( name, type ) {
        this.Fields.push( { name: name, type: type } );
    }

    Query() {
        return this.Formatters.FormatCreateTable( this.TableName, this.Fields );
    }
}

module.exports = CreateTableBuilder