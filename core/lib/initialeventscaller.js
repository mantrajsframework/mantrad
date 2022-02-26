/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */

"use strict";

const ComponentsIterator = global.gimport("componentsiterator");
const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    // Call onStart() on each component
    callOnStartComponents: async ( mantraAPI ) => {
        // Start core components first to initialize some useful apis for the app components
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( CoreConstants.CORE_COMPONENTS.includes(componentName) && cmpInstance.Start && cmpInstance.Start.onStart ) {
                try {
                    await cmpInstance.Start.onStart(mantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onStart on component ${componentName}. ${err}` );
                }
            }
        });

        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( !CoreConstants.CORE_COMPONENTS.includes(componentName) && cmpInstance.Start && cmpInstance.Start.onStart ) {
                try {
                    await cmpInstance.Start.onStart(mantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onStart on component ${componentName}. ${err}` );
                }
            }
        });
    },

    // Call onStop() on each component
    callOnStopComponents: async ( mantraAPI ) => {
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start && cmpInstance.Start.onStop ) {
                try {
                    await cmpInstance.Start.onStop( mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onStop on component ${componentName}. ${err}` );
                }
            }
        });
    },
    
    checkOnStartupHealth: async ( MantraAPI ) => {
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start && cmpInstance.Start.onCheckStartupHealth ) {
                try {
                    await cmpInstance.Start.onCheckStartupHealth(MantraAPI);
                } catch(err) {
                    MantraConsole.error( `Exception calling onCheckStartupHealth on component ${componentName}. ${err}` );
                }
            }
        });
    },

    callOnCheckHealthComponents: async ( mantraAPI ) => {
        await ComponentsIterator( async (cmpInstance,componentName) => {
            if ( cmpInstance.Start && cmpInstance.Start.onCheckHealth ) {
                MantraConsole.info(`Checking health for component ${componentName}`, false);

                try {
                    await cmpInstance.Start.onCheckHealth( mantraAPI );                 
                } catch(err) {
                    MantraConsole.error( `Exception calling onCheckHealth on component ${componentName}. ${err}` );
                }
            }
        });
    },

    // Call onServerStarted() on each component
    callOnServerStartedComponents: async ( app, mantraAPI ) => {
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start && cmpInstance.Start.onServerStarted ) {
                try {
                    await cmpInstance.Start.onServerStarted( app, mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onServerStarted on component ${componentName}. ${err}` );
                }
            }
        });
    },

    // call onSystemStarted on each component
    callOnSystemStarted: async ( mantraAPI ) => {
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( cmpInstance.Start && cmpInstance.Start.onSystemStarted ) {
                try {
                    await cmpInstance.Start.onSystemStarted( mantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onSystemStarted on component ${componentName}. ${err}` );
                }
            }
        });
    },

    // Call onInitialize() on each component if present
    callOnInitializeComponents: async ( MantraAPI ) => {
        await ComponentsIterator( async (cmpInstance, componentName) => {
            if ( cmpInstance.Install && cmpInstance.Install.onInitialize ) {
                try {
                    await cmpInstance.Install.onInitialize( MantraAPI );
                } catch(err) {
                    MantraConsole.error( `Exception calling onInitialize on component ${componentName}. ${err}` );
                }
            }
        });
    }
}