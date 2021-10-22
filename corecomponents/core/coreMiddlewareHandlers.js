"use strict";

const jsonValidator = require("jsonschema").Validator;
const CoreUtils = require("./coreUtils");

const AccessConditions = global.gimport("accessconditions");
const PreRequests = global.gimport("prerequests");

module.exports = {
    SanitizedPath: (req, res, next) => { 
        if (req.method == "GET") {
            req.sanitizedPath = req.path.replace(global.Mantra.MantraConfig.InstanceId, "")
        }

        next();        
    }, 

    CheckLanding: (req, res, next) => {
        if ( res.MantraAPI.IsGet() && (req.path == "/" || req.path == "/index.html") ) { 
            const landingView = global.Mantra.MantraConfig.LandingView;
            
            if ( landingView ) {
                return landingView.indexOf(".") > 0 ? res.MantraAPI.RenderView( landingView ) : res.MantraAPI.Redirect( `/${landingView}` );
            }
        }

        next();
    },

    SetMantraAPI: (req, res, next) => {
        res.MantraAPI = global.Mantra.MantraAPIFactory(req,res);

        next();    
    },

    IndexMiddleware: (req, res, next) => {
        if (res.MantraAPI.IsGet() && (req.path == "/" || req.path == "/index.html")) {
            return res.MantraAPI.RenderLandingPage();
        }

        next();
    },

    /*
     * If json schema is provided by post configuration,
     * this middleware checks it
     */
    ValidatePostData: (req, res, next) => {
        if (req.method == "POST") {
            let cp = CoreUtils.GetComponentAndCommand(req.path);
            let postConfig = global.Mantra.Bootstrap.GetPost(cp.componentName, cp.command);

            if (postConfig.DataValidationSchema) {
                var v = new jsonValidator();
                var postData = JSON.parse(req.body.mantraPostData);

                let vresult = v.validate(postData, postConfig.DataValidationSchema);

                if (vresult.errors.length == 0) {
                    req.MantraPostData = postData;
                    next();
                }
                else {
                    res.status(500).json(vresult.errors);
                }
            } else {
                if (req.body.mantraPostData) {
                    req.MantraPostData = JSON.parse(req.body.mantraPostData);
                    next();
                } else if (typeof req.body == "object") {
                    req.MantraPostData = req.body;
                    next();
                }
            }
        } else { next(); }
    },

    AccessCondition: async ( req, res, next ) => {
        if ( res.MantraAPI.IsGet() ) { 
            return AccessConditionGet( req, res, next );
        } else if ( res.MantraAPI.IsPost() ) {
            return AccessConditionPost( req, res, next );
        } else {
            return res.status(403).end();
        }
    },

    PreRequest: async (req, res, next ) => {
        if ( res.MantraAPI.IsGet() ) { 
            const cp = CoreUtils.GetComponentAndCommand(req.path);      

            if ( cp && await PreRequests.checkPR(cp.componentName, cp.command, req, res) ) {
                next();
            } // Other case, prerequest will redirect
        } else {
            return next();
        }
    }    
}

async function AccessConditionGet( req, res, next ) {
    let cp = CoreUtils.GetComponentAndCommand(req.path);
    
    if ( cp ) {
        let viewConfig  = global.Mantra.Bootstrap.GetView( cp.componentName, cp.command );
        
        if ( viewConfig == undefined ) {
            viewConfig = global.Mantra.Bootstrap.GetGet( cp.componentName, cp.command );
        }

        if ( viewConfig && typeof viewConfig.AccessCondition != 'undefined' ) {
            let ac = await AccessConditions.checkAC( viewConfig.AccessCondition, req, res );
    
            if ( ac.allowed ) next();
            else {
                // If some access condition handler has not set a redirect,
                // then, redirect to root by default or access condition redirect
                if ( !res.headersSent ) {
                    res.redirect( ac.redirect );
                }                        
            }
        } else next();
    } else next();
}

async function AccessConditionPost( req, res, next ) {
    let cp = CoreUtils.GetComponentAndCommand(req.path);
    
    if ( cp ) {
        let postConfig  = global.Mantra.Bootstrap.GetPost( cp.componentName, cp.command );
    
        if ( postConfig && typeof postConfig.AccessCondition != 'undefined' ) {
            let ac = await AccessConditions.checkAC( postConfig.AccessCondition, req, res );
    
            if ( ac.allowed ) {
                next();
            }
            else {
                res.status(403).end();
            }
        } else next();
    }
}