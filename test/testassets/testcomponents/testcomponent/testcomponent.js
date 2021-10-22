"use strict";

class testcomponentStarter {
    async onStart(Mantra) {
        console.log('New component testcomponent installed!');
    }
}

class testcomponentInstallation {
    async onInstall(Mantra) {}

    async onUninstall(Mantra) {}

    async onInitialize(Mantra) {}

    async onUpdate(Mantra, currentVersion, versionToUpdate) {}
}

module.exports = () => {
    return {
        Start: new testcomponentStarter(),
        Install: new testcomponentInstallation()
    };
}