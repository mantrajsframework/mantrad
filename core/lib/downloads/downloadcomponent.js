/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */

"use strict";

const Path = require("path");

const CoreConstants = global.gimport("coreconstants");
const CoreCommandsUtils = global.gimport("corecommandsutils");
const InstallComponentImpl = global.gimport("installcomponentimpl");
const MantrajsApiClient = global.gimport("mantrajsapiclient");
const MantraConsole = global.gimport("mantraconsole");
const MantraUtils = global.gimport("mantrautils");

module.exports = {
    Download: async (Mantra, componentName) => {
        const existsTarCommand = await CoreCommandsUtils.ExistsTarCommandInSystem();;

        if (!existsTarCommand) {
            MantraConsole.warning(`Unable to locate in system 'tar' command to run download-component`);
        } else {
            try {                
                const credentials = await CoreCommandsUtils.GetUserCredentialsToDownloadComponent();

                const componentDownloadRequestData = {
                    usermail: credentials.userMail,
                    licensekey: credentials.licenseKey,
                    componentnamerequested: componentName
                };

                MantraConsole.info(`Downloading...`);

                const apiCallResult = await MantrajsApiClient.GetDownloadTokenForComponent(componentDownloadRequestData);

                if (apiCallResult.success) {
                    const destinationFolder = Path.join(process.cwd(), CoreConstants.DOWNLOADEDFOLDER);
                    await MantraUtils.EnsureDir(destinationFolder);
                    const downloadToken = apiCallResult.payload.downloadtoken;
                    const fileNameDownloaded = await MantrajsApiClient.GetDownloadComponent(downloadToken, destinationFolder);

                    MantraConsole.info(`File ${fileNameDownloaded} downloaded with success at '${CoreConstants.DOWNLOADEDFOLDER}' folder`);

                    const answer = await MantraConsole.question(`Install component '${componentName}' [Y]/N? `);

                    if (answer == "Y" || answer == "") {        
                        const ExecCommand = global.gimport("execcommand");
                        const gzFullPathFile = Path.join(destinationFolder, fileNameDownloaded);
                        const destinationComponentFolder = Path.join(process.cwd(), await CoreCommandsUtils.GetComponentLocation());
                        const untarCommand = `tar -xzf ${gzFullPathFile} -C ${destinationComponentFolder}`;

                        MantraConsole.info("Uncompressing component...");
                        await ExecCommand.exec(untarCommand);
                        await InstallComponentImpl.Install(Mantra, componentName, false);
                    }
                } else {
                    MantraConsole.error(`${CoreConstants.MANTRAWEBSITE} says: ${apiCallResult.message} ${String.fromCodePoint(0x1F625)}`);
                    ShowSupportMessageAfterFailure();
                }
            } catch (err) {
                const publicApiNotAvailable = err.code && err.code == 'ECONNREFUSED';

                MantraConsole.error(`Opps... Seems that ${CoreConstants.MANTRAWEBSITE} is not working properly now ${String.fromCodePoint(0x1F625)}`);

                ShowSupportMessageAfterFailure();

                if ( publicApiNotAvailable ) {
                    MantraConsole.error("Seems Mantra public api is not available now.");
                } else {
                    MantraConsole.error(err);
                }
            }
        }
    }
}

function ShowSupportMessageAfterFailure() {
    MantraConsole.error( `If the problem persists or if you think this is something we need to fix or improve, please contact with ${CoreConstants.MANTRASUPPORTMAIL} and we'll be happy to make Mantra better.`);
}