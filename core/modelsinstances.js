/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

let modelInstances = {};

module.exports = {
    BuildModelInstances: async (Mantra, components) => {
        for( const componentName of Object.keys(components) ) {
            const hasModel = await Mantra.componentSchemaCache.ExistsSchema( Mantra, componentName );

            if ( hasModel ) {
                modelInstances[componentName] = Mantra.ComponentEntities(componentName);
            }
        }
    },

    GetModelInstances: () => modelInstances
}