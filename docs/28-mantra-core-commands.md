# Mantra Core Commands

By default, Mantra implements some helpful commands for usual tasks when working with a Mantra project. On the other hand, any component can implement its own commands to be run from the command line.

This is one of the nice features of Mantra Microkernel Framework.

Running mantra from the shell without parameters will show all commands available.

```
$ mantra
```

TODO: insertar enlace a la sección donde se explica cómo implementar comandos

If you run this inside a Mantra project, then all Mantra commands will be shown as well as all commands implemented by the components.

All core commands are implemented in "corecommmand" component.

As component commands, some of them requires aditional parameters.

These are the Mantra core commands:

* [check-health](#check-health)

* [disable-component](#disable-component)

* [enable-component](#enable-component)

* [install-component](#install-component)

* [new-component](#new-component)

* [show-apis](#show-apis)

* [show-accessconditions](#show-accessconditions)

* [show-blocks](#show-blocks)

* [show-events-subscribers](#show-events-subscribers)

* [show-views](#show-views)

* [show-commands](#show-commands)

* [show-component](#show-component)

* [show-components](#show-components)

* [show-components-to-update](#show-components-to-update)

* [show-middlewares](#show-middlewares)

* [show-posts](#show-posts)
  
* [uninstall-component](#uninstall-component)

* [update](#update)

* [update-components-locations](#update-components-locations)
  
## check-health

```
$ mantra check-health
```

By running this command, Mantra will invoke all Start.onCheckHealth() methods implemented in the components modules.

This method is optional, and it is intended to implement some kind of checking about the health of the system according to the specific component functionality.

## disable-component

```
$ mantra disable-component [component name]
```

Disables a component given its name.

If a component it is not enable, then will not be loaded when starting any applications of the project.

## enable-component

```
$ mantra enable-component [component name]
```

Enables a component given its name.

Mantra only loads all enabled components when starting any applications of the project.

## install-component

```
$ mantra install-component [component name]
```

Installs a new component in the project.

This method will call Install.onInstall() (optional) method of the component so that it can perform some kind of installing work (like creating models instance in the databases).

*Remember*: once the component is intalled, it should be enabled with "enable-component" command.

## new-component

```
$ mantra [name of the new component] 
```

Launches a cli wizard to create the skeleton of a new component in the project.

*Remember*: all new components added to the project, if they are going to be considered as "default" components, their names should be included in "DefaultComponents" properties of mantraconfig.json file.

## show-accessconditions

```
$ mantra show-accessconditions [component name, optional]
```

Shows the list of all access conditions definitions for all components. If [component name] is indicated, then only shows the access conditions defined by that component.

## show-apis

```
$ mantra show-apis [component name, optional]
```

Shows the list of all api definitions for all components. If [component name] is indicated, then only shows all api definitions for that component.

## show-blocks

```
$ mantra show-blocks [component name, optional]
```

Shows the list of all blocks definitions for all components. If [component name] is indicated, then only shows all block definitions for that component.

## show-events-subscribers

```
$ mantra show-events-subscribers [component name, optional]
```

Shows the list of all events subsribers definitions for all components. If [component name] is indicated, then only shows all event subscriber definitions for that component.

## show-views

```
$ mantra show-views [component name, optional]
```

Shows the list of all views definitions for all components. If [component name] is indicated, then only shows all view definitions for that component.

## show-commands

```
$ mantra show-commands [component name, optional]
```

Show all commands defined by components, included default commands. If component name is indicated, then only commands defined by it will be shown.

## show-component

```
$ mantra show-component [component name]
```

Shows a json object with all hooks registration for the component.

## show-components

```
$ mantra show-components
```

Shows a list with all components installed in the project.

## show-components-to-update

```
$ mantra show-components-to-update
```

Shows the components that should be updated because its version has changed.

## show-middlewares

```
$ mantra show-middlewares [component name]
```

Shows the list of all middlewares definitions for all components. If [component name] is indicated, then only shows all middleware definitions for that component.

## show-posts

```
$ mantra show-posts [component name]
```

Shows the list of all http posts definitions for all components. If [component name] is indicated, then only shows all post definitions for that component.

## uninstall-component

```
$ mantra uninstall-component [component name]
```

Uninstalls a component in the project.

This method will call Install.onUninstall() (optional) method of the component so that it can perform some kind of uninstalling or cleaning work (like removing models instance in the databases).

## update

```
$ mantra update
```

Iterates by all components and check their versions in their mantra.json file.

If they indicate a different version than the version installed, then thec command calls Install.onUpdate() (optional) method of the component.

## update-components-locations

```
$ mantra update-components-locations
```

When installing a component, Mantra saves in core database their folder locations.

If for some reason, the location changes (ie. a component is moved to other folder), then this command should be performed.

This command updates the current component locations in core database.