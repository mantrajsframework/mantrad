Mantra Microkernel Framework (MMF) is a framework based on NodeJS to develop scalable projects with highly decoupled components and projects following *lean* methodology with fast and high evolution.

A Mantra project follows some design and software architecture principles defined in *Mantra Paradigm Development Principles*.

# Install with NPM

```
$ npm install -g mantrad
```

To check if it is successfully installed:
```
$ mantrad version
```

# Mantra Microkernel Framework. What it is?

Mantra is a NodeJS framework for *lean*, scalable and high performance projects, based on small and highly decoupled components.

A Mantra application is based on multiple components that interact between them.

The framework intends to define simple components with very specific functionality, following S.O.L.I.D. and Dependency Inyection principles.

In current version 1.x, Mantra depends on:

* [RedEntities](https://github.com/gomezbl/redentities) as object mapper for data repositories.
* [Express](https://expressjs.com/) as core web server.
* [Mustache](https://github.com/janl/mustache.js) template redering mecanism for views.
* Tested with NodeJS 12.x, 13.x, 14.x, 15.x and 16.x.

Future versions will support more data providers and rendering engines.

# Test
To test MMF code project, got to Mantra installation folder and use mocha:

```
$ mocha
```

# What kind of applications can be built with MMF?
You can use MMF for building many different kinds of applications:

* Scalable web applications.
* Multisite web applications (multiple sites using same set of components).
* Command line interface applications.
* Applications with no UI to run any kind of tasks.
* Microservices applications.
* Standalone applications with specific purposes.
* A mix of all above in the same project.

In the same MMF project can live together all applications needed to run it: main UI, operation UI, maintenance apps, task scheduler, etc.

# Mantra application samples

You can find multiple samples in [Mantra Demos](https://github.com/gomezbl/mantra-demos) repository.

# Documentation

Learn to build Mantra projects with this documentation:

- [Mantra Development Paradigm](/docs/mantra-development-paradigm.md)
- [Mantra Hello World](/docs/mantra-hello-world.md)
- [Anatomy of a Mantra Project](/docs/anatomy-of-a-mantra-project.md)
- [mantraconfig.json File](/docs/mantraconfig.json-file.md)
- [Mantra Component Definition](/docs/mantra-component-definition.md)
- [Installing and Uninstalling Components](/docs/installing-and-uninstalling-components.md)
- [Component Assets](/docs/component-assets.md)
- [Component Configuration](/docs/component-configuration.md)
- [Component Entity Model](/docs/component-entity-model.md)
- [Component Hooks Registering](/docs/component-hooks-registering.md)
- [Component APIs](/docs/component-apis.md)
- [Component Views](/docs/component-views.md)
- [Component POSTs](/docs/component-posts.md)
- [Component GETs](/docs/component-gets.md)
- [Component Middlewares](/docs/component-middlewares.md)
- [Component Events Subscription](/docs/component-events-subscription.md)
- [Component Blocks](/docs/component-blocks.md)
- [Component Prerequests](/docs/component-prerequests.md)
- [Component Access Conditions](/docs/component-access-conditions.md)
- [Component Commands](/docs/component-commands.md)
- [HTML Templates](/docs/html-templates.md)
- [Mantra Data Access Layer](/docs/mantra-data-access-layer.md)
- [Mantra Core Events](/docs/mantra-core-events.md)
- [Adapting root HTML document to Mantra](/docs/adapting-root-html-document-to-mantra.md)
- [Component Updating](/docs/component-updating.md)
- [Mantra Bootstrap Process](/docs/mantra-bootstrap-process.md)
- [Mantra Core Commands](/docs/mantra-core-commands.md)
- [Mantra Core Components](/docs/mantra-core-components.md)
- [Mantra Logger](/docs/mantra-logger.md)
- [MantraAPI Reference](/docs/mantraapi-reference.md)
- [Mantra Utils Reference](/docs/mantra-utils-reference.md)
- [mantracoreapi.js File Reference](/docs/mantracoreapi.js-file-reference.md)
- [Instance ID of the Application Running](/docs/instanceid.md)