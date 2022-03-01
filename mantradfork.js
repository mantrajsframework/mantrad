#!/usr/bin/env node

/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");
const mantraconsole = require("./core/lib/mantraconsole");

require("gimport").init(__dirname);

const CoreConstants = global.gimport("coreconstants");
const MantraConfig = global.gimport("mantraconfig");
const MantraConsole = global.gimport("mantraconsole");
const MantraStartup = global.gimport("mantrastartup")();

(async () => {
    const args = getArgs();
    const config = await loadMantraConfig();

    MantraConsole.setAppName( args.arg1 ? args.arg1 : ( config.Apps ? Object.keys(config.Apps)[0] : "main" ) );

    await MantraStartup.startApp(config, args);
})();

async function loadMantraConfig() {
    return MantraConfig.LoadFullConfig(Path.join(__dirname, CoreConstants.CORECOMPONENTSFOLDER), 
        getFullPathToConfigFile(), 
        process.cwd());
}

function getFullPathToConfigFile() {
    return Path.join(process.cwd(), CoreConstants.MANTRACONFIGFILE);
}

function getArgs() {
    let args = {};

    args.hasArgs = process.argv.length > 2;

    if ( args.hasArgs ) {
        args.command = process.argv.length == 2 ? "--help" : process.argv[2];
        args.arg1 = process.argv[3] ? process.argv[3] : undefined;
        args.arg2 = process.argv[4] ? process.argv[4] : undefined;
    }

    return args;
}