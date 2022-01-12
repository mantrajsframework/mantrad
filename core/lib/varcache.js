/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

class VarCache {
    constructor() {
        this.cache = [];
    }

    Get(key) {
        return this.cache[key];
    }

    Exists(key) {
        return this.cache[key] != null;
    }

    Add(key, value) {
        this.cache[key] = value;
    }
}

module.exports = () => new VarCache();