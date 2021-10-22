"use strict";

module.exports = {
    LookupPath: async (req,res,next) => {
        if ( res.MantraAPI.IsGet() ) { 
            await CheckPathAndAddValues(res.MantraAPI, req.path);
        }
        
        next();
    }
}
/*
 * Parses url and if <component name>.getseoinfo API exists,
 * then calls it to retrieve seo info from specific component.
 */
async function CheckPathAndAddValues(MantraAPI, path) {
    try {
        let seoConfig = MantraAPI.GetComponentConfig("seo");
        let seoUrl = `${seoConfig.defaultsiteurl}${path}`;
        let seoTitle = seoConfig.defaultsitetitle;
        let asset = MantraAPI.Extend.Extractvalues(path, "/{component}/{id}");

        if ( asset ) {
            let apiToCall = `${asset.component}.getseoinfo`;
            
            // Calls component api "<component name>.getseoinfo" if exists to retrieve seo info
            if ( await MantraAPI.ExistsComponentApi(apiToCall) ) {
                let seoComponentInfo = await MantraAPI.Invoke( apiToCall, asset.id );
                
                seoTitle = seoComponentInfo.title == "" ? seoTitle : seoComponentInfo.title; 
            }
        }
        
        MantraAPI.AddRenderValues( { "seo-title": seoTitle, "seo-url": seoUrl } );        
    } catch (err) {
        return MantraAPI.LogError( err.message, err );
    }
}