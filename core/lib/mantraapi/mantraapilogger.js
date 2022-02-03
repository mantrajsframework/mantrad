/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    addNewLog: async ( MantraAPI, type, description, data = "", key = "", counter = 0) => {
        const logApi = MantraAPI.GetInjection( MantraAPI.Config("core.logapi") );

        if ( global.Mantra.Initialized && logApi && logApi !== "" ) {
            return MantraAPI.Invoke( logApi, {
                type: type,
                key: key,
                counter: counter,
                description: description,
                data: data ? data : ""
            } );
        } else {
            switch( type ) {
                case CoreConstants.LOGTYPE_INFO: {
                    MantraConsole.info( description );
                    break;
                }
                case CoreConstants.LOGTYPE_WARNING: {
                    MantraConsole.warning( description );
                    break;
                }
                case CoreConstants.LOGTYPE_ERROR: {
                    MantraConsole.error( description );
                    break;
                }
                default: {
                    MantraConsole.error( `Unknown error of type '${type}'. Message: ${description}`);
                }
            }

            if ( data !== "" ) console.log("Data:", JSON.stringify(data, null, 4));
            if ( key !== "") console.log(`Key: ${key}` );
        }
    }
}