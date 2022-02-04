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

module.exports = {
    isValidConfigFile: ( fullPathToComponent ) => {
        const mantraConfigFile = require( Path.join( fullPathToComponent, CoreConstants.COMPONENTS_CONFIGFILENAME ) );
        const validator = new JsonValidator();
        const validationResult = validator.validate( mantraConfigFile, mantraConfigValidationSchema );
    
        return validationResult.errors.length == 0;
    }
}