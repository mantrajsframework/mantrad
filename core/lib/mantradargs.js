/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    getArgs: () => {
        let args = {};

        args.hasArgs = process.argv.length > 2;

        if ( args.hasArgs ) {
            args.command = process.argv.length == 2 ? "--help" : process.argv[2];
            args.arg1 = process.argv[3] ? process.argv[3] : undefined;
            args.arg2 = process.argv[4] ? process.argv[4] : undefined;
        }

        return args;
    }
}