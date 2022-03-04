/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

module.exports = {
    Count: (result) => {
        return parseInt(result[0].count);
    },

    Exists: (result) => {
        if (result.length && result[0].count ) return parseInt(result[0].count) >= 1;

        return false;
    }
}