/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreConstants = global.gimport("coreconstants");
const DownloadFile = global.gimport("downloadfile");
const MantraUtils = global.gimport("mantrautils");
const PostApi = global.gimport("postapi");

module.exports = {
    /*
     * Call Mantra API endpoint /mantrajspublicapi/getdownloadtokenforcomponent to get a
     * token to download a component.
     * Params: 
     * {
     *    userMail: <mail of the user>,
     *    userLicense: <license for the user>,
     *    componentNameRequested: <component to download in with the format 'component name' or 'component name'@'version'>
     * } 
     */
    GetDownloadTokenForComponent: async ( data ) => {
        return PostApi.Post( `${CoreConstants.APIMANTRAWEBSITEENDPOINT}/mantrajspublicapi/getdownloadtokenforcomponent`, data );
    },

    GetDownloadComponent: async (downloadToken, destinationFolder) => {
        const urlToDownload = getUrlToDownloadFromToken(downloadToken);

        return DownloadFile.downloadFromUrl(urlToDownload, destinationFolder);
    }
}

function getUrlToDownloadFromToken(downloadToken) {
    let url = `${CoreConstants.APIMANTRAWEBSITEENDPOINT}/mantrajspublicapi/download?token=${downloadToken}`;
    const urlParts = MantraUtils.ExtractValues( url, "{protocol}://{host}/{componenttocall}/{commandtocall}" );
    const port = getPortFromProtocolAndHost( urlParts.protocol, urlParts.host );

    if ( port != 80 && port != 443 ) {
        return `${CoreConstants.APIMANTRAWEBSITEENDPOINT}:${port}/mantrajspublicapi/download?token=${downloadToken}`;
    } else {
        return url;
    }
}

function getPortFromProtocolAndHost( protocol, host ) {
    if ( protocol == 'http' && host == "localhost" ) return 3084;
    if ( protocol == 'http' && host != "localhost" ) return 80;
    if ( protocol == 'https') return 443;

    throw new Error( `Not allowed protocol and/or host: ${protocol} ${host}`);
}
