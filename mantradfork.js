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
const MantradArgs = global.gimport("mantradargs");
const MantraConfig = global.gimport("mantraconfig");
const MantraConsole = global.gimport("mantraconsole");
const MantraStartup = global.gimport("mantrastartup")();

(async () => {
    const args = await MantradArgs.getArgs();
    const config = MantraConfig.LoadFullConfigFromProject( __dirname, MantradArgs.getRootFolder() );

    MantraConsole.setAppName( args.arg1 ? args.arg1 : ( config.Apps ? Object.keys(config.Apps)[0] : "main" ) );

    await MantraStartup.startApp(config, args);
})();