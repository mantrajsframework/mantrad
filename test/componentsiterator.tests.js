const assert = require("chai").assert;
const Path = require("path");

require("gimport").initm( process.cwd() );

const ComponentsIterator = global.gimport("componentsiterator");

let mantraAPI = undefined;

describe( 'MantraAPI tests', () => {
    before( async () => {
        await require("./testshelper").initializeMantra();
        
        mantraAPI = global.Mantra.MantraAPIFactory();
    });

    it( '# Iterate over components count test', async () => {
        let componentsCount = 0;

        await ComponentsIterator.iterate( async ( cmpInstance, cmpName ) => {
            componentsCount++;
        });

        assert.isTrue( componentsCount > 0 );
    });

    it( '# Iterate over components types test', async () => {
        await ComponentsIterator.iterate( async ( cmpInstance, cmpName ) => {
            assert.equal( typeof cmpInstance, 'object' );
            assert.equal( typeof cmpName, 'string' );
        });
    });

    it( '# Iterate over components component instance test', async () => {
        await ComponentsIterator.iterate( async ( cmpInstance, cmpName ) => {
            assert.isNotNull( cmpInstance.Start );
        });
    });

    it( '# Iterate over components check components names test', async () => {
        const components = global.Mantra.ComponentsLoader.getComponents();

        await ComponentsIterator.iterate( async ( cmpInstance, cmpName ) => {
            assert.isNotNull( components[cmpName] );
        });
    });
});