"use strict";

const CoreConstants = global.gimport("coreconstants");
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
    }
}