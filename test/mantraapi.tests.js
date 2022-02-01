const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

let mantraAPI = undefined;

describe( 'MantraAPI tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        mantraAPI = global.Mantra.MantraAPIFactory();
    });

    it( '# GetAppName test', async () => {
        const appName = mantraAPI.GetAppName();

        assert.isString( appName );
        assert.equal( "testapp", appName );
    });

    it( '# GetHooksByName test', async () => {
        const hooks = mantraAPI.GetHooksByName("middleware");

        assert.isArray(hooks);
    });

    it( '# GetComponentLocation test', async () => {
        const location = mantraAPI.GetComponentLocation("seo");

        assert.isString(location);
        assert.isTrue( Path.isAbsolute(location) );
    });

    it( '# GetComponentLocation no existing component test', async () => {
        try {
            mantraAPI.GetComponentLocation("noexisting");
        } catch(err) {
            return;
        }

        assert.fail("Should throw exception");
    });

    it( '# GetComponentVersion test', async () => {
        const version = mantraAPI.GetComponentVersion("seo");

        assert.isString(version);
        assert.equal("1.0.0", version);
    });

    it( '# GetComponentVersion no existing component test', async () => {
        try {
            mantraAPI.GetComponentVersion("noexisting");
        } catch(err) { 
            return;
        }

        assert.fail("Should throw exception");
    });

    it( '# Utils is object', () => {
        let utilsObj = mantraAPI.Utils;

        assert.isObject( utilsObj );
    });

    it( '# AddRenderValue test', () => {
        mantraAPI.AddRenderValue( "name", "mantra" );

        let renderValues = mantraAPI.GetRenderValues()

        assert.equal( renderValues["name"], "mantra" );
    });

    it( '# AddRenderValue multiple values test', () => {
        mantraAPI.AddRenderValue( "name", "mantra" )
            .AddRenderValue( "title", "lord of the rings" );

        let renderValues = mantraAPI.GetRenderValues();
        let valuesKeys = Object.keys(renderValues);

        assert.isTrue( valuesKeys.length > 0 );
    });

    it( '# GetRenderValues test', () => {
        assert.isArray( mantraAPI.GetRenderValues() );
    })

    it( '# AddRequestData test', () => {
        mantraAPI.AddRequestData( "name", "mantra" );

        assert.equal( mantraAPI.GetRequestData("name"), "mantra" );
    });

    it( '# AddRequestData multiple values test', () => {
        mantraAPI.AddRequestData( "name", "mantra" )
            .AddRequestData( "title", "lord of the rings" );

        assert.equal( mantraAPI.GetRequestData("name"), "mantra" );
        assert.equal( mantraAPI.GetRequestData("title"), "lord of the rings" );
    });

    it( '# AddDataValue test', () => {
        mantraAPI.AddDataValue( "name", "mantra" );

        let dataValues = mantraAPI.GetDataValues();

        assert.equal( dataValues["name"], "mantra" );
    });

    it( '# AddDataValue multiple values test', () => {
        mantraAPI.AddDataValue( "name", "mantra" )
            .AddDataValue( "title", "lord of the rings" );

        let dataValues = mantraAPI.GetDataValues();

        assert.equal( dataValues["name"], "mantra" );
        assert.equal( dataValues["title"], "lord of the rings" );
    });

    it( '# GetDataValues test', () => {
        assert.isObject( mantraAPI.GetDataValues() );
    })

    it( '#AddJs test', () => {
        mantraAPI.AddJs( "main.js" );

        assert.isTrue( mantraAPI.GetJsResources().includes("main.js") );
    })

    it( '#AddJs multiple files test', () => {
        mantraAPI.AddJs( "main.js" ).AddJs( "slider.js" );

        assert.isTrue( mantraAPI.GetJsResources().includes("main.js") );
        assert.isTrue( mantraAPI.GetJsResources().includes("slider.js") );
    })

    it( '#GetJsResouces test', () => {
        assert.isArray( mantraAPI.GetJsResources() );
    })

    it( '#AddCss test', () => {
        mantraAPI.AddCss( "main.css" );

        assert.isTrue( mantraAPI.GetCssResources().includes("main.css") );
    })

    it( '#AddCss multiple files test', () => {
        mantraAPI.AddCss( "main.css" ).AddCss( "slider.css" );

        assert.isTrue( mantraAPI.GetCssResources().includes("main.css") );
        assert.isTrue( mantraAPI.GetCssResources().includes("slider.css") );
    })

    it( '#GetCssResouces test', () => {
        assert.isArray( mantraAPI.GetCssResources() );
    })

    it( '#GetInstanceId test', () => {
        const instanceId = mantraAPI.GetInstanceId();

        assert.isString( instanceId );
        assert.isTrue( instanceId.length == 12 );
    })
});