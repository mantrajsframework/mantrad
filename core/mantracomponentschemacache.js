"use strict";

const VarCache = global.gimport("varcache");

let schemasByComponentNameCache = null;
/*
 * Simple cache for components schemas so that are not read continuosly from component configuration
 */
class ComponentSchemaCache {
    constructor() {
        schemasByComponentNameCache = schemasByComponentNameCache || VarCache();
    }

    /*
     * Loads a schema from its definition in /model folder
     * if schemaName is not set, then the schema loaded should be located at: 
     * /<componentName>/model/<componentName>.schema.json
     * If schemaName is set, then the schema loaded should be located at:
     * /<componentName>/model/<schemaName>.schema.json
     */
    GetSchema( MantraAPI, componentName, schemaName ) {
        const key = `${componentName}${schemaName || ''}`;

        if ( !schemasByComponentNameCache.Exists(key) ) {
            const AssetsLocations = MantraAPI.GetAssetsLocations();
            const pathToModel = AssetsLocations.GetSchemaLocation( componentName, schemaName );

            schemasByComponentNameCache.Add( key, require(pathToModel) );
        }

        return schemasByComponentNameCache.Get(key);
    }
}

module.exports = () => new ComponentSchemaCache();