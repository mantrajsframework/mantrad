"use strict";

const SeoMiddlewareHandlers = require("./seoMiddlewareHandlers");

class SeoStarter {
    async onStart(MantraAPI) {
        MantraAPI.Hooks("seo")
            .Middleware([
                {
                    MiddlewareHandler: SeoMiddlewareHandlers.LookupPath,
                    Weight: -178 // Just before landing middleware, which sets the user landing page
                }]);
    }
}

module.exports = () => {
    return {
        Start: new SeoStarter()
    };
}