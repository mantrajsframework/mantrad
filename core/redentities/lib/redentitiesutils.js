/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    FromJsonToBase64: function( json ) {
        return (new Buffer.from( JSON.stringify( json ) )).toString("base64");
    },

    FromBase64ToJson: function( base64string ) {
        return JSON.parse((Buffer.from( base64string, "base64" )).toString());
    }
}