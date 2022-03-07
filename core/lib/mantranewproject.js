/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

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
    const dataProvidersOptions = [ "MySql flavours", "Sqlite3", "MariaDB", "PostgreSQL", "AWS Aurora" ];

    switch( await MantraConsole.questionWithOpts( "Select provider: ", dataProvidersOptions ) ) {
        case 0: return askForMysqlProviderConfig();
        case 1: return askForSqliteProviderConfig();
        case 2: return askForMariaDBProviderConfig();
        case 3: return askForPostgreSQLProviderConfig();
        case 4: return askForAuroraProviderConfig();
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

async function askForAuroraProviderConfig() {
    let auroraProviderConfig = {
        provider: "mysql"
    };
    
    auroraProviderConfig.host = await MantraConsole.question( "AWS Aurora host: ", false );
    auroraProviderConfig.database = await MantraConsole.question( "AWS Aurora database: ", false );
    auroraProviderConfig.user = await MantraConsole.question( "AWS Aurora user: ", false );
    auroraProviderConfig.password = await MantraConsole.question( "AWS Aurora password (optional): " );
    
    return auroraProviderConfig;
}

async function askForMariaDBProviderConfig() {
    let mariaDBProviderConfig = {
        provider: "mariadb"
    };
    
    mariaDBProviderConfig.host = await MantraConsole.question( "MariaDB host: ", false );
    mariaDBProviderConfig.database = await MantraConsole.question( "MariaDB database: ", false );
    mariaDBProviderConfig.user = await MantraConsole.question( "MariaDB user: ", false );
    mariaDBProviderConfig.password = await MantraConsole.question( "MariaDB password (optional): " );
    
    return mariaDBProviderConfig;
}

async function askForPostgreSQLProviderConfig() {
    let postgreProviderConfig = {
        provider: "mariadb"
    };
    
    postgreProviderConfig.host = await MantraConsole.question( "PostgreSQL host: ", false );
    postgreProviderConfig.database = await MantraConsole.question( "PostgreSQL database: ", false );
    postgreProviderConfig.user = await MantraConsole.question( "PostgreSQL user: ", false );
    postgreProviderConfig.password = await MantraConsole.question( "PostgreSQL password (optional): " );
    
    return postgreProviderConfig;
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