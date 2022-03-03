/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const path = require("path");

const ComponentConfigValidator = global.gimport("componentconfigvalidator");
const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");
const Loader = global.gimport("componentloader");
const MantraUtils = global.gimport("mantrautils");

class ComponentsLoader {
    constructor() {
        this.componentsInfo = [];
    }

    loadComponents( fullPathsToComponents, cmpsToLoad ) {
        this.componentsInfo = [];

        for( const file of this.getComponentsLocations(fullPathsToComponents) ) {
            const fullPathToComponent = path.join( file.path, file.filename );
    
            // Directory name is considered as component name
            if ( MantraUtils.IsDirectorySync( fullPathToComponent ) ) {
                if ( (cmpsToLoad && cmpsToLoad.includes( file.filename )) || cmpsToLoad == null ) {
                    if ( ComponentConfigValidator.isValidConfigFile( fullPathToComponent ) ) {
                        this.componentsInfo[file.filename] = Loader.loadComponent( fullPathToComponent );
                    } else {
                        MantraConsole.error( `${CoreConstants.COMPONENTS_CONFIGFILENAME} invalid for component '${path.basename(fullPathToComponent)}'. Component not loaded.` );
                    }
                }
            }
        }   

        return Object.keys(this.componentsInfo).length;
    }

    /*
     * Loads components and updates all its locations in components table.
     * Is needed to do this when a component is changed from its location
     */
    async updateComponentsLocations( fullPathsToComponents, cmpsToLoad, mantraDB ) {
        this.loadComponents( fullPathsToComponents, cmpsToLoad );

        for( const componentName of Object.keys(this.componentsInfo) ) {
            await mantraDB.UpdateComponentLocation( componentName, this.componentsInfo[componentName].pathToComponent );
        }    
    }

    loadComponent( fullPathsToComponents, componentName ) {
        for( let pathToComponent of fullPathsToComponents  ) {
            pathToComponent = path.join( pathToComponent, componentName );
        
            if ( MantraUtils.IsDirectorySync( pathToComponent ) ) {
                return Loader.loadComponent( pathToComponent );
            }            
        }

        throw new Error( `Unable to locate component of name: "${componentName}"` );   
    }

    getComponentsCount() {
        return Object.keys(this.componentsInfo).length;
    }

    getComponents() {
        return this.componentsInfo;
    }

    getComponentsNamesLoaded() {
        return Object.keys(this.componentsInfo);
    }

    existsComponentByName( componentName ) {
        return this.componentsInfo[componentName] != null;
    }
    
    getComponentByName( componentName ) {
        return this.componentsInfo[componentName];
    }

    componentsLoaded() {
        return this.componentsInfo != null;
    }

    /*
     * Looks for all folders indicated as parameter array for components
     * It is considered a component if includes a file named as CONFIGFILENAME
     * Returns an array of objects like this:
     * {
     *    path: <relative path to the component location>
     *    filename: <name of the folder, equal to component name>
     * }
     */
    getComponentsLocations( fullPathsToComponents ) {
        let locations = [];

        for( const location of fullPathsToComponents ) {
            if ( MantraUtils.FileExistsSync( location ) ) {
                for( const file of MantraUtils.ReaddirSync( location ) ) {
                    if ( MantraUtils.FileExistsSync( path.join( location, file, CoreConstants.COMPONENTS_CONFIGFILENAME) ) ) {
                        locations.push( { path: location, filename: file } );
                    }
                }
            }
        }

        return locations;
    }

    /*
     * Looks for all folders indicated as parameter array for components and returns
     * the location for a componponent give its name.
     * It is considered a component if includes a file named as CONFIGFILENAME
     * Returns an object like this:
     * {
     *    path: <relative path to the component location>
     *    filename: <name of the folder, equal to component name>
     * }
     * Returns an empty object if the component is not found
     */
    getComponentLocation( componentName, fullPathsToComponents ) {
        let locations = [];

        for( const location of fullPathsToComponents ) {
            if ( MantraUtils.FileExistsSync( location ) ) {
                for( const file of MantraUtils.ReaddirSync( location ) ) {
                    if ( file == componentName && MantraUtils.FileExistsSync( path.join( location, file, CoreConstants.COMPONENTS_CONFIGFILENAME) ) ) {
                        return { path: location, filename: file };
                    }
                }
            }
        }

        return {};
    }
    
    /*
     * Returns true if there exists a component of name componentName in the components locations.
     */
    existsComponentLocation( componentName, fullPathsToComponents ) {
        for( const location of fullPathsToComponents ) {
            if ( MantraUtils.FileExistsSync( location ) ) {
                for( const file of MantraUtils.ReaddirSync( location ) ) {
                    if ( file == componentName && MantraUtils.FileExistsSync( path.join( location, file, CoreConstants.COMPONENTS_CONFIGFILENAME) ) ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

module.exports = () => new ComponentsLoader();