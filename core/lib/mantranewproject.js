"use strict";

const ProjectBuilder = global.gimport("projectbuilder");
const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");
const PROJECT_TYPES = global.gimport("projecttypes");

module.exports = {
    /*
     * Build project info json asking from console
     * and calls ProjectBuilder.buildNewProject to create new Mantra project
     */
    launchInstaller: async () => {
        let project = {};
        
        // 1) ask for project name
        project.projectname = await askForProjectName();
                
        // 3) ask for project app
        project.appname = await askForAppName();

        // 4) ask for database provider
        MantraConsole.info("Select database provider", false);
        project.provider = JSON.stringify(await askForDatabaseProvider());

        // 5) ask for project template
        MantraConsole.info("Select project type", false);
        project.projectType = PROJECT_TYPES[await askForProjectType()];

        await ProjectBuilder.buildNewProject(project);

        // 6) completed
        MantraConsole.info("Mantra project created with success");
        MantraConsole.info("To complete installation, run:");
        MantraConsole.info(`$ cd ${project.projectname} && mantrad install`);
    }
}

async function askForProjectName() {
    return sanitizeString( await MantraConsole.question( "Project name: ", false ) );
}

async function askForAppName() {
    return sanitizeString( await MantraConsole.question( "Project app name: ", false ) );
}

async function askForDatabaseProvider() {
    switch( await MantraConsole.questionWithOpts( "Select provider: ", [ "MySql flavours", "Sqlite3" ] ) ) {
        case 0: {
            return askForMysqlProviderConfig();
        }
        case 1: {
            return askForSqliteProviderConfig();
        }
    }
}

async function askForProjectType() {
    return MantraConsole.questionWithOpts( "Select project type: ", PROJECT_TYPES.map( i => i.name ) );
}

async function askForMysqlProviderConfig() {
    let mysqlProviderConfig = {
        provider: "mysql"
    };
    
    mysqlProviderConfig.host = await MantraConsole.question( "Mysql host: ", false );
    mysqlProviderConfig.database = await MantraConsole.question( "Mysql database: ", false );
    mysqlProviderConfig.user = await MantraConsole.question( "Mysql user: ", false );
    mysqlProviderConfig.password = await MantraConsole.question( "Mysql password (optional): " );
    
    return mysqlProviderConfig;
}

async function askForSqliteProviderConfig() {
    let sqliteConfig = {
        provider: "sqlite"
    };
    
    sqliteConfig.databasepath = `./${await MantraConsole.question( 'Database name: ' )}.db`;
    
    return sqliteConfig;
}
            
function sanitizeString( str ) {
    return MantraUtils.SanitizeToLatin(str).replace(/[' ']/g, '_');
}