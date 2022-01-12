/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    CheckCommandExists: ( commandname ) => {
        return new Promise( (resolve,reject) => {
            const commandExists = require("command-exists");
    
            commandExists(commandname)
                .then( (command) => {
                    resolve( command == commandname );
                })
                .catch( () => {
                    resolve( false);
                })
        });
    }
}