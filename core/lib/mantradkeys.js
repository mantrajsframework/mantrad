/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraConsole = global.gimport("mantraconsole");
const MantradProcess = global.gimport("mantradprocess");

module.exports = {
    configureKeys: async (mantraRootFolder, appNames) => {
        var stdin = process.openStdin();

        stdin.setRawMode(true);
        stdin.resume();
        
        stdin.on('keypress', async (chunk, key) => {
            if (key.ctrl) {
                switch (key.name) {
                    case 'c': {
                        await MantradProcess.killAll();
                        process.exit(0);
                    }
                    case 'r': {
                        MantraConsole.newline();
                        MantraConsole.info('Restarting...');
                        MantraConsole.newline();
    
                        await MantradProcess.killAll();
    
                        for( const appName of appNames ) {
                            MantradProcess.fork(mantraRootFolder, appName);
                        }
                    }
                    break;
                }
            }
        });
    }
}