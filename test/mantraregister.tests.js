const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

const MantraRegister = global.gimport("mantraregister");

let mantraAPI = undefined;
let mantraRegister = undefined;

describe( 'MantraAPI tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        mantraAPI = global.Mantra.MantraAPIFactory();
        mantraRegister = MantraRegister( mantraAPI, "testcomponent" );
    });

    it( '# View register', async () => {
        mantraRegister.View( { Command: "v", Handler: function() {} } );
    });

    it( '# View register with AccessCondition', async () => {
        mantraRegister.View( { Command: "v", Handler: function() {}, AccessCondition: ["ss"] } );
    });

    it( '# View register with PreRequest', async () => {
        mantraRegister.View( { Command: "v", Handler: function() {}, PreRequest: ["ss"] } );
    });

    it( '# View register missing command', async () => {
        try {
            mantraRegister.View( { Handler: function() {} } );
            assert.fail();
        } catch(err) {}
    });

    it( '# View register missing handler', async () => {
        try {
            mantraRegister.View( { Command: "ss", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# View register with Command bad type', async () => {
        try {
            mantraRegister.View( { Command: 22, Handler: function() {}, AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}        
    });

    it( '# View register with Handler bad type', async () => {
        try {
            mantraRegister.View( { Command: 22, Handler: "badtype", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Get register', async () => {
        mantraRegister.Get( { Command: "v", Handler: function() {} } );
    });

    it( '# Get register with AccessCondition', async () => {
        mantraRegister.Get( { Command: "v", Handler: function() {}, AccessCondition: ["ss"] } );
    });

    it( '# Get register with PreRequest', async () => {
        mantraRegister.Get( { Command: "v", Handler: function() {}, PreRequest: ["ss"] } );
    });

    it( '# Get register missing command', async () => {
        try {
            mantraRegister.Get( { Handler: function() {} } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Get register missing handler', async () => {
        try {
            mantraRegister.Get( { Command: "ss", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Get register with Command bad type', async () => {
        try {
            mantraRegister.Get( { Command: 22, Handler: function() {}, AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}        
    });

    it( '# Get register with Handler bad type', async () => {
        try {
            mantraRegister.Get( { Command: 22, Handler: "badtype", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Post register', async () => {
        mantraRegister.Post( { Command: "v", Handler: function() {} } );
    });

    it( '# Post register with AccessCondition', async () => {
        mantraRegister.Post( { Command: "v", Handler: function() {}, AccessCondition: ["ss"] } );
    });

    it( '# Post register with PreRequest', async () => {
        mantraRegister.Post( { Command: "v", Handler: function() {}, PreRequest: ["ss"] } );
    });

    it( '# Post register missing command', async () => {
        try {
            mantraRegister.Post( { Handler: function() {} } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Post register missing handler', async () => {
        try {
            mantraRegister.Post( { Command: "ss", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Post register with Command bad type', async () => {
        try {
            mantraRegister.Post( { Command: 22, Handler: function() {}, AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}        
    });

    it( '# Post register with Handler bad type', async () => {
        try {
            mantraRegister.Post( { Command: 22, Handler: "badtype", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# API register', async () => {
        mantraRegister.Api( { APIName: "v", APIHandler: function() {} } );
    });

    it( '# API register missing API name', async () => {
        try {
            mantraRegister.Api( { APIHandler: function() {} } );
            assert.fail();
        } catch(err) {}
    });

    it( '# API register missing API handler', async () => {
        try {
            mantraRegister.Api( { APIName: "ss" } );
            assert.fail();
        } catch(err) {}
    });

    it( '# API register with API name bad type', async () => {
        try {
            mantraRegister.Api( { APIName: 22, APIHandler: function() {} } );
            assert.fail();
        } catch(err) {}        
    });

    it( '# API register with API handler bad type', async () => {
        try {
            mantraRegister.Api( { APIName: "ss", APIHandler: "badtype" } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Block register', async () => {
        mantraRegister.Block( { BlockName: "v" } );
        mantraRegister.Block( { BlockName: "v2", RenderHandler: function() {} } );
    });

    it( '# Block register with AccessCondition', async () => {
        mantraRegister.Block( { BlockName: "v", RenderHandler: function() {}, AccessCondition: ["ss"] } );
    });

    it( '# Block register with PreRequest', async () => {
        mantraRegister.Block( { BlockName: "v", RenderHandler: function() {}, PreRequest: ["ss"] } );
    });

    it( '# Block register missing block name', async () => {
        try {
            mantraRegister.Block( { RenderHandler: function() {} } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Block register missing render hander', async () => {
        try {
            mantraRegister.Block( { BlockName: "ss", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Block register with block name bad type', async () => {
        try {
            mantraRegister.Block( { BlockName: 22, RenderHandler: function() {}, AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}        
    });

    it( '# Block register with render handler bad type', async () => {
        try {
            mantraRegister.Block( { BlockName: 22, RenderHandler: "badtype", AccessCondition: ["ac"] } );
            assert.fail();
        } catch(err) {}
    });

    it( '# Middleware register', async () => {
        mantraRegister.Middleware( { MiddlewareHandler: function() {} } );
        mantraRegister.Middleware( { MiddlewareHandler: function() {}, Weight: -12 } );
    });

    it( '# Middleware register without handler bad type', async () => {
        try {
            mantraRegister.Middleware( { MiddlewareHandler: "foo", Weight: -12 } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Middleware register without handler', async () => {
        try {
            mantraRegister.Middleware( { Weight: -12 } );
            assert.fail();
        } catch(err) {}
    });






    it( '# Event register', async () => {
        mantraRegister.Event( { EventName: "en", EventHandler: function() {} } );
    });

    it( '# Event register without event name', async () => {
        try {
            mantraRegister.Event( { EventHandler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Event register with bad event name type', async () => {
        try {
            mantraRegister.Event( { EventName: 12, EventHandler: function() {} } );
            assert.fail();

        } catch(err) {}
    });


    it( '# Event register without event handler', async () => {
        try {
            mantraRegister.Event( { EventName: "en" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Event register with bad event handler type', async () => {
        try {
            mantraRegister.Event( { EventName: 12, EventHandler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Cron register', async () => {
        mantraRegister.Cron( { CronConfig: "*/5 * * * * *", CronHandler: function() {} } );
    });

    it( '# Cron register without cron config', async () => {
        try {
            mantraRegister.Cron( { CronHandler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Cron register with cron config type', async () => {
        try {
            mantraRegister.Cron( { CronConfig: 12, CronHandler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Cron register without cron handler', async () => {
        try {
            mantraRegister.Cron( { CronConfig: "*/5 * * * * *" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Cron register with bad cron handler type', async () => {
        try {
            mantraRegister.Event( { CronConfig: "*/5 * * * * *", EventHandler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Cron register with bad cron configuration', async () => {
        try {
            mantraRegister.Event( { CronConfig: "*", EventHandler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Access condition register', async () => {
        mantraRegister.AccessCondition( { Name: "ac", Handler: function() {} } );
    });

    it( '# Access condition register without name config', async () => {
        try {
            mantraRegister.AccessCondition( { Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Access condition register with name config type', async () => {
        try {
            mantraRegister.AccessCondition( { Name: "ac", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Access condition register without handler', async () => {
        try {
            mantraRegister.AccessCondition( { Name: "ac" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Access condition register with bad handler type', async () => {
        try {
            mantraRegister.AccessCondition( { Name: "ac", Handler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Pre request register', async () => {
        mantraRegister.PreRequest( { Name: "pr", Handler: function() {} } );
    });

    it( '# Pre request register without name config', async () => {
        try {
            mantraRegister.PreRequest( { Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Pre request register with name config type', async () => {
        try {
            mantraRegister.PreRequest( { Name: "pr", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Pre request register without handler', async () => {
        try {
            mantraRegister.PreRequest( { Name: "pr" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Pre request register with bad handler type', async () => {
        try {
            mantraRegister.PreRequest( { Name: "pr", Handler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register', async () => {
        mantraRegister.Command( { Name: "cmd", Description: "desc", Handler: function() {} } );
    });

    it( '# Command register without name config', async () => {
        try {
            mantraRegister.Command( { Description: "desc", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register with bad name config type', async () => {
        try {
            mantraRegister.Command( { Name: 12, Description: "desc", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register without description config', async () => {
        try {
            mantraRegister.Command( { Name: "cmd", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register with bad description config type', async () => {
        try {
            mantraRegister.Command( { Name: "cmd", Description: 12, Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register without handler', async () => {
        try {
            mantraRegister.Command( { Name: "cmd", Description: "desc" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Command register with bad handler type', async () => {
        try {
            mantraRegister.Command( { Name: "cmd", Description: "desc", Handler: 12 } );
            assert.fail();

        } catch(err) {}
    });










    it( '# Api extend register', async () => {
        mantraRegister.ApiExtend( { Name: "ae", Handler: function() {} } );
    });

    it( '# Api extend register without name config', async () => {
        try {
            mantraRegister.ApiExtend( { Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Api extend register with name config type', async () => {
        try {
            mantraRegister.ApiExtend( { Name: "ae", Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Api extend register without handler', async () => {
        try {
            mantraRegister.ApiExtend( { Name: "ae" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Api extend register with bad handler type', async () => {
        try {
            mantraRegister.ApiExtend( { Name: "ae", Handler: "bad" } );
            assert.fail();

        } catch(err) {}
    });

    it( '# DAL register', async () => {
        mantraRegister.DAL( { Method: "d", Handler: function() {} } );
    });

    it( '# DAL register without method config', async () => {
        try {
            mantraRegister.DAL( { Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# DAL register with bad method type', async () => {
        try {
            mantraRegister.DAL( { Method: 12, Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# DAL register without handler', async () => {
        try {
            mantraRegister.DAL( { Handler: function() {} } );
            assert.fail();

        } catch(err) {}
    });

    it( '# DAL register with bad handler type', async () => {
        try {
            mantraRegister.DAL( { Method: "d", Handler: 12 } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Extend register', async () => {
        mantraRegister.Extend( { Type: "d", Name: "n" } );
    });

    it( '# Extend register without type config', async () => {
        try {
            mantraRegister.Extend( {} );
            assert.fail();

        } catch(err) {}
    });

    it( '# Extend register with bad method type', async () => {
        try {
            mantraRegister.Extend( { Type: 12 } );
            assert.fail();

        } catch(err) {}
    });

    it( '# Check if cron config is alias', () => {
        assert.isTrue( mantraRegister.isCronAlias( '1s' ) );
        assert.isTrue( mantraRegister.isCronAlias( '5s' ) );
        assert.isTrue( mantraRegister.isCronAlias( '30s' ) );
        assert.isTrue( mantraRegister.isCronAlias( '1m' ) );
        assert.isTrue( mantraRegister.isCronAlias( '5m' ) );
        assert.isTrue( mantraRegister.isCronAlias( '30m' ) );
        assert.isTrue( mantraRegister.isCronAlias( '1h' ) );
        assert.isTrue( mantraRegister.isCronAlias( '5s' ) );
        assert.isTrue( mantraRegister.isCronAlias( '1d' ) );
        assert.isFalse( mantraRegister.isCronAlias( '1d-foo' ) );
    });
});