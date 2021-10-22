"use strict";

module.exports = {
    async GetJSFiles(MantraAPI, jsFiles) {
        let resources = [];

        // Initialize MantraAPI object for cliente side. This file should be the first file to load
        jsFiles.unshift("core.mantracoreapi");

        for( const resource of jsFiles ) {            
            let resourceParts = MantraAPI.Utils.ParseComponentPath( resource );

            if ( !resourceParts ) throw Error( `Bad resource path: ${resource}` );
    
            resources.push( { ComponentName: resourceParts.component, 
                              FileName: resourceParts.asset } );                              
        }

        if ( MantraAPI.GetComponentConfig("core").translatejsapi ) {
            let jsFiles = await MantraAPI.Invoke( MantraAPI.GetComponentConfig("core").translatejsapi, resources);
          
            jsFiles += this.GetMantraAPIScript(MantraAPI);
            
            return jsFiles;
        }
    
        let jsFilesScripts = [];

        for( const jsFile of resources ) {
            let jsFileLocation = await MantraAPI.GetAssetsLocations().GetJsLocation( jsFile.ComponentName, jsFile.FileName );
            
            jsFileLocation = jsFileLocation.replace( jsFile.FileName, global.Mantra.MantraConfig.InstanceId+jsFile.FileName);
            jsFilesScripts.push( `<script src='/${jsFileLocation}'></script>` );
        }    

        jsFilesScripts.push( this.GetMantraAPIScript(MantraAPI) );

        return MantraAPI.Utils.Underscore.uniq(jsFilesScripts).join('');
    },

    async GetCSSFiles(MantraAPI, cssFiles) {
        let resources = [];

        for( const resource of cssFiles ) {
            const resourceParts = MantraAPI.Utils.ParseComponentPath( resource );

            if ( !resourceParts ) throw Error( `Bad resource path: ${resource}` );
    
            resources.push( { ComponentName: resourceParts.component, 
                              FileName: resourceParts.asset } );
        }

        if ( MantraAPI.GetComponentConfig("core").translatecssapi ) {
            return MantraAPI.Invoke( MantraAPI.GetComponentConfig("core").translatecssapi, resources );
        }

        let cssFilesScripts = [];
        
        for( const cssFile of resources ) {
            let cssFileLocation = await MantraAPI.GetAssetsLocations().GetCssLocation( cssFile.ComponentName, cssFile.FileName );

            cssFileLocation = cssFileLocation.replace( cssFile.FileName, global.Mantra.MantraConfig.InstanceId+cssFile.FileName);
            cssFilesScripts.push( `<link type='text/css' rel='stylesheet' media='all' href='/${cssFileLocation}'/>` );
        }
    
        return MantraAPI.Utils.Underscore.uniq(cssFilesScripts).join('');
    },

    GetMantraAPIScript(MantraAPI) {
        return MantraAPI.Utils.Underscore.isEmpty(MantraAPI.GetDataValues()) ? "" : `<script>MantraAPI.data = ${JSON.stringify(MantraAPI.GetDataValues())};</script>`;
    }
}