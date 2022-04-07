/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    CheckNodeVersion: (supportedVersions) => {
        let currentNodeVersion = parseInt(process.version.substring(1).split(".")[0]);
        
        return supportedVersions.includes( currentNodeVersion );
    }
}