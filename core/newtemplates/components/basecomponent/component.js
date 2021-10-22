"use strict";

class {{name}}Starter {
    async onStart(Mantra) {
        console.log('New component {{name}} installed!');
    }
}

class {{name}}Installation {
    async onInstall(Mantra) {}

    async onUninstall(Mantra) {}

    async onInitialize(Mantra) {}

    async onUpdate(Mantra, currentVersion, versionToUpdate) {}
}

module.exports = () => {
    return {
        Start: new {{name}}Starter(),
        Install: new {{name}}Installation()
    };
}