/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraUtils = global.gimport("mantrautils");
const Path = require("path");

let rootFolder = "";

module.exports = {
    getArgs: async () => {
        let args = {};
        let mainCommand = process.argv[2];
        rootFolder = process.cwd();

        if ( process.argv.length > 2 ) {
            // Extract project location
            let command = Path.basename(process.argv[2]);
            let folder = Path.dirname(process.argv[2]);
    
            if ( folder.charAt(0) == "." ) {
                folder = Path.join( process.cwd(), folder );
            }
    
            if ( await MantraUtils.ExistsDirectory(folder) ) {
                mainCommand = command;
                rootFolder = folder;
            }
        }
    
        args.hasArgs = process.argv.length > 2;

        if ( args.hasArgs ) {
            args.command = process.argv.length == 2 ? "--help" : mainCommand;
            args.arg1 = process.argv[3] ? process.argv[3] : undefined;
            args.arg2 = process.argv[4] ? process.argv[4] : undefined;
        }

        return args;
    },

    getRootFolder: () => rootFolder
}