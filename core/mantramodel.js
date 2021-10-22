"use strict";

const Path = require("path");

const CoreConstants = global.gimport("coreconstants");

class MantraModel {
    LoadModel() {
        return require( Path.join( __dirname, CoreConstants.MODEL_FOLDER, CoreConstants.MANTRASCHEMA_FILENAME) );
    }
}

module.exports = () => new MantraModel();