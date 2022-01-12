/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CoreCommandsHandlers = require("./coreCommandsHandlers");
const CoreConstants = global.gimport("coreconstants");

class CoreCommandsStarter {
    async onStart(MantraAPI) {
        MantraAPI.Hooks("corecommands")
            .Command([{
                Name: "install-component",
                Description: "Install a new component. Use: mantrad install-component <component name>",
                Handler: CoreCommandsHandlers.InstallComponent
            }, {
                Name: "uninstall-component",
                Description: "Uninstall component. Use: mantrad uninstall-component <component name>",
                Handler: CoreCommandsHandlers.UinstallComponent
            }, {
                Name: "enable-component",
                Description: "Enable a component. Use: mantrad enable-component <component name>",
                Handler: CoreCommandsHandlers.EnableComponent
            }, {
                Name: "disable-component",
                Description: "Disable a component. Use: mantrad disable-component <component name>",
                Handler: CoreCommandsHandlers.DisableComponent
            }, {
                Name: "gzip-component",
                Description: "Gzip a component. Use: mantrad gpzip-component <component name>",
                Handler: CoreCommandsHandlers.GzipComponent
            }, {
                Name: "reinstall-component",
                Description: "Uninstall and install a component. Use: mantrad reinstall-component <component name>",
                Handler: CoreCommandsHandlers.ReinstallComponent
            }, {
                Name: "download-component",
                Description: `Download a component from ${CoreConstants.MANTRAWEBSITE} site. Use: mantrad download-component <component name>|<component name@version>`,
                Handler: CoreCommandsHandlers.DownloadComponent

            }, {
                Name: "update-components-locations",
                Description: "Updates components locations after moving some component to a new location. Use: mantrad update-components-locations",
                Handler:CoreCommandsHandlers.UpdateComponentsLocations
            }, {
                Name: "show-components-to-update",
                Description: "Show the components that should be updated.",
                Handler: CoreCommandsHandlers.ShowComponentsToUpdate
            }, {
                Name: "update",
                Description: "Updates the system.",
                Handler: CoreCommandsHandlers.UpdateSystem
            }, {
                Name: "new-component",
                Description: "Creates the skeleton for a new component. Use: mantrad new-component",
                Handler: CoreCommandsHandlers.NewComponent
            }, {
                Name: "show-components",
                Description: "Show all components. Use: mantrad show-components",
                Handler: CoreCommandsHandlers.ShowComponents
            }, {
                Name: "show-component",
                Description: "Show component info. Use: mantrad show-components <component name>",
                Handler: CoreCommandsHandlers.ShowComponent
            }, {
                Name: "show-apis",
                Description: "Show apis defined by components. Use mantrad show-apis <component name, optional>",
                Handler: CoreCommandsHandlers.ShowApis
            }, {
                Name: "show-blocks",
                Description: "Show blocks defined by components. Use mantrad show-blocks <component name, optional>",
                Handler: CoreCommandsHandlers.ShowBlocks
            }, {
                Name: "show-accessconditions",
                Description: "Show access conditions defined by components. User mantrad show-accessconditions <component name, optional>",
                Handler: CoreCommandsHandlers.ShowAccessConditions
            }, {
                Name: "show-apps",
                Description: "Show apps defined in configuration file. Use mantrad show-apps",
                Handler: CoreCommandsHandlers.ShowApps
            }, {
                Name: "show-posts",
                Description: "Show http posts defined by components. Use mantrad show-posts <component name, optional>",
                Handler: CoreCommandsHandlers.ShowPosts
            }, {
                Name: "show-gets",
                Description: "Show http gets defined by components. Use mantrad show-gets <component name, optional>",
                Handler: CoreCommandsHandlers.ShowGets
            }, {
                Name: "show-views",
                Description: "Show views defined by components. Use mantrad show-blocks <component name, optional>",
                Handler: CoreCommandsHandlers.ShowViews
            }, {
                Name: "show-events-subscribers",
                Description: "Show events subscribers defined by components. Use mantrad show-event-subscribers <component name, optional>",
                Handler: CoreCommandsHandlers.ShowEventsSubscribers
            },{
                Name: "show-middlewares",
                Description: "Show components middlewares in order of calling. Use mantrad show-middlewares <component name, optional>",
                Handler: CoreCommandsHandlers.ShowMiddlewares
            }, {
                Name: "show-commands",
                Description: "Show commands defined by components. Use mantrad show-commands <component name, optional>",
                Handler: CoreCommandsHandlers.ShowCommands
            }, {
                Name: "check-health",
                Description: "Check system status and health",
                Handler: CoreCommandsHandlers.CheckHealth
            }]);
    }
}

module.exports = () => {
    return {
        Start: new CoreCommandsStarter()
    };
}