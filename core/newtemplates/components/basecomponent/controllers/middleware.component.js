"use strict";

"use strict";

module.exports = {
    /* Weight property is optional, default: 0 */
    middleware_weight: 0,

    middleware: async (req,res,next) => {                                  
        next();
    }
}