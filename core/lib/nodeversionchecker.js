"use strict";

module.exports = {
    CheckNodeVersion: (supportedVersions) => {
        let currentNodeVersion = parseInt(process.version.substr(1).split(".")[0]);
        
        return supportedVersions.includes( currentNodeVersion );
    }
}