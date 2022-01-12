/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const StaticApiHandlers = require("./staticApiHandlers");
const StaticMiddlewareHandlers = require("./staticMiddlewareHandlers");

class Static {
    async onStart( MantraAPI ) {
        let cached = MantraAPI.GetComponentConfig("static").cached;

        MantraAPI.Hooks("static")
            .Middleware({
                MiddlewareHandler: cached && cached == true ? StaticMiddlewareHandlers.CheckStaticCached : StaticMiddlewareHandlers.CheckStatic,
                Weight: -999
            })
            .Api([{
                APIName: "iscomponentresource",
                APIHandler: StaticApiHandlers.IsComponentResource
            }, {
                APIName: "getfile",
                APIHandler: cached && cached == true ? StaticApiHandlers.GetFileCached : StaticApiHandlers.GetFile
            }, {
                APIName: "getfullpathtoresource",
                APIHandler: StaticApiHandlers.GetFullPathToResource
            }]);
    }
}

module.exports = () => {
    return {
        Start: new Static()
    }
}