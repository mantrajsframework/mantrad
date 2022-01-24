/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

let dalInstances = {};

module.exports = {
    BuildRepositoryInstances: (MantraAPI, repositories) => {
        for( let repo of repositories ) {
            if ( !dalInstances[repo.Component] ) dalInstances[repo.Component] = {};
            
            dalInstances[repo.Component][repo.Method] = repo.Handler;

            if ( !dalInstances[repo.Component]["model"] ) {
                dalInstances[repo.Component]["model"] = MantraAPI.ComponentEntities(repo.Component);
            }
        }
    },

    GetRepositoryInstances: () => dalInstances   
}