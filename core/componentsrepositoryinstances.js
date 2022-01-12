/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

let repositoryInstances = {};

module.exports = {
    BuildRepositoryInstances: (MantraAPI, repositories) => {
        for( let repo of repositories ) {
            if ( !repositoryInstances[repo.Component] ) repositoryInstances[repo.Component] = {};
            
            repositoryInstances[repo.Component][repo.Method] = repo.Handler;

            if ( !repositoryInstances[repo.Component]["model"] ) {
                repositoryInstances[repo.Component]["model"] = MantraAPI.ComponentEntities(repo.Component);
            }
        }
    },

    GetRepositoryInstances: () => repositoryInstances   
}