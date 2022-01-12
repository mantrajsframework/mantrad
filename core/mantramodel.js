/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");

const CoreConstants = global.gimport("coreconstants");

class MantraModel {
    LoadModel() {
        return require( Path.join( __dirname, CoreConstants.MODEL_FOLDER, CoreConstants.MANTRASCHEMA_FILENAME) );
    }
}

module.exports = () => new MantraModel();