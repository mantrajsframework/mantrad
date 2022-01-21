/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");
const fs = require("fs");

const CoreConstants = global.gimport("coreconstants");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    /*
     * Loads a component given its full path folder
     * Folder name containing the component is the name of the component
     * /home/user/project/components/seo folder includes "seo component", so
     * a file seo.js should exists containing the component module.
     * 
     * If it doesn't exists, then an anonymous instance of the object expected to export
     * the component is created.
     */
    loadComponent: ( fullPathToComponent ) => {
        const pathToEntryComponentFile = Path.join( fullPathToComponent, Path.basename(fullPathToComponent) ) + ".js";

        if ( fs.existsSync( pathToEntryComponentFile ) ) {
            return {
                pathToComponent: fullPathToComponent,
                config: require( Path.join( fullPathToComponent, CoreConstants.COMPONENTS_CONFIGFILENAME ) ),
                component: require( pathToEntryComponentFile )()
            };
        } else {
            return {
                pathToComponent: fullPathToComponent,
                config: require( Path.join( fullPathToComponent, CoreConstants.COMPONENTS_CONFIGFILENAME ) ),
                component: {
                    Start: {
                        onStart: async () => {}
                    }
                }
            };
        }
    }    
}