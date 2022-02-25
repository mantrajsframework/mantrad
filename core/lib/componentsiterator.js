/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    /*
     * Iterates over all components loaded for current application
     */
    iterate: async ( fnc ) => {
        const components = global.Mantra.ComponentsLoader.getComponents();
        
        for( const componentName of Object.keys(components) ) {
            await fnc( components[componentName].component, componentName );
        }
    }
}