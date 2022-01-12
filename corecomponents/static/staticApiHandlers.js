/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const path = require("path");

let cachedContent = [];

function GetComponentResourceParts(path) {
    let s = path.split('/');

    if ( s.length >= 3 ) {
        const componentName = s[1];
        s.shift();
        s.shift();

        return {
            componentName: componentName,
            resource: s.join('/')
        }
    }

    return undefined;
}

module.exports = {
    /*
     * API static.iscomponentresource
     * Checks if a resource path points to an existing resource (mime file) of a component
     * Param:
     *    resourcePath: <local path to resource file, like /users/img/avatar.png>
     * Returns:
     * {
     *    isComponenResource: true|false indicated if it is a component resource
     *    fullPathToResource: <full path to resource file>
     * }
     */
    IsComponentResource: async (MantraAPI, resourcepath) => {
        return isComponentResource(MantraAPI, resourcepath);
    },

    /*
     * API static.getfile, when cached component value is true
     * Returns a file and stores it to cache.
     * Params:
     *    fullPathToFile: <full path to file>
     *    isBinary: <true if file is binary, false if it is text, optional. If not set, then the file is read as text>
     */
    GetFileCached: async (MantraAPI, params ) => {
        if ( !cachedContent[params.fullPathToFile] ) {
            if ( params.isBinary && params.isBinary == true ) {
                cachedContent[params.fullPathToFile] = await  MantraAPI.Utils.ReadFileAsync( params.fullPathToFile );
            } else {
                cachedContent[params.fullPathToFile] = await MantraAPI.Utils.readTextFileAsync( params.fullPathToFile );
            }
        }

        return cachedContent[params.fullPathToFile];
    },

    /*
     * API static.getfile, when cached component value is false
     * Params:
     *    fullPathToFile: <full path to file>
     *    isBinary: <true if file is binary, false if it is text, optional. If not set, then the file is read as text>
     */
    GetFile: async (MantraAPI, params ) => {
        if ( params.isBinary && params.isBinary == true ) {
            return MantraAPI.Utils.ReadFileAsync( params.fullPathToFile );
        } else {
            return MantraAPI.Utils.readTextFileAsync( params.fullPathToFile );
        }
    },

    /*
     * API static.getfullpathtoresource
     * Returns the full path to a resource (js, css, etc.)
     * localResourcePath is a local path to a resource in frontend or component, like /books/js/book.css
     */
    GetFullPathToResource: async (MantraAPI, localResourcePath ) => {
        let fullPathToResource = "";
        let ext = path.extname(localResourcePath);
        
        if ( MantraAPI.Utils.IsMIMEType(ext) ) {
            // Check if static file requested exists
            let localFile = path.join( global.Mantra.MantraConfig.FrontendLocation, localResourcePath );
            let isFrontendResource = await MantraAPI.Utils.FileExists( localFile );

            if ( isFrontendResource ) {
                fullPathToResource = localFile;
            } else {
                // Check if it is a component resource (css, js, etc.)            
                let componentResource = await isComponentResource(MantraAPI, localResourcePath);

                if ( componentResource.isComponentResource ) {
                    fullPathToResource = componentResource.fullPathToResource;
                }
            }        
        }
        
        return fullPathToResource;
    }
}

async function isComponentResource(MantraAPI, resourcepath) {
    let result = { isComponentResource: false };
    let componentResourceParts = GetComponentResourceParts(resourcepath);
    let componentsLoader = global.Mantra.ComponentsLoader;
    let utils = MantraAPI.Utils;

    if ( typeof componentResourceParts == 'undefined' ) { return result; }

    if (componentsLoader.existsComponentByName(componentResourceParts.componentName) &&
        utils.IsMIMEType( path.extname(resourcepath)) ) {
        let cmp = componentsLoader.getComponentByName(componentResourceParts.componentName);
        let fileToSend = path.join(cmp.pathToComponent, componentResourceParts.resource);

        if (await utils.FileExists(fileToSend)) {
            result.isComponentResource = true;
            result.fullPathToResource = fileToSend;
        }
 
        fileToSend = path.join(cmp.pathToComponent, "ui", componentResourceParts.resource);

        if (await utils.FileExists(fileToSend)) {
            result.isComponentResource = true;
            result.fullPathToResource = fileToSend;
        }
    }

    return result;    
}