/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const CORE_COMPONENTS = ["core","static","scheduler","corecommands"];

module.exports = {
    CORECOMPONENTSFOLDER: "corecomponents",
    DEFAULT_ENTITIES_CONFIGURATION: "default",
    DEFAULT_ROOT_DOCUMENT: "index.html",
    MANTRACONFIGFILE: "mantraconfig.json",
    MANTRASCHEMA_FILENAME: "mantraschema.json",
    MODEL_FOLDER: "model",
    
    ACCESSCONDITION_HOOK: "accesscondition",
    API_HOOK: "api",
    APIEXTEND_HOOK: "apiextend",
    BLOCK_HOOK: "block",
    COMMAND_HOOK: "command",
    CORE_COMPONENTS: CORE_COMPONENTS,
    CRON_HOOK: "cron",
    DAL_HOOK: "dal",
    EVENT_HOOK: "event",
    EXTEND_HOOK: "extend",
    GET_HOOK: "get",
    MIDDLEWARE_HOOK: "middleware",
    POST_HOOK: "post",
    PREREQUEST_HOOK: "prerequest",
    VIEW_HOOK: "view",

    COMPONENTS_CONFIGFILENAME: "mantra.json",
 
    HOOKTYPES_API: 0,
    HOOKTYPES_BLOCK: 1,
    HOOKTYPES_CRON: 2,
    HOOKTYPES_DAL: 3,
    HOOKTYPES_EVENT: 4,
    HOOKTYPES_MIDDLEWARE: 5,
    HOOKTYPES_POST: 6,
    HOOKTYPES_GET: 7,
    HOOKTYPES_PREREQUEST: 8,
    HOOKTYPES_VIEW: 9,
    HOOKTYPES_ACCESSCONDITION: 10,
    HOOKTYPES_COMMAND: 11,
    HOOKTYPES_UNKNOWN: 100,
    
    MANTRA_CONTENT_BLOCK: "mantra-content-view",
    MANTRA_CSS_BLOCK: "mantra-css-files",
    MANTRA_CURRENT_VERSION_BLOCK: "current-version",
    MANTRA_INSTANCE_ID: "miid",
    MANTRA_JS_BLOCK: "mantra-js-files",

    NODESUPPORTEDVERSIONS: [12, 13, 14, 15, 16, 17],
    MANTRAWEBSITE: "https://www.mantrajs.com",
    APIMANTRAWEBSITEENDPOINT: "http://api.mantrajs.com",
    MANTRASUPPORTMAIL: "support@mantrajs.com",
    DOWNLOADEDFOLDER: "mantradownloaded",

    CRONALIASES: {
        "1s": "*/1 * * * * *",
        "5s": "*/5 * * * * *",
        "30s": "*/30 * * * * *",
        "1m": "0 */1 * * * *",
        "5m": "0 */5 * * * *",
        "30m": "0 */30 * * * *",
        "1h": "0 0 */1 * * *",
        "5h": "0 0 */5 * * *",
        "1d": "0 0 0 */1 * *"
    },

    IsCoreComponent: (coreComponent) => {
        return CORE_COMPONENTS.includes(coreComponent);
    }
}