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