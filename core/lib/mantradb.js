/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const RedEntities = global.gimport("redentities");
const MantraModel = global.gimport("mantramodel")();

class MantraDB {
    constructor(mantraConfig) { 
        this.mantraConfig = mantraConfig;     
        this.LoadModel();
    }

    async IsDatabaseInstalled() {
        return this.Entities.ExistsSchema();
    }

    LoadModel() {
        this.Entities = RedEntities(this.mantraConfig).Entities( this.LoadSchema() );
    }

    LoadSchema() {
        return MantraModel.LoadModel();
    }

    async GetComponentsInstalledAndEnabled() {
        const cmps = await this.Entities.components.S("name").W( "enabled=?", true ).R(); 
        
        return cmps.map( cmp => cmp.name );
    }

    async IsComponentEnabled(componentName) {
        return this.Entities.components.S("enabled").W( "name=?", componentName ).Single(); 
    }

    async GetAllComponents() {
        return this.Entities.components.S().R();
    }

    async GetComponentByName( componentName ) {
        return this.Entities.components.S().W( "name=?", componentName ).Single(); 
    }

    async ExistsComponentByName( componentName ) {
        return this.Entities.components.S().W( "name=?", componentName ).Exists(); 
    }

    async UpdateComponentLocation( componentName, newLocation ) {
        return this.Entities.components.U().W("name=?",componentName).V( {
            location: newLocation
        }).R();
    }

    async UpdateComponentStatus( componentName, newStatus ) {
        return this.Entities.components.U().W("name=?",componentName).V({ enabled: newStatus }).R();        
    }

    async IsMantraInitialized() {
        let entity = await this.Entities.mantrainstance.S("datavalue").W("dataname=?", "initialized").Single();

        return entity.datavalue == 'true';
    }

    async SetInitialized() {
        return this.Entities.mantrainstance.U().W("dataname=?", "initialized").V(["datavalue"],["true"]).R();
    }

    async IsComponentInstalled( componentName ) {
        return this.Entities.components.S().W("name=?", componentName).Exists()
    }

    async AddComponent(componentEntity) {
        return this.Entities.components.I().V(componentEntity).R();
    }

    async RemoveComponentByName( componentName ) {
        return this.Entities.components.D().W("name=?",componentName).R();
    }

    async GetEnabledComponents() {
        return this.Entities.components.S().W("enabled=?",true).R();
    }

    async UpdateComponentVersion( componentName, newVersion) {
        return this.Entities.components.U().W("name=?",componentName).V(["version"],[newVersion]).R();
    }
}

module.exports = (mantraConfig) => new MantraDB(mantraConfig);