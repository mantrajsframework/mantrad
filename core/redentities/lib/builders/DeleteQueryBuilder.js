/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

class DeleteQueryBuilder {
    constructor( entityName, sqlEntities, formatters ) {
        this.entityName = entityName;
        this.sqlEntities = sqlEntities;
        this.where = "";
        this.Formatters = formatters;
    }

    Query() {
        return this.buildDeleteQuery();
    }    

    Q() {
        return this.Query();
    }

    async Run() {
        return this.sqlEntities.RunQuery( this.buildDeleteQuery() );
    }

    async R() { return this.Run() };

    async DeleteById( entityId ) {
        this.where = `ID = '${entityId}'`;

        return this.sqlEntities.RunQuery( this.buildDeleteQuery() );
    }

    Where( expression, values ) {
        this.where = this.Formatters.FormatWhere(expression, values);

        return this;
    }

    W( e, v ) { return this.Where(e,v) }
    
    buildDeleteQuery() {
        return this.Formatters.FormatDelete( this.entityName, this.where );
    }
}

module.exports = DeleteQueryBuilder;