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