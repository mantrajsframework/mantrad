/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");
const CoreConstants = global.gimport("coreconstants");

module.exports = {
    /*
     * Loads a component given its full path folder
     * Folder name containing the component is the name of the component
     * /home/user/project/components/seo folder includes "seo component", so
     * a file seo.js should exists containing the component module
     */
    loadComponent: ( fullPathToComponent ) => {
        return {
            pathToComponent: fullPathToComponent,
            config: require( Path.join( fullPathToComponent, CoreConstants.COMPONENTS_CONFIGFILENAME ) ),
            component: require( Path.join( fullPathToComponent, Path.basename(fullPathToComponent) ) )()
        };
    }    
}