"use strict";

const MantraConsole = global.gimport("mantraconsole");

module.exports = {
    exitByError: (msg) => {
        MantraConsole.error(msg);

        process.exit(1);
    },

    exit: () => { process.exit(1); }
}