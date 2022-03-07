/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const Path = require("path");

const MantraConsole = global.gimport("mantraconsole");
const CoreConstants = global.gimport("coreconstants");
const MantraNewProject = global.gimport("mantranewproject");
const MantraServer = global.gimport("mantraserver");
const MantraUtils = global.gimport("mantrautils");

class MantraStartup {
    async showHelp(config ) {
        MantraServer.initGlobal(config);

        // Start components cause they can register commands
        await MantraServer.startComponents();

        const cmds = this.GetCommands(global.Mantra.MantraAPIFactory());

        MantraConsole.info(`Component commands & Mantra default commands:`);

        showCommands(cmds);
        showWebsiteMessageInfo();
    }

    async showDefaultHelp() {
        MantraConsole.info(`Mantra default commands:`);
        const defaultCommands = getDefaultCommands();
        
        // Remove commands not available when no mantraconfig.json is detected
        delete defaultCommands["startapp"];
        delete defaultCommands["npm-install"];
        delete defaultCommands["install"];

        showCommands(defaultCommands);
        showWebsiteMessageInfo();
    }

    async showVersion() {
        MantraConsole.info(`Mantra version: ${getMantraVersion()}`, false);
        showWebsiteMessageInfo();
    }

    async performCommand(config, args) {
        MantraServer.initGlobal(config, true); // Load all enabled components with this parameter to true
        await MantraServer.startComponents();
    
        let api = global.Mantra.MantraAPIFactory();
        let cmds = this.GetCommands(api);
        let commandToPerform = cmds[args.command];
    
        if (!commandToPerform) {
            MantraConsole.warning(`Command ${args.command} doesn't exists`);
        } else {
            await commandToPerform.Handler(api, process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
        }
    }

    async startApp(config, args) {
        if ( !isValidAppName(config, args)  ) {
            MantraConsole.error( `Unable to locate app with name '${args.arg1}'. Check config file` );
            process.exit();
        }

        const appToStart = getAppToStart(config, args);
        config.setApp( appToStart );

        MantraConsole.info(`Starting Mantra App ${getMantraVersion()}`);
        await MantraServer.startServer(config);
        MantraConsole.info(`Mantra "${appToStart}" application started at process ID ${process.pid}`);
    }

    GetCommands(MantraAPI) {
        let cmds = [];
        const commands = MantraAPI.GetHooksByName("command");
        const defaultCommands = getDefaultCommands();

        for (let c of commands) {
            cmds[c.Name] = {
                Description: c.Description,
                Handler: c.Handler,
                Component: c.Component
            }
        }

        for(let defaultCommand of Object.keys(defaultCommands) ) {
            cmds[defaultCommand] = defaultCommands[defaultCommand];
        }

        return cmds;
    }

    async install(config, args) {
        MantraServer.initGlobal(config, args.site);
        const api = global.Mantra.MantraAPIFactory();

        const installer = global.gimport("mcinstaller")();

        await installer.PerformCommand(api, process.argv[3]);
    }

    async newProject() {
        MantraConsole.info(`New project with Mantra version: ${getMantraVersion()}`);

        return MantraNewProject.launchInstaller();
    }
}

function getDefaultCommands() {
    let cmds = [];

    cmds['startapp'] = {
        Description: "Starts an application according to config file. Usage: startapp <app name for that site, optional. If not present, then first app in config file will be started>"
    }

    cmds['new-project'] = {
        Description: "Creates a new Mantra project"
    }

    cmds['install'] = {
        Description: "Install the project according to config file. Usage: install"
    }

    cmds['version'] = {
        Description: "Show Mantra version"
    }

    cmds['npm-install'] = {
        Description: "Run 'npm install' for components with Node dependencies. Usage: npm-install <component name | optional>"
    }

    cmds['download-project'] = {
        Description: `Download a project from ${CoreConstants.MANTRAWEBSITE}. Usage: donwload-project <project name> | <project name>@<version>`
    }

    return cmds;
}

function showCommands(cmds) {
    let commands = [];
    const Chalk = require("chalk");
    
    for (const command of Object.keys(cmds) ) {
        commands.push( {
            Command: command,
            Description: cmds[command].Description,
            Component: (!cmds[command].Component || cmds[command].Component == "corecommands" ) ? "mantra" : cmds[command].Component
        })
    }
    
    for( const command of MantraUtils.Underscore.sortBy( commands, "Component" ) ) {
        MantraConsole.rawInfo(`${Chalk.white(command.Command)} (${Chalk.green(command.Component)}) : ${Chalk.yellow(command.Description)}`);
    }
}

function getMantraVersion() {
    return( require(Path.join(__dirname,"package.json") ).version );
}

function getAppToStart(config, args) {
    if ( !args.arg1 ) return Object.keys(config.Apps)[0];
    else return args.arg1;
}

function isValidAppName(config, args) {
    return !args.arg1 || config.Apps[args.arg1];
}

function showWebsiteMessageInfo() {
    MantraConsole.info( `More info at ${CoreConstants.MANTRAWEBSITE} site`, false );
}

module.exports = () => new MantraStartup();