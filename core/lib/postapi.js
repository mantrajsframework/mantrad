/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraUtils = global.gimport("mantrautils");

module.exports = {
    Post: async (fullPath, data) => {
        const dataToSend = data ? data : {};

        const apiParts = MantraUtils.ExtractValues( fullPath, "{protocol}://{host}/{componenttocall}/{commandtocall}" );

        if ( apiParts == null ) throw new Error(`Unkown path or format invalid for api post: ${fullPath}`);

        const postParams = JSON.stringify(dataToSend);

        const postOptions = {
          hostname: apiParts.host,
          port: getPortFromProtocolAndHost( apiParts.protocol, apiParts.host ),
          path: `/${apiParts.componenttocall}/${apiParts.commandtocall}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': postParams.length
          }
        }

        return Post( getProtocolClient( apiParts.protocol ), postOptions, postParams );
    }
}

function getPortFromProtocolAndHost( protocol, host ) {
    if ( protocol == 'http' && host == "localhost" ) return 3084;
    if ( protocol == 'http' && host != "localhost" ) return 80;
    if ( protocol == 'https') return 443;

    throw new Error( `Not allowed protocol and/or host: ${protocol} ${host}`);
}

function getProtocolClient( protocol ) {
    switch( protocol ) {
        case "http": return require("http");
        case "https": return require("https");
        default: throw Error(`Unknown protocol named ${protocol}`);
    }
}

function Post(protocolClient, postOptions, postParams) {
    return new Promise( (resolve,reject) => {
        const req = protocolClient.request(postOptions, res => {
            let payload = "";
          
            res.on('data', d => {
                payload += d;
            })
          
            res.on('end', () => {
                if ( res.statusCode == 200 ) {
                    resolve(JSON.parse(payload));
                } else {
                    reject( `API call error with status: ${res.statusCode}`);
                }
            })
          })
          
          req.on('error', error => {
            reject(error);
          })      
          
        req.write(postParams);
        req.end();
    })
};