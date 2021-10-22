"use strict";

const CoreCronHandlers = require("./coreCronHandlers");
const CoreMiddlewareHandlers = require("./coreMiddlewareHandlers");

class Core {
    async onStart( MantraAPI ) {       
        MantraAPI.Hooks("core")
            .Middleware([
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.SanitizedPath,
                    Weight: -5000
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.SetMantraAPI,
                    Weight: -1200
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.CheckLanding,
                    Weight: -180
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.IndexMiddleware,
                    Weight: -175
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.ValidatePostData,
                    Weight: -50
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.PreRequest,
                    Weight: -48
                },
                {
                    MiddlewareHandler: CoreMiddlewareHandlers.AccessCondition,
                    Weight: -46
                }])
                .Cron( [{
                    CronConfig: "croncleanupevent",
                    CronHandler: CoreCronHandlers.EmitCleanUpEvent
                }, {
                    CronConfig: "cronbackupevent",
                    CronHandler: CoreCronHandlers.EmitBackupEvent
                }]);
    }

    async onCheckHealth( MantraAPI ) {
        await require("./coreCheckHealth").checkHealth( MantraAPI );
    }
}

module.exports = () => {
    return {
        Start: new Core()
    };
}