"use strict";

const Mustache = require("mustache");
const HtmlMinifier = require("html-minifier");

Mustache.templateCache = undefined;
// Need to disable Mustache cache cause in Mantra provokes a memory leak.
// This is due to many html are generated dynamically, with elements id based on UUIDS
// Mustache caches the tamplate, and, so that these are always differents, the cache increases,
// provoking a memory leak


const HTML_MINIFIER_CONFIG = { 
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeTagWhitespace: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true
};

let minifierFnc = null;

module.exports = {
    RenderHtml( html, dataValues ) {
        return Mustache.render(html, dataValues);
    },

    ParseBlocks( html ) {
        return Mustache.parse( html, ["{{{", "}}}"] );
    },

    async MinifyHtml(html) {
        if ( minifierFnc == null ) {
            const coreConfig = global.Mantra.MantraAPIFactory().GetComponentConfig("core");
    
            if ( coreConfig.minifyhtml && coreConfig.minifyhtml == true ) {
                minifierFnc = async function(html) {
                    return HtmlMinifier.minify( html, HTML_MINIFIER_CONFIG );
                }
            } else {
                minifierFnc = async function(html) { return html; }
            }
        }
        
        return minifierFnc(html);
    }
}