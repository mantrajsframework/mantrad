"use strict";

const Crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const IV = 'dfca366848dea6bb';

module.exports = {
    encrypt: (password, textToCrypt) => {
        const cipher = CreateDecipher( password );
        
        return cipher.update(textToCrypt, 'utf8', 'hex') + cipher.final('hex');        
    },

    decrypt: (password, textToDecrypt) => {
        const cipher = CreateDecipher( password );
        
        return cipher.update(textToDecrypt, 'hex', 'utf8') + cipher.final('utf8');        
    }
}

function CreateDecipher(password) {
    return Crypto.createDecipheriv(ALGORITHM, password, IV);
}