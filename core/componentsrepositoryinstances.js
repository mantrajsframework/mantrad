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