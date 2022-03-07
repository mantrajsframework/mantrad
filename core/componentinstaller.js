/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraDB = global.gimport("mantradb");

class ComponentInstaller {    
    constructor(MantraConfig) {
        this.mantraConfig = MantraConfig;
        this.mantraDB = MantraDB(MantraConfig.getEntitiesConfiguration());
    }

    async IsComponentAlreadyInstalled( componentName ) {        
        return this.mantraDB.IsComponentInstalled( componentName );
    }
    
    async InstallComponent( componentName ) {
        try {
            this.CheckComponentsAreLoaded();
            let mantraAPI = global.Mantra.MantraAPIFactory();
    
            if( await this.IsComponentAlreadyInstalled(componentName) ) {
                throw Error("Component already installed");
            } else {
                let cmp = global.Mantra.ComponentsLoader.loadComponent( this.mantraConfig.getComponentsLocations(), componentName );

                if ( cmp.config.version == undefined || 
                     cmp.config.name == undefined ) {
                         throw Error(`Missing 'name' or 'version' properties in mantra.json for component`);
                     }

                let values = {
                    name: componentName,
                    version: cmp.config.version,
                    location: cmp.pathToComponent,
                    enabled: false
                };                

                await this.mantraDB.AddComponent(values);

                // Load components again to load the new one
                global.Mantra.ComponentsLoader.loadComponents( this.mantraConfig.getComponentsLocations() );
                
                if ( cmp.component.Install ) {
                    await cmp.component.Install.onInstall( mantraAPI );
                }
            }
        } catch(err) {
            console.error(`Unable to install ${componentName}`, err);
        }
    }
    
    async UninstallComponent( componentName ) {
        this.CheckComponentsAreLoaded();
        const exists = await this.IsComponentAlreadyInstalled(componentName);
        const mantraAPI = global.Mantra.MantraAPIFactory();
        
        if( !exists  ) {
            throw Error("Component doesn't exist");
        } else {
            let cmp = global.Mantra.ComponentsLoader.loadComponent( this.mantraConfig.getComponentsLocations(), componentName );

            await this.mantraDB.RemoveComponentByName( componentName );
    
            if ( cmp.component.Install && cmp.component.Install.onUninstall ) {
                await cmp.component.Install.onUninstall( mantraAPI );
            }        
        }    
    }

    async EnableComponent( componentName ) {
        return UpdateComponentStatus( componentName, true, this.mantraDB );
    }

    async DisableComponent( componentName ) {
        return UpdateComponentStatus( componentName, false, this.mantraDB );
    }

    /*
     * Returns all components loaded which current version are different
     * than registered in Components table in system.
     * Returns an array with objects with these properties: 
     * {
     *    componentLoaded: < component loaded by ComponentsLoader >,
     *    componentEntity: < data entity of the compomnent stored at components table>  
     * }
     */
    async GetComponentsToUpdate() {
        let componentsToUpdate = [];
        const componentsLoader = global.Mantra.ComponentsLoader;

        // Components enabled and installed currently in system
        const components = await this.mantraDB.GetEnabledComponents();

        // Check for component version changes
        for( let cmp of components ) {
            let cmpLoaded = componentsLoader.getComponentByName( cmp.name );

            if ( cmpLoaded.config.version != cmp.version ) {
                componentsToUpdate.push( { componentLoaded:cmpLoaded, componentEntity: cmp } );
            }
        }        

        return componentsToUpdate;
    }

    /*
     * Updates the version of a component in components table
     */
    async UpdateComponentVersion( componentName, newVersion ) {
        const exists = await this.mantraDB.ExistsComponentByName(componentName);

        if ( exists ) {
            return this.mantraDB.UpdateComponentVersion(componentName, newVersion);
        } else {
            throw Error( `Unable to update component version for a no registered component with name '${componentname}'`);
        }
    }

    CheckComponentsAreLoaded() {
        if ( !global.Mantra.ComponentsLoader.componentsLoaded() ) {
            global.Mantra.ComponentsLoader.loadComponents( this.mantraConfig.getComponentsLocations() );
        }        
    }
}

async function UpdateComponentStatus( componentName, newStatus, mantraDB ) {
    const exists = await mantraDB.IsComponentInstalled(componentName);
    
    if( !exists ) {
        throw Error("Component doesn't exist");
    } else {
        return mantraDB.UpdateComponentStatus(componentName, newStatus);
    }
}

module.exports = (MantraConfig) => new ComponentInstaller(MantraConfig);