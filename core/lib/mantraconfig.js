"use strict";

const path = require("path");
const ShortId = require("shortid");
const CoreConstants = require("./coreconstants");

let MantraUtils = global.gimport("mantrautils");

const FRONTEND_FOLDER = "frontend";
const SITECOMPONENTS_FOLDER = "components";
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

    LoadFullConfig : function( fullPathToCoreComponents, fullPathToConfigFile, fullPathToSite ) {
        let MantraConfig = require( fullPathToConfigFile );

        MantraConfig.Location = fullPathToSite;
        MantraConfig.FrontendLocation = path.join( MantraConfig.Location, "ui", FRONTEND_FOLDER );
        MantraConfig.SiteComponentsLocation = path.join( MantraConfig.Location, SITECOMPONENTS_FOLDER );
        MantraConfig.SiteTemplatesLocation = path.join( MantraConfig.Location, "ui", SITETEMPLATES_FOLDER );
        MantraConfig.RootDirectory = path.dirname( fullPathToConfigFile ) + "/";
        MantraConfig.InstanceId = ShortId.generate();
        
        MantraConfig.getComponentsLocations = function() {
            let folders = [];
            
            if ( MantraConfig.ComponentsLocations ) {
                for( const folder of MantraConfig.ComponentsLocations ) {
                    folders.push( path.join( fullPathToSite, folder ) );
                }        
            }

            folders.push( fullPathToCoreComponents, 
                          MantraConfig.SiteComponentsLocation, 
                          path.join( fullPathToSite, "node_modules") );

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
            MantraConfig.ActiveServicesByComponent = appConfig.ActiveServicesByComponent;
            MantraConfig.InactiveComponents = [];
        
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
            }
            
            if ( appConfig.LandingView ) {
                MantraConfig.LandingView = appConfig.LandingView;
            }    
        }

        MantraConfig.setApp( Object.keys(MantraConfig.Apps)[0] ); // Set first app as default

        if ( MantraConfig.GlobalConfig == undefined ) {
            MantraConfig.GlobalConfig = {};
        }
        
        return MantraConfig;
    },

    SetApp : function( MantraConfig, appName ) {
        let appConfig = config.Apps[appName];
    
        MantraConfig.AppName = Object.keys(MantraConfig.Apps)[0];
        
        MantraConfig.ActiveServicesByComponent = appConfig.ActiveServicesByComponent;
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
        }
        
        if ( appConfig.LandingView ) {
            MantraConfig.LandingView = appConfig.LandingView;
        }
    }
}