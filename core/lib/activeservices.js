/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const MantraUtils = global.gimport("mantrautils");

module.exports = {
    /*
     * Check components list indicated as parameter and extracts
     * the services/hooks needed to register, in the format "<component name>/hook1,hook2".
     * If the component name doesn't indicate anything, then '*' is returned for it.
     */
    extractActiveServicesByComponent: (componentsToLoad) => {
        let activeServiceByComponent = [];

        for (const componentName of componentsToLoad) {
            const parts = MantraUtils.ExtractValues(componentName, "{component}/{services}");

            if (parts != null) {
                activeServiceByComponent[parts.component] = parts.services.split(",");
            } else {
                activeServiceByComponent[componentName] = ["*"];
            }
        }

        // Remove posible duplicates
        for (const componentName of Object.keys(activeServiceByComponent)) {
            activeServiceByComponent[componentName] = [...new Set(activeServiceByComponent[componentName])]
        }

        return activeServiceByComponent;
    }
}