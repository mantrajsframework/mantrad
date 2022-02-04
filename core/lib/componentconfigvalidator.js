/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreConstants = global.gimport("coreconstants");
const JsonValidator = new require("jsonschema").Validator;
const Path = require("path");

const mantraConfigValidationSchema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "version": { "type": "string" }
    },
    "required": ["name", "version"]
};

const isValidConfigJsonImpl = (mantraConfigFile) => {
    const validationResult = (new JsonValidator()).validate( mantraConfigFile, mantraConfigValidationSchema );

    return validationResult.errors.length == 0;
}

const isValidConfigFileImpl = (fullPathToComponent) => {
    const mantraConfigFile = require(Path.join(fullPathToComponent, CoreConstants.COMPONENTS_CONFIGFILENAME));

    return isValidConfigJsonImpl(mantraConfigFile);
}

module.exports.isValidConfigFile = isValidConfigFileImpl;
module.exports.isValidConfigJson = isValidConfigJsonImpl;
