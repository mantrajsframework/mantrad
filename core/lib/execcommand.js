"use strict";

const cp = require('child_process');

module.exports = {
    exec: function(command) {
        return new Promise( (resolve, reject) => {
            cp.exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });    
        });
    }
}