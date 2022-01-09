"use strict";

const CoreConstants = global.gimport("coreconstants");
const PostApi = global.gimport("postapi");

module.exports = {
    GetDownloadTokenForComponent: async ( data ) => {
        return PostApi.Post( `${CoreConstants.APIMANTRAWEBSITEENDPOINT}/mantrajspublicapi/getdownloadtokenforcomponent`, data );
    }
}