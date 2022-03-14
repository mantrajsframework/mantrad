/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const path = require("path");
const { nanoid } = require("nanoid");
const CoreConstants = require("./coreconstants");

const MantradArgs = global.gimport("mantradargs");
let MantraUtils = global.gimport("mantrautils");

const FRONTEND_FOLDER = "frontend";
const SITETEMPLATES_FOLDER = "templates";

module.exports = {
    ExistsConfigFile: async (fullPathToConfigFile) => {
        return MantraUtils.FileExists( fullPathToConfigFile );
    },

    IsJsonFileValid: (fullPathToConfigFile) => {
        try {
            require( fullPathToConfigFile );
            return true;
        } catch(err) {
            return false;
        }
    },

    LoadConfig : function( fullPathToConfigFile ) {
        let MantraConfig = require( fullPathToConfigFile );

        return MantraConfig;
    },

    LoadFullConfigFromProject: function ( mantraRootFolder, projectRootFolder ) {
        return this.LoadFullConfig(path.join(mantraRootFolder, CoreConstants.CORECOMPONENTSFOLDER), 
            path.join(projectRootFolder, CoreConstants.MANTRACONFIGFILE), 
            projectRootFolder);
    },

    LoadFullConfig : function( fullPathToCoreComponents, fullPathToConfigFile, fullPathToSite ) {
        let MantraConfig = require( fullPathToConfigFile );

        MantraConfig.Location = fullPathToSite;
        MantraConfig.FrontendLocation = path.join( MantraConfig.Location, "ui", FRONTEND_FOLDER );
        MantraConfig.FrontendName = MantraConfig.Location;
        MantraConfig.SiteTemplatesLocation = path.join( MantraConfig.Location, "ui", SITETEMPLATES_FOLDER );
        MantraConfig.RootDirectory = path.dirname( fullPathToConfigFile ) + "/";
        MantraConfig.InstanceId = nanoid(12);
        MantraConfig.Injections = MantraConfig.Injections ? MantraConfig.Injections : [];
        MantraConfig.Apps = MantraConfig.Apps ? MantraConfig.Apps : { main: {} };
        MantraConfig.ComponentsConfig = MantraConfig.ComponentsConfig ? MantraConfig.ComponentsConfig : {}; 
        
        MantraConfig.getComponentsLocations = function() {
            let folders = [];
            
            if ( MantraConfig.ComponentsLocations ) {
                for( const folder of MantraConfig.ComponentsLocations ) {
                    folders.push( path.join( fullPathToSite, folder ) );
                }        
            }

            folders.push( fullPathToCoreComponents );

            return folders;
        },

        MantraConfig.getEntitiesConfiguration = function(entitiesConfigName) {
            return MantraConfig.Entities[entitiesConfigName ? entitiesConfigName : CoreConstants.DEFAULT_ENTITIES_CONFIGURATION];
        },

        MantraConfig.getEntitiesConfigurationNames = function() {
            return Object.keys(MantraConfig.Entities);
        },

        MantraConfig.isServiceActive = function(service) {
            let isActive = true;

            if ( MantraConfig.ActiveServices && !MantraConfig.ActiveServices.includes(service)) {
                isActive = false;
            }

            return isActive;
        }

        MantraConfig.setApp = function(appName) {
            let appConfig = MantraConfig.Apps[appName];
    
            MantraConfig.AppName = appName;
            
            // Inherit app properties in site config
            MantraConfig.InactiveComponents = [];

            if ( appConfig.BaseUrl ) {
                MantraConfig.BaseUrl = appConfig.BaseUrl; 
            }

            if ( appConfig.ActiveComponents ) {
                MantraConfig.ActiveComponents = appConfig.ActiveComponents;
            }
            
            if ( appConfig.InactiveComponents ) {
                MantraConfig.InactiveComponents = appConfig.InactiveComponents;
            }
        
            if ( appConfig.ActiveServices ) {
                MantraConfig.ActiveServices = appConfig.ActiveServices;
            }
        
            if ( appConfig.Port ) {
                MantraConfig.Port = appConfig.Port;
            }
        
            if (appConfig.FrontendLocation) {
                MantraConfig.FrontendLocation = path.join( MantraConfig.Location, "ui", appConfig.FrontendLocation );
                MantraConfig.FrontendName = appConfig.FrontendLocation; 
            }
            
            if ( appConfig.LandingView ) {
                MantraConfig.LandingView = appConfig.LandingView;
            }
            
            if( appConfig.Injections ) {
                for( const appInjectionKey of Object.keys(appConfig.Injections) ) {
                    MantraConfig.Injections[appInjectionKey] = appConfig.Injections[appInjectionKey];
                }
            }
        }

        MantraConfig.setApp( Object.keys(MantraConfig.Apps)[0] ); // Set first app as default

        if ( MantraConfig.GlobalConfig == undefined ) {
            MantraConfig.GlobalConfig = {};
        }

        checkSqliteLocalDatabase( MantraConfig, fullPathToSite );

        return MantraConfig;
    },

    SetApp : function( MantraConfig, appName ) {
        let appConfig = config.Apps[appName];
    
        MantraConfig.AppName = Object.keys(MantraConfig.Apps)[0];
        MantraConfig.InactiveComponents = [];
        
        // Overwrite app properties in site config
        if ( appConfig.InactiveComponents ) {
            MantraConfig.InactiveComponents = appConfig.InactiveComponents;
        }
    
        if ( appConfig.ActiveServices ) {
            MantraConfig.ActiveServices = appConfig.ActiveServices;
        }
    
        if ( appConfig.Port ) {
            MantraConfig.Port = appConfig.Port;
        }
    
        if (appConfig.FrontendLocation) {
            MantraConfig.FrontendLocation = Path.join( MantraConfig.Location, "ui", appConfig.FrontendLocation ); 
            config.FrontendLocation = MantraConfig.FrontendLocation;    
            MantraConfig.FrontendName = appConfig.FrontendLocation; 
        }
        
        if ( appConfig.LandingView ) {
            MantraConfig.LandingView = appConfig.LandingView;
        }
    }
}

function checkSqliteLocalDatabase( MantraConfig, fullPathToSite ) {
    // For sqlite provider, the database file can be indicated as local file inside the project folder.
    if ( MantraConfig.Entities ) {
        for( const entitiesConfigName of Object.keys(MantraConfig.Entities) ) {
            let entitiesConfig = MantraConfig.Entities[entitiesConfigName];

            if ( entitiesConfig.provider == "sqlite" && entitiesConfig.databasepath.charAt(0) == ".") {
                entitiesConfig.databasepath = path.join(fullPathToSite, entitiesConfig.databasepath); 
            }
        }
    }
}
