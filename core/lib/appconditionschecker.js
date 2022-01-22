/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");
const MantraDB = global.gimport("mantradb");

module.exports = {
    checkConditionsBeforeStarting: async (Mantra, config) => {
        // Check if all components dependencies are installed and ready
        const mantraDb = MantraDB(config.getEntitiesConfiguration());
        const allComponentsInstalledAndEnabled = await mantraDb.GetComponentsInstalledAndEnabled();

        for( let componentName of allComponentsInstalledAndEnabled ) {
            const componentLoaded = await Mantra.ExistsComponentByName(componentName);

            if ( componentLoaded ) {
                const componentDependencies = Mantra.GetComponentDependencies(componentName);
                
                for( const dependencyComponentName of componentDependencies ) {
                    const dependencyLoaded = await Mantra.ExistsComponentByName(dependencyComponentName);

                    if ( !dependencyLoaded ) {
                        MantraConsole.warning(`Component '${componentName}' depends on the component '${dependencyComponentName}' but it is not installed, enabled or loaded with this application`)
                    }
                }
            }
        }
    }
}