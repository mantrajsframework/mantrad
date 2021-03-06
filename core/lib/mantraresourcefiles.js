/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

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

        const translateJsApi = MantraAPI.GetInjection( MantraAPI.Config("core.translatejsapi") ); 
        
        if ( translateJsApi ) {
            let jsFiles = await MantraAPI.Invoke( translateJsApi, resources);
          
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

        const translateCssApi = MantraAPI.GetInjection( MantraAPI.Config("core.translatecssapi") );

        if ( translateCssApi ) {
            return MantraAPI.Invoke( translateCssApi, resources );
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