"use strict";

const VarCache = global.gimport("varcache");

let dbConfigByComponentName = null;

/*
 * Stores in a hash table entities configuration for each component by its name
 */
class ComponentDbConfiguration {
    constructor() {
        if ( dbConfigByComponentName == null ) {            
            dbConfigByComponentName = VarCache();
    
            for( let dbentitiesname of global.Mantra.MantraConfig.getEntitiesConfigurationNames() ) {
                let entitiesConfig = global.Mantra.MantraConfig.getEntitiesConfiguration(dbentitiesname);
    
                if ( entitiesConfig.components ) {
                    for( let cmpName of entitiesConfig.components ) {
                        dbConfigByComponentName.Add(cmpName, dbentitiesname);
                    }
                }
            }
        }
    }

    /*
     * Returns the entities configuration name for a component by its name.
     * If it is not set in any entity configuration, "default" y return
     */
    GetComponentEntitiesConfigName( componentName ) {
        return dbConfigByComponentName.Exists(componentName) ? dbConfigByComponentName.Get(componentName) : "default"; 
    }
}

module.exports = (mantraConfig) => new ComponentDbConfiguration(mantraConfig);