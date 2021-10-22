"use strict";

const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

const VarCache = global.gimport("varcache");

describe( 'VarCache tests', () => {
    it( '# Add test', () => {
        let vc = VarCache();

        vc.Add("t", "Mantra Framework");
    });

    it( '# Add and check test', () => {
        let vc = VarCache();

        vc.Add("t", "Mantra Framework");

        let value = vc.Get("t");
        
        assert.equal( value, "Mantra Framework");
    });

    it( '# Add longkey and check test', () => {
        const vc = VarCache();
        const crypto = require("crypto");
        const key = crypto.randomBytes(1024).toString('hex');
        
        vc.Add(key, "Mantra Framework");

        assert.equal( vc.Get(key), "Mantra Framework");
    });

    it( '# Add existing key check test', () => {
        const vc = VarCache();

        vc.Add("t", "Mantra Framework");
        vc.Add("t", "Mantra Framework2");

        let value = vc.Get("t");
        
        assert.equal( value, "Mantra Framework2");
    });

    it( '# Exists test', () => {
        const vc = VarCache();

        vc.Add("t", "Mantra Framework");

        assert.isTrue( vc.Exists("t") );
        assert.isFalse( vc.Exists("noexistskey") );
    });

    it( '# Add empty value', () => {
        const vc = VarCache();

        vc.Add( "ev", "" );

        assert.equal( vc.Get("ev"), "" );
    });

    it( '# Add object as value', () => {
        const vc = VarCache();
        const obj = { title: "Lord of The Rings" };
        
        vc.Add( "book", obj );

        assert.isObject( vc.Get("book") );
        assert.equal( vc.Get("book").title, "Lord of The Rings" );
    });
});