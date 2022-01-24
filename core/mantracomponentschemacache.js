/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const VarCache = global.gimport("varcache");
const MantraUtils = global.gimport("mantrautils");

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

    async ExistsSchema( Mantra, componentName ) {
        const AssetsLocations = Mantra.GetAssetsLocations();
        const schemaLocation = AssetsLocations.GetSchemaLocation( componentName );

        return MantraUtils.FileExists( schemaLocation );
    }
}

module.exports = () => new ComponentSchemaCache();