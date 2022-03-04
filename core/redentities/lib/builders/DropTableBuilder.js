/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

class DropTableBuilder {
    constructor( tableName, formatters ) {
        this.TableName = tableName;
        this.Formatters = formatters;
    }   

    Query() {
        return this.Formatters.FormatDropTable( this.TableName );
    }
}

module.exports = DropTableBuilder;