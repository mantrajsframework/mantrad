/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");
const { fork } = require('child_process');

let mantraProcesses = [];

module.exports = {
    fork: (mantraRootFolder, app) => {
        const forkProcess = fork( `${Path.join(mantraRootFolder,'mantradfork.js')}`, ['startapp', app]);

        mantraProcesses.push(forkProcess);
    },

    killAll: () => {
        return new Promise( (resolve, reject) => {
            try {
                let processesKilled = 0;
                
                for( const mantraProcess of mantraProcesses ) {
                    mantraProcess.on('exit', () => {
                        processesKilled++;

                        if ( processesKilled == mantraProcesses.length) {
                            mantraProcesses = [];
                            resolve();
                        }
                    }); 

                    mantraProcess.kill('SIGINT');
                }        
            } catch(err) { reject(err); }
        });
    }
}