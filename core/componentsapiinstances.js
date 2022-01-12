/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

let apiInstances = {};

module.exports = {
    BuildApiInstances: (apis) => {
        for( const api of apis ) {
            if ( !apiInstances[api.Component] ) apiInstances[api.Component] = {};
            
            apiInstances[api.Component][api.APIName] = api.APIHandler;
        }
    },

    GetApiInstances: () => apiInstances
}