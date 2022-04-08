/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const path = require("path");

const StaticApiHandlers = require("./staticApiHandlers");
const MantraUtils = global.gimport("mantrautils");
const StaticUtils = require("./staticUtils");

let cachedContent = [];

module.exports = {
    CheckStatic: async ( req, res, next ) => {
        if ( req.method !== "GET" ) { next(); }
        else {
            let ext = path.extname(req.path);
            let pathSanitized = req.sanitizedPath;

            if ( MantraUtils.IsMIMEType(ext) ) {
                // Check if static file requested exists
                let localFile = path.join( global.Mantra.MantraConfig.FrontendLocation, pathSanitized );
                let isFrontendResource = await MantraUtils.FileExists( localFile );
        
                if ( isFrontendResource ) {
                    StaticUtils.SendContent( localFile, ext, res );
                } else {
                    // Check if it is a component resource (css, js, etc.)            
                    let componentResource = await StaticApiHandlers.IsComponentResource(res.MantraAPI, pathSanitized);
    
                    if ( componentResource.isComponentResource ) {
                        StaticUtils.SendContent( componentResource.fullPathToResource, ext, res );
                    } else {
                        // Otherwise, should be a path routed by a component or index
                        next();
                    }
                }        
            } else next();
        }
    },
    
    CheckStaticCached: async ( req, res, next ) => {
        if ( req.method !== "GET" ) { next(); }
        else {
            let ext = path.extname(req.path);
            let pathSanitized = req.sanitizedPath;
    
            if ( cachedContent[pathSanitized] ) {
                StaticUtils.SendCachedContent( pathSanitized, ext, res, cachedContent );
            } else {            
                if ( MantraUtils.IsMIMEType(ext) ) {
                    // Check if static file requested exists
                    let localFile = path.join( global.Mantra.MantraConfig.FrontendLocation, pathSanitized );
                    let isFrontendResource = await MantraUtils.FileExists( localFile );
    
                    if ( isFrontendResource ) {
                        cachedContent[pathSanitized] = await MantraUtils.ReadFileAsync( localFile );

                        StaticUtils.SendCachedContent( pathSanitized, ext, res, cachedContent );
                    } else {
                        // Check if it is a component resource (css, js, etc.)            
                        let componentResource = await StaticApiHandlers.IsComponentResource(res.MantraAPI, pathSanitized);
            
                        if ( componentResource.isComponentResource ) {
                            cachedContent[pathSanitized] = await MantraUtils.ReadFileAsync( componentResource.fullPathToResource );

                            StaticUtils.SendCachedContent( pathSanitized, ext, res, cachedContent );
                        } else {
                            // Otherwise, should be a path routed by a component or index
                            next();
                        }
                    }        
                } else next();    
            }
        }
    }    
}