/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

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
            const cp = CoreUtils.GetComponentAndCommand(req.path);
            const postConfig = global.Mantra.Bootstrap.GetPost(cp.componentName, cp.command);
            let postData = "";
            
            if ( req.body.mantraPostData ) {
                postData = JSON.parse(req.body.mantraPostData);
            } else if ( req.body ) {
                if ( typeof req.body == 'string' ) postData = JSON.parse(req.body);
                if ( typeof req.body == 'object' ) postData = req.body;
            }
            
            req.MantraPostData = postData;

            if (postConfig.DataValidationSchema) {
                const v = new jsonValidator();
                const vresult = v.validate(postData, postConfig.DataValidationSchema);

                if (vresult.errors.length == 0) {
                    next();
                }
                else {
                    res.status(500).json(vresult.errors);
                }
            } else {
                next();
            }
        } else { next(); }
    },

    AccessCondition: async ( req, res, next ) => {
        if ( res.MantraAPI.IsGet() ) { 
            return AccessConditionGet( res.MantraAPI, req, res, next );
        } else if ( res.MantraAPI.IsPost() ) {
            return AccessConditionPost( res.MantraAPI, req, res, next );
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

async function AccessConditionGet( Mantra, req, res, next ) {
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
                    if ( ac.onCancel ) {
                        await ac.onCancel( Mantra );
                    } else {
                        res.redirect( ac.redirect );
                    }
                }                        
            }
        } else next();
    } else next();
}

async function AccessConditionPost( Mantra, req, res, next ) {
    let cp = CoreUtils.GetComponentAndCommand(req.path);
    
    if ( cp ) {
        let postConfig  = global.Mantra.Bootstrap.GetPost( cp.componentName, cp.command );
    
        if ( postConfig && typeof postConfig.AccessCondition != 'undefined' ) {
            let ac = await AccessConditions.checkAC( postConfig.AccessCondition, req, res );
    
            if ( ac.allowed ) {
                next();
            }
            else {
                if (ac.onCancel) {
                    await ac.onCancel(Mantra);
                } else {
                    res.status(403).end();
                }
            }
        } else next();
    }
}