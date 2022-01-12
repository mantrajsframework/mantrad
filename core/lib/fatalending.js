/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    exitByError: (msg) => {
        MantraConsole.error(msg);

        process.exit(1);
    },

    exit: () => { process.exit(1); }
}