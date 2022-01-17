/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Mustache = require("mustache");

Mustache.templateCache = undefined;
// Need to disable Mustache cache cause in Mantra provokes a memory leak.
// This is due to many html are generated dynamically, with elements id based on UUIDS
// Mustache caches the tamplate, and, so that these are always differents, the cache increases,
// provoking a memory leak

module.exports = {
    RenderHtml( html, dataValues ) {
        return Mustache.render(html, dataValues);
    },

    ParseBlocks( html ) {
        return Mustache.parse( html, ["{{{", "}}}"] );
    }
}