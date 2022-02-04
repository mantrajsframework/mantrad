const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

const ComponentConfigValidator = global.gimport("componentconfigvalidator");

const TESTASSETS_FOLDER = "testassets";
const TESTCOMPONENTS_FOLDER = "testcomponents";

describe( 'ComponentConfigValidator tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        ActiveServices = global.gimport("activeservices");
    });

    it( 'Check simple component config', () => {
        const componentConfig = {
            name: "comonent name",
            version: "1.0.0"
        };

        assert.isTrue( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad name in component config', () => {
        const componentConfig = {
            namex: "comonent name",
            version: "1.0.0"
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad name type in component config', () => {
        const componentConfig = {
            name: {},
            version: "1.0.0"
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad name type in component config', () => {
        const componentConfig = {
            name: 20,
            version: "1.0.0"
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad version in component config', () => {
        const componentConfig = {
            name: "comonent name",
            versionx: "1.0.0"
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad version type in component config', () => {
        const componentConfig = {
            name: "comonent name",
            versionx: 12
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check bad version type in component config', () => {
        const componentConfig = {
            name: "comonent name",
            versionx: {}
        };

        assert.isFalse( ComponentConfigValidator.isValidConfigJson( componentConfig ) );
    });

    it( 'Check test component seo with valid mantra.json file', () => {
        const pathToTestSeoComponent = Path.join( __dirname, TESTASSETS_FOLDER, TESTCOMPONENTS_FOLDER, "seo" );

        assert.isTrue( ComponentConfigValidator.isValidConfigFile( pathToTestSeoComponent ) );
    });
});