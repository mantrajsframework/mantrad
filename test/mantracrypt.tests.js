const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

const MantraCrypt = global.gimport("mantracrypt");

describe( 'mantracrypt tests', () => {
    it( '# Encrypt', () => {
        const message = "Mantra Framework";
        const password = "dfca366848dea6bbdfca366848dea6bb";

        let messageEncrypted = MantraCrypt.encrypt(password, message);

        assert.isString(messageEncrypted);
    });

    it( '# Encrypt returns hex', () => {
        const message = "Mantra Framework";
        const password = "dfca366848dea6bbdfca366848dea6bb";

        let messageEncrypted = MantraCrypt.encrypt(password, message);

        assert.isTrue( isHex(messageEncrypted) );
        assert.equal( 0, messageEncrypted.length%2 );
    });

    it( '# Encrypt and decrypt', () => {
        const message = "Mantra Framework";
        const password = "dfca366848dea6bbdfca366848dea6bb";

        let messageEncrypted = MantraCrypt.encrypt(password, message);
        let messageDecrypted = MantraCrypt.decrypt(password, messageEncrypted);

        assert.equal( message, messageDecrypted );
    });

    it( '# Encrypt and decrypt manipulated', () => {
        const message = "Mantra Framework";
        const password = "dfca366848dea6bbdfca366848dea6bb";

        let messageEncrypted = MantraCrypt.encrypt(password, message);
        messageEncrypted += 'C'; // Corrupt message

        try {
            MantraCrypt.decrypt(password, messageEncrypted);
        } catch(err) {
            return;
        }

        assert.fail("Should throw exception");
    });
});

function isHex(string) {
    for (const c of string) {
        if ("0123456789ABCDEFabcdef".indexOf(c) === -1) {
            return false;
        }
    }
    return true;
}
