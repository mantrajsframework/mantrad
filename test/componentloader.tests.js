"use strict";

const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

const Loader = global.gimport("componentloader");

const TESTASSETS_FOLDER = "testassets";
const TESTCOMPONENTS_FOLDER = "testcomponents";
const PATH_TO_COMPONENTS = Path.join( __dirname, TESTASSETS_FOLDER, TESTCOMPONENTS_FOLDER );

describe( 'ComponentLoader tests', () => {
    it( '# loadComponent test', () => {
        const seoComponent = Loader.loadComponent( Path.join( PATH_TO_COMPONENTS, "seo" ), "seo" );

        assert.isObject(seoComponent);
        assert.equal( Path.join( PATH_TO_COMPONENTS, "seo" ), seoComponent.pathToComponent );
        
        assert.isObject( seoComponent.config );
        assert.isString( seoComponent.config.name );
        assert.isString( seoComponent.config.version );

        assert.isObject( seoComponent.component );
    });
});