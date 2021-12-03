"use strict";

const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

const NodeVersionChecker = global.gimport("nodeversionchecker");

describe( 'nodeversionchecker tests', () => {
    it( '# Check with current version', () => {
        let currentNodeVersion = parseInt(process.version.substr(1).split(".")[0]);
        let isRight = NodeVersionChecker.CheckNodeVersion( [currentNodeVersion] );

        assert.isTrue(isRight);
    });

    it( '# Check with wrong value', () => {
        let isRight = NodeVersionChecker.CheckNodeVersion( [5] );

        assert.isFalse(isRight);
    });

    it( '# Check with multiple values', () => {
        let isRight = NodeVersionChecker.CheckNodeVersion( [12,13,14,15,16,17] );

        assert.isTrue(isRight);
    });
});