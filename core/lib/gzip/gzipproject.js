/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */

"use strict";

const Path = require("path");

const CoreCommandsUtils = global.gimport("corecommandsutils");
const CoreConstants = global.gimport("coreconstants");
const ExecCommand = global.gimport("execcommand");
const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    Gzip: async (projectLocation) => {
        const finalProjectLocation = checkIsRelative(projectLocation);
        
        if ( !(await checkGuards(projectLocation)) ) return;

        const gzipFileName = getGzipFileName(finalProjectLocation);
        const tarCommand = getTarCommand(finalProjectLocation, gzipFileName);

        MantraConsole.info( "Compressing...", false);
        
        await ExecCommand.exec( tarCommand );
        
        MantraConsole.info( `Gzipped project file ${gzipFileName} generated successfully.`, false );
        MantraConsole.info( 'Remember that GIT and node_module files, if any, are NOT included.', false );   
    }
}

async function checkGuards(finalProjectLocation) {
    // Exists location?
    if ( !(await MantraUtils.ExistsDirectory( finalProjectLocation )) ) {
        MantraConsole.warning( "Project location doesn't exist.", false );
        return false;
    }

    // Is a mantra project?
    if ( !(await isMantraProject(finalProjectLocation) )) {
        MantraConsole.warning( "The location doesn't contain a Mantra project.", false );
        return false;
    }

    // Exists tar in system
    if ( !(await CoreCommandsUtils.ExistsTarCommandInSystem()) ) {
        MantraConsole.warning( `Unable to locate in system 'tar' command to run gzip-project`);
        return false;
    }

    return true;
}

function checkIsRelative(projectLocation) {
    let finalPath = projectLocation.charAt(0) == "." ? Path.join( process.cwd(), projectLocation ) : projectLocation;

    if ( Path.isAbsolute(finalPath) ) return finalPath;

    return Path.join( process.cwd(), projectLocation );
}

async function isMantraProject(finalProjectLocation) {
    const mantraConfigLocation = Path.join( finalProjectLocation, CoreConstants.MANTRACONFIGFILE );

    return MantraUtils.FileExists( mantraConfigLocation );
}

function getGzipFileName(finalProjectLocation) {
    const mantraConfigJson = require( Path.join( finalProjectLocation, CoreConstants.MANTRACONFIGFILE ) );

    return `${Path.basename(finalProjectLocation)}@${mantraConfigJson.CurrentVersion}.tar.gz`;
}

function getTarCommand(finalProjectLocation, gzipFileName) {
    return `tar --exclude=**/.git/* --exclude=**/node_modules/* -zcf ${gzipFileName} -C ${Path.dirname(finalProjectLocation)} ${Path.basename(finalProjectLocation)}`;
}