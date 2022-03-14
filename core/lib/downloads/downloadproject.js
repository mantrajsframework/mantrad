/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */

"use strict";

const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const CoreCommandsUtils = global.gimport("corecommandsutils");
const MantradArgs = global.gimport("mantradargs");
const MantrajsApiClient = global.gimport("mantrajsapiclient");
const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    Download: async (projectName) => {
        const existsTarCommand = await CoreCommandsUtils.ExistsTarCommandInSystem();;

        if (!existsTarCommand) {
            MantraConsole.warning(`Unable to locate in system 'tar' command to run download-component`);
        } else {   
            try {
                const credentials = await CoreCommandsUtils.GetUserCredentialsToDownloadComponent();

                const projectDownloadRequestData = {
                    usermail: credentials.userMail,
                    licensekey: credentials.licenseKey,
                    projectnamerequested: projectName
                };

                MantraConsole.info(`Downloading...`);

                const apiCallResult = await MantrajsApiClient.GetDownloadTokenForProject(projectDownloadRequestData);

                if (apiCallResult.success) {
                    const destinationFolder = MantradArgs.getRootFolder();
                    await MantraUtils.EnsureDir(destinationFolder);
                    const downloadToken = apiCallResult.payload.downloadtoken;
                    const fileNameDownloaded = await MantrajsApiClient.GetDownloadComponent(downloadToken, destinationFolder);

                    MantraConsole.info(`File ${fileNameDownloaded} downloaded with success.`);

                    const answer = await MantraConsole.question(`Extract project '${projectName}' [Y]/N? `);

                    if (answer == "Y" || answer == "") {
                        const ExecCommand = global.gimport("execcommand");
                        const gzFullPathFile = Path.join(destinationFolder, fileNameDownloaded);
                        const destinationComponentFolder = Path.join(destinationFolder);
                        const untarCommand = `tar -xzf ${gzFullPathFile} -C ${destinationComponentFolder}`;

                        MantraConsole.info("Extracting project...");
                        await ExecCommand.exec(untarCommand);
                        MantraConsole.info("Project extracted with success.");
                        MantraConsole.info(`Run '$ cd ${GetProjectName(projectName)} && mantrad install' to install the project.`);
                        MantraConsole.info(`More projects and components to download at ${CoreConstants.MANTRAWEBSITE}`);
                    }
                } else {
                    MantraConsole.error(`${CoreConstants.MANTRAWEBSITE} says: ${apiCallResult.message} ${String.fromCodePoint(0x1F625)}`);
                    ShowSupportMessageAfterFailure();
                }
            } catch (err) {
                const publicApiNotAvailable = err.code && err.code == 'ECONNREFUSED';

                MantraConsole.error(`Opps... Seems that ${CoreConstants.MANTRAWEBSITE} is not working properly now ${String.fromCodePoint(0x1F625)}`);

                ShowSupportMessageAfterFailure();

                if (publicApiNotAvailable) {
                    MantraConsole.error("Seems Mantra public api is not available now.");
                } else {
                    MantraConsole.error(err);
                }
            }
        }
     }
}

function GetProjectName( fullProjectName ) {
    const projectParts = MantraUtils.ExtractValues( fullProjectName, "{projectName}@{version}");
    return projectParts ? projectParts.projectName : fullProjectName;
}

function ShowSupportMessageAfterFailure() {
    MantraConsole.error( `If the problem persists or if you think this is something we need to fix or improve, please contact with ${CoreConstants.MANTRASUPPORTMAIL} and we'll be happy to make Mantra better.`);
}