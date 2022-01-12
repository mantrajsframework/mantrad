/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraUtils = global.gimport("mantrautils");

module.exports = {
    SendContent: ( localPath, ext, response ) => {
        response.set('Content-Type', MantraUtils.GetMIMETypes()[ext]);
        response.sendFile( localPath );
    },
    
    SendCachedContent: ( key, ext, response, cache ) => {  
        response.set('Cache-Control', 'public, max-age=31557600');
        response.set('Content-Type', MantraUtils.GetMIMETypes()[ext]);
        response.send( cache[key] );
    }
}