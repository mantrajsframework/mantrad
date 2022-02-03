const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

let AssetsLocations = undefined;

describe( 'AssetsLocations tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        AssetsLocations = global.gimport("assetslocations")(global.Mantra.MantraAPIFactory());
    });

    it( '# getBlocksLocations test', () => {
        const blocksLocations = AssetsLocations.GetBlocksLocations();

        assert.isArray( blocksLocations );
        assert.isTrue( blocksLocations.length > 0 );
    });

    it( '# existsView existing test', async () => {
        let existsView =  await AssetsLocations.ExistsView("testcomponent.defaultview");

        assert.isTrue( existsView );
    });

    it( '# existsView no existing test', async () => {
        let existsView =  await AssetsLocations.ExistsView("testcomponent.noexistingview");

        assert.isFalse( existsView );
    });

    it( '# getViewLocation test', async () => {
        let viewLocation =  await AssetsLocations.GetViewLocation("testcomponent", "defaultview" );

        assert.isTrue( Path.isAbsolute(viewLocation) );
    });

    it( '# getBlockLocation test', async () => {
        let blockLocation =  await AssetsLocations.GetBlockLocation("testcomponent", "defaultblock" );

        assert.isTrue( Path.isAbsolute(blockLocation) );
    });

    it( '# getFullJsLocation test', async () => {
        let jsLocation =  await AssetsLocations.GetFullJsLocation("testcomponent", "test" );

        assert.isTrue( Path.isAbsolute(jsLocation) );
    });

    it( '# getJsLocation test', async () => {
        let jsLocation =  await AssetsLocations.GetJsLocation("testcomponent", "test" );
        
        assert.isTrue( Path.isAbsolute(Path.join(__dirname,jsLocation)) );
    });

    it( '# getFullCssLocation test', async () => {
        let cssLocation =  await AssetsLocations.GetFullJsLocation("testcomponent", "test" );

        assert.isTrue( Path.isAbsolute(cssLocation) );
    });

    it( '# getCssLocation test', async () => {
        let cssLocation =  await AssetsLocations.GetJsLocation("testcomponent", "test" );
        
        assert.isTrue( Path.isAbsolute(Path.join(__dirname,cssLocation)) );
    });

    it( '# TranslateLocationFromKeyWords', () => {
        const Mantra = global.Mantra.MantraAPIFactory();
        const location = AssetsLocations.TranslateLocationFromKeyWords( Mantra, 'frontendtemplates.blocks', 'mycomponent' );

        assert.isString( location );
    });
});