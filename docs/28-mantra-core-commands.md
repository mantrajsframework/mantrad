# Mantra Core Commands

By default, Mantra implements some helpful commands for usual tasks when working with a Mantra project. On the other hand, any component can implement its own commands to be run from the command line as explained at [Component Command Line Interface (cli) Definition](./docs/17-component-commands.md).

This is one of the nice features of Mantra Framework.

Running mantra from the shell without parameters will show all commands available.

```
$ mantrad
```

If you run this inside a Mantra project, then all Mantra commands will be shown as well as all commands implemented by the components.

All core commands are implemented in "corecommmand" component. By "core commands" we mean the default Mantra commands (like *startapp*, *show-views* and the like described in this document).

As component commands, some of them requires aditional parameters.

As custom components commands, they can be run indicating the relative or absolute path of the project, like in these examples:

```bash
$ mantrad ./project/myproject/show-components
```

```bash
$ mantrad /home/user/project/myproject/show-components
```

These are the Mantra core commands:

* [check-health](#check-health)

* [check-project](#check-project)

* [disable-component](#disable-component)

* [download-component](#download-component)

* [download-project](#download-project)

* [enable-component](#enable-component)

* [gzip-component](#gzip-component)

* [gzip-project](#gzip-project)

* [install-component](#install-component)

* [new-component](#new-component)

* [reinstall-component](#reinstall-component)

* [show-accessconditions](#show-accessconditions)

* [show-apis](#show-apis)

* [show-blocks](#show-blocks)

* [show-commands](#show-commands)

* [show-component](#show-component)

* [show-components](#show-components)

* [show-component-config](#show-component-config)

* [show-components-to-update](#show-components-to-update)

* [show-crons](#show-crons)

* [show-events-subscribers](#show-events-subscribers)

* [show-middlewares](#show-middlewares)

* [show-prerequests](#show-prerequests),

* [show-posts](#show-posts)

* [show-views](#show-views)

* [startall](#startall)

* [startapp](#startapp)

* [uninstall-component](#uninstall-component)

* [update](#update)

* [update-components-locations](#update-components-locations)
 
# Mantra Core Commands Reference

## check-health

```bash
$ mantrad check-health
```

By running this command, Mantra will invoke all Start.onCheckHealth() methods implemented in the components modules.

This method is optional, and it is intended to implement some kind of checking about the health of the system according to the specific component functionality.

## check-project

```bash
$ mantrad check-project
```

This command performs some checks to verify that the project where it is executed is fine.

To improve perfomance, when running a Mantra application, Mantra performs the minimal check as it can. For this reason, run this command when something is wrong in your project.

It checks things like this:

* Entities providers are right.
* All prerequests and access conditions used by views, blocks, etc. are defined.
* Injections points to existing components APIs.
* etc.

## disable-component

```bash
$ mantrad disable-component [component name]
```

Disables a component given its name.

If a component it is not enable, then will not be loaded when starting any applications of the project.

## download-component

```bash
$ mantrad download-component [component name] | [component name]@[version]
```

Downloads a component from www.mantrajs.com site.

You need to be registered at the site. You can get your free license key at your profile account: You can get your free license key at your profile account: [https://www.mantrajs.com/licenses/userlicense](https://www.mantrajs.com/licenses/userlicense).

Components available at [https://www.mantrajs.com/marketplacecomponent/components](https://www.mantrajs.com/marketplacecomponent/components).

## download-project

```bash
$ mantrad download-project [project name] | [project name]@[version]
```

Downloads a project from www.mantrajs.com site.

You need to be registered at the site. You can get your free license key at your profile account: [https://www.mantrajs.com/licenses/userlicense](https://www.mantrajs.com/licenses/userlicense).

Projects available at [https://www.mantrajs.com/marketplaceproject/projects](https://www.mantrajs.com/marketplaceproject/projects).

## enable-component

```bash
$ mantrad enable-component [component name]
```

Enables a component given its name.

Mantra only loads all enabled components when starting any applications of the project.

## gzip-component

```bash
$ mantrad gzip-component [component name]
```

Generates a gzip tar file with a component of the current project.

## gzip-project

```bash
$ mantrad gzip-project [project path]
```

Generates a gzip tar file with a project which location is indicated as parameter.

## install-component

```bash
$ mantrad install-component [component name]
```

Installs a new component in the project.

This method will call Install.onInstall() (optional) method of the component so that it can perform some kind of installing work (like creating models instance in the databases).

*Remember*: once the component is intalled, it should be enabled with "enable-component" command.

## new-component

```bash
$ mantrad [name of the new component] 
```

Launches a cli wizard to create the skeleton of a new component in the project.

*Remember*: all new components added to the project, if they are going to be considered as "default" components, their names should be included in "DefaultComponents" properties of mantraconfig.json file.

## reinstall-component

```bash
$ mantrad reinstall-component [component name]
```

Uninstall an existing component and, if success, install it again.

During the uninstalling, this method will call Install.onUninstall() method (optional) to perform uninstalling actions. In the same way, during the installation, this method will call Install.onInstall() (optional) method of the component so that it can perform some kind of installing work (like creating models instance in the databases).

*Remember*: once the component is intalled, it should be enabled with "enable-component" command.

## show-accessconditions

```bash
$ mantrad show-accessconditions [component name, optional]
```

Shows the list of all access conditions definitions for all components. If [component name] is indicated, then only shows the access conditions defined by that component.

## show-blocks

```bash
$ mantrad show-blocks [component name, optional]
```

Shows the list of all blocks definitions for all components. If [component name] is indicated, then only shows all block definitions for that component.

## show-commands

```bash
$ mantrad show-commands [component name, optional]
```

Show all commands defined by components, included default commands. If component name is indicated, then only commands defined by it will be shown.

## show-component

```bash
$ mantrad show-component [component name]
```

Shows a json object with all hooks registration for the component.

## show-components

```bash
$ mantrad show-components
```

Shows a list with all components installed in the project.

## show-components-to-update

```bash
$ mantrad show-components-to-update
```

Shows the components that should be updated because its version has changed.

## show-component-config

```bash
$ mantrad show-component-config [component name]
```

Shows the configuration properties of a component. This configuration is located at "ComponentsConfig" section of the [mantraconfig.json](/docs/36-mantraconfig-json-file.md) file of the project or the default values at "defaultconfig" of [mantra.json](/docs/05-mantra-component-definition.md) file of the component.

See more details at [components configuration](/docs/18-component-configuration.md) section.

## show-crons

```bash
$ mantrad show-crons [component name, optional]
```

Shows the list of all crons jobs definitions for all components. If [component name] is indicated, then only shows all crons definitions for that component.

## show-events-subscribers

```bash
$ mantrad show-events-subscribers [component name, optional]
```

Shows the list of all events subsribers definitions for all components. If [component name] is indicated, then only shows all event subscriber definitions for that component.

## show-middlewares

```bash
$ mantrad show-middlewares [component name]
```

Shows the list of all middlewares definitions for all components. If [component name] is indicated, then only shows all middleware definitions for that component.

## show-posts

```bash
$ mantrad show-posts [component name]
```

Shows the list of all http posts definitions for all components. If [component name] is indicated, then only shows all post definitions for that component.

## show-prerequests

```bash
$ mantrad show-prerequests [component name]
```

Shows the list of all prerequests definitions for all components. If [component name] is indicated, then only shows all prerequests definitions for that component.

## show-views

```bash
$ mantrad show-views [component name, optional]
```

Shows the list of all views definitions for all components. If [component name] is indicated, then only shows all view definitions for that component.

## startall

```bash
$ mantrad startall
```

Starts all applications of the project defined at Apps section in [mantraconfig.json file](/docs/36-mantraconfig-json-file.md).

## startapp

```bash
$ mantrad startapp [application name, optional]
```

Starts the application indicated by its name in Apps section in [mantraconfig.json file](/docs/36-mantraconfig-json-file.md). If the application name is not indicated, then the first application of the App section will be started by default.

## uninstall-component

```bash
$ mantrad uninstall-component [component name]
```

Uninstalls a component in the project.

This method will call Install.onUninstall() (optional) method of the component so that it can perform some kind of uninstalling or cleaning work (like removing models instance in the databases).

## update

```bash
$ mantrad update
```

Iterates by all components and check their versions in their mantra.json file.

If they indicate a different version than the version installed, then thec command calls Install.onUpdate() (optional) method of the component.

## update-components-locations

```bash
$ mantrad update-components-locations
```

When installing a component, Mantra saves in core database their folder locations.

If for some reason, the location changes (ie. a component is moved to other folder), then this command should be performed.

This command updates the current component locations in core database.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).