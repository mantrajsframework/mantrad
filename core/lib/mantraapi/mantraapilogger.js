/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreConstants = global.gimport("coreconstants");
const MantraConsole = global.gimport("mantraconsole");

let logApi = null;

const addNewLogImpl = async ( MantraAPI, type, description, data = "", key = "", counter = 0) => {
    logApi = ( logApi != null ? logApi : getLogApiImpl(MantraAPI) );

    const finalDescription = `(${MantraAPI.GetAppName()}) ${description}`;

    if ( global.Mantra.Initialized && logApi && logApi !== "" ) {
        return MantraAPI.Invoke( logApi, {
            type: type,
            key: key,
            counter: counter,
            description: finalDescription,
            data: data ? data : ""
        } );
    } else {
        switch( type ) {
            case CoreConstants.LOGTYPE_INFO: {
                MantraConsole.info( finalDescription );
                break;
            }
            case CoreConstants.LOGTYPE_WARNING: {
                MantraConsole.warning( finalDescription );
                break;
            }
            case CoreConstants.LOGTYPE_ERROR: {
                MantraConsole.error( finalDescription );
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

const getLogApiImpl = (MantraAPI) => {
    return MantraAPI.GetInjection( MantraAPI.Config("core.logapi") );
}

exports.addNewLog = addNewLogImpl;
exports.getLogApi = getLogApiImpl;