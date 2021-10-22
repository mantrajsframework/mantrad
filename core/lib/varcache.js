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