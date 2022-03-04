/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

class UniqueIndexBuilder {
    constructor( tableName, fieldNames, indexCount, formatters ) {
        this.TableName = tableName;
        this.Fields = fieldNames;
        this.IndexCount = indexCount;
        this.Formatters = formatters;
    }

    Query() {
        return this.Formatters.FormatUniqueIndex( this.TableName, this.Fields, this.IndexCount);
    }
}

module.exports = UniqueIndexBuilder;