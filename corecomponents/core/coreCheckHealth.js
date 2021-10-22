"use strict";

const MantraConsole = global.gimport("mantraconsole");
const CoreConstants = global.gimport("coreconstants");

module.exports = {
    checkHealth: async (MantraAPI) => {
        await checkComponentSchemas(MantraAPI);
    }
}

async function checkComponentSchemas(MantraAPI) {
    const AssetsLocations = MantraAPI.GetAssetsLocations();

    MantraConsole.info("Checking entities for components and database connectivity...", false);

    await global.Mantra.Bootstrap.iterateOverComponents( async (cmpInstance, componentName) => { 
        if ( !CoreConstants.IsCoreComponent(componentName) ) {
            const schemaLocation = AssetsLocations.GetSchemaLocation( componentName );
            const existsSchemaFile = await MantraAPI.Utils.FileExists( schemaLocation );
    
            if ( existsSchemaFile ) {
                try {
                    const componentDb = MantraAPI.ComponentEntities(componentName);
                    const existsSchema = await componentDb.ExistsSchema();

                    if ( !existsSchema ) {
                        MantraConsole.warning(`Unable to access schema for component ${componentName}. Check if it installed or database connectivity.`, false)
                    }
                } catch(err) {
                    MantraConsole.warning(`Unable to access schema for component ${componentName}. Check if it installed or database connectivity.`, false)
                }
            }
        }
    });
}