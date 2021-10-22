const Path = require("path");
const assert = require("chai").assert;
const fs = require("fs");

require("gimport").initm( process.cwd() );

const MantraConfig = global.gimport("mantraconfig");

describe( 'MantraConfig tests', () => {
    it( '# ExistsConfigFile test', async () => {
        const pathToConfigFile = Path.join(process.cwd(), "test", "testassets", "mantraconfig.json");
        const existsFile = await MantraConfig.ExistsConfigFile(pathToConfigFile);

        assert.isTrue(existsFile);
    });

    it( '# ExistsConfigFile no existing file test', async () => {
        const pathToConfigFile = Path.join(process.cwd(), "test",  "testassets", "mantraconfignoexisting.json");
        const existsFile = await MantraConfig.ExistsConfigFile(pathToConfigFile);

        assert.isFalse(existsFile);
    });

    it( '# IsJsonFileValid test', async () => {
        const pathToConfigFile = Path.join(process.cwd(), "test",  "testassets", "mantraconfig.json");
        const isJsonValid = await MantraConfig.IsJsonFileValid(pathToConfigFile);

        assert.isTrue(isJsonValid);
    });

    it( '# IsJsonFileValid invalid file test', async () => {
        const pathToConfigFile = Path.join(process.cwd(), "test",  "testassets", "mantraconfiginvalid.json");
        const isJsonValid = await MantraConfig.IsJsonFileValid(pathToConfigFile);

        assert.isFalse(isJsonValid);
    });

    it( '# Json expected', () => {
        const pathToConfigFile = Path.join(process.cwd(), "test",  "testassets", "mantraconfig.json");

        let config = MantraConfig.LoadConfig( pathToConfigFile );

        assert.isObject( config );
    });

    it( '# CoreComponents is a directory', () => {
        const pathToConfigFile = Path.join(process.cwd(), "test",  "testassets", "mantraconfig.json");

        let config = MantraConfig.LoadConfig( pathToConfigFile );

        assert.isTrue( fs.lstatSync(config.CoreComponents).isDirectory() );
    });
});