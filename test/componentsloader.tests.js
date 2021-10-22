"use strict";

const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

const ComponentsLoader = global.gimport("componentsloader")();

const TESTASSETS_FOLDER = "testassets";
const TESTCOMPONENTS_FOLDER = "testcomponents";
const PATH_TO_COMPONENTS = Path.join( __dirname, TESTASSETS_FOLDER, TESTCOMPONENTS_FOLDER );

describe( 'ComponentsLoader tests', () => {
    it( '# getComponentsLocations test', () => {
        let result = ComponentsLoader.getComponentsLocations([PATH_TO_COMPONENTS]);
        
        assert.isTrue( Array.isArray(result) );
        assert.isTrue( result.length > 0 );
    });

    it( '# getComponentsLocations check "seo" is loaded test', () => {
        let result = ComponentsLoader.getComponentsLocations([PATH_TO_COMPONENTS]);

        assert.isTrue( result.map( i => i.filename ).includes("seo") );
    });

    it( '# loadComponents test', async() => {
        const count = await ComponentsLoader.loadComponents([PATH_TO_COMPONENTS]);

        assert.isTrue( count > 0 )
    });

    it( '# loadComponents test', async() => {
        const count = await ComponentsLoader.loadComponents([PATH_TO_COMPONENTS]);

        assert.equal( count, ComponentsLoader.getComponentsCount() );
    });

    it( '# getComponents test', async () => {
        await ComponentsLoader.loadComponents([PATH_TO_COMPONENTS]);

        const components = ComponentsLoader.getComponents();

        assert.isArray(components);
        assert.isTrue( components["seo"] !== null );
    });
});