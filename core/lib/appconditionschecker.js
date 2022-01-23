/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const RedEntities = require("redentities");

const MantraConsole = global.gimport("mantraconsole");
const MantraDB = global.gimport("mantradb");

module.exports = {
    checkConditionsBeforeStarting: async (Mantra) => {
        const config = global.Mantra.MantraConfig;

        MantraConsole.info( 'Checking components dependencies...', false );
        if ( await checkComponentsDependenciesExists( Mantra, config ) ) {
            MantraConsole.info('Ok', false);
        }
 
        MantraConsole.info( 'Checking databases connectivity...', false );
        if ( await checkDatabaseConnectivity( Mantra, config ) ) {
            MantraConsole.info('Ok', false);
        }

    }
}

async function checkComponentsDependenciesExists( Mantra, config ) {
    const mantraDb = MantraDB(config.getEntitiesConfiguration());
    const allComponentsInstalledAndEnabled = await mantraDb.GetComponentsInstalledAndEnabled();
    let allOk = true;

    for( let componentName of allComponentsInstalledAndEnabled ) {
        const componentLoaded = await Mantra.ExistsComponentByName(componentName);
    
        if ( componentLoaded ) {
            const componentDependencies = Mantra.GetComponentDependencies(componentName);
            
            for( const dependencyComponentName of componentDependencies ) {
                const dependencyLoaded = await Mantra.ExistsComponentByName(dependencyComponentName);
    
                if ( !dependencyLoaded ) {
                    MantraConsole.warning(`Component '${componentName}' depends on the component '${dependencyComponentName}' but it is not installed, enabled or loaded with this application`, false)
                    allOk = false;
                }
            }
        }
    }

    return allOk;
}

async function checkDatabaseConnectivity( Mantra, config ) {
    let allOk = true;

    for( const entitiesName of Object.keys(config.Entities) ) {
        const entityConfig = config.Entities[entitiesName];

        try {
            const entitiesInstance = RedEntities(entityConfig);
            //console.log( await entitiesInstance.ExistsDatabase() );           
        } catch {
            MantraConsole.warning(`Entities access named as '${entitiesName}' not accesible`)
        }

    }
    
    return allOk;
}