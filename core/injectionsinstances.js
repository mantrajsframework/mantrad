/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");

let injectionsInstances = {};

module.exports = {
    BuildInjectionsInstances: (injections, apisInstances) => {
        for( const injectionName of Object.keys(injections) ) {
            const injectionApi = injections[injectionName];

            if ( injectionApi != "" ) {
                const apiParts = MantraUtils.ExtractValues( injectionApi, "{componentname}.{apiname}");
    
                if ( apiParts && apisInstances[apiParts.componentname] && apisInstances[apiParts.componentname][apiParts.apiname] ) {
                    injectionsInstances[injectionName] = apisInstances[apiParts.componentname][apiParts.apiname];
                } else {
                    MantraConsole.error( `Unknown API '${injectionApi}' for injection named '${injectionName}'` );                    
                }
            }
        }
    },

    GetInjectionsInstances: () => injectionsInstances,
}