Mantra is a framework based on [Node.js](https://nodejs.org/) to develop scalable projects with highly decoupled components and projects following *lean* methodology with fast and high evolution.

A Mantra project follows some design and software architecture principles defined in [Mantra Paradigm Development Principles](/docs/mantra-development-paradigm.md).

# Install with NPM

*mantrad* is the command line interface (cli) to manage Mantra applications. Install it with:

```
$ npm install -g mantrad
```

To check if it is successfully installed:

```
$ mantrad version
```

# Mantra "Hello World"

Run your first Mantra project with [Mantra Hello World](/docs/24-mantra-hello-world.md) sample step by step.

# Mantra. What it is?

Mantra is a Node.js framework for *lean*, scalable and high performance projects, based on small and highly decoupled components.

A Mantra application is based on multiple components that interact between them using a global interaction layer (Mantra). 

Each component *exposes* assets (APIs, posts and gets controllers, data models, views, blocks, middlewares, cron jobs, commands, *prerequests*, access conditions, etc.). Mantra is in charge of the decoupled interaction between all of them. 

The framework intends to define simple components with very specific functionality, following S.O.L.I.D. and Dependency Inyection principles, with extremely simple data models, easy updates, multiapplications within the same project and extremely well organized projects. 

Mantra depends on:

* [RedEntities](https://github.com/gomezbl/redentities) as object mapper for data repositories.
* [Express](https://expressjs.com/) as core web server.
* [Mustache](https://github.com/janl/mustache.js) template redering mecanism for views.

Mantra works and has been tested with Node.js 12.x, 13.x, 14.x, 15.x, 16.x and 17.x.

Future versions will support more data providers and rendering engines.

# Test
To test Mantra code project, go to Mantra installation folder and use mocha:

```
$ mocha
```

# What kind of applications can be built with Mantra?
You can use Mantra for building many different kinds of applications:

* Scalable web applications.
* Multisite web applications (multiple sites using same set of components).
* Command line interface applications.
* Applications with no UI to run any kind of tasks.
* Microservices applications.
* Standalone applications with specific purposes.
* A mix of all above in the same project.

In the same Mantra project can live together all applications needed to run it: main UI, operation UI, maintenance apps, task scheduler, etc.

# Mantra application samples

In adition to the documentation, the best way to learn how to write Mantra projects is reading samples. You can find multiple samples at [Mantra Demos](https://github.com/gomezbl/mantra-demos) repository.

# Documentation

Learn to build Mantra projects with this documentation:

- [Mantra Development Paradigm](/docs/01-mantra-development-paradigm.md)
- [Anatomy of a Mantra Project](/docs/02-anatomy-of-a-mantra-project.md)
- [Mantra Component Definition](/docs/03-mantra-component-definition.md)
- [Mantra Data Access Layer](/docs/04-mantra-data-access-layer.md)
- [Component assets](/docs/05-component-assets.md)
- [Component Hooks Registering](/docs/06-component-hooks-registering.md)
- [Component Views](/docs/07-component-views.md)
- [Component Apis](/docs/08-component-apis.md)
- [Component Blocks](/docs/09-component-blocks.md)
- [Component Gets](/docs/10-component-gets.md)
- [Component Middlewares](/docs/11-component-middlewares.md)
- [Component Access Conditions](/docs/12-component-access-conditions.md)
- [Component Prerequests](/docs/13-component-prerequests.md)
- [Component Posts](/docs/14-component-posts.md)
- [Component Commands](/docs/15-component-commands.md)
- [Component Extends](/docs/16-component-extend.md)
- [Component Configuration](/docs/17-component-configuration.md)
- [Component Events Subscription](/docs/18-component-events-subscription.md)
- [Component Entity Model](/docs/19-component-entity-model.md)
- [Component Updating](/docs/20-component-updating.md)
- [Installing and Uninstalling Components](/docs/21-installing-and-uninstalling-components.md)
- [Adapting Root Html Document to Mantra](/docs/22-adapting-root-html-document-to-mantra.md)
- [Assetslocations Reference](/docs/23-assetslocations-reference.md)
- [Mantra Hello World](/docs/24-mantra-hello-world.md)
- [Mantra Services](/docs/25-mantra-services.md)
- [Mantra Templates](/docs/26-html-templates.md)
- [Mantra Bootstrap Process](/docs/27-mantra-bootstrap-process.md)
- [Mantra Core Commands](/docs/28-mantra-core-commands.md)
- [Mantra Core Components](/docs/29-mantra-core-components.md)
- [Mantra Core Events](/docs/30-mantra-core-events.md)
- [Mantra Logger](/docs/31-mantra-logger.md)
- [Mantra Intance Id](/docs/32-instanceid.md)
- [Mantra API Reference](/docs/33-mantra-API-reference.md)
- [Mantra Utils Reference](/docs/34-mantra-Utils-reference.md)
- [mantraconfig.json File](/docs/35-mantraconfig-json-file.md)
- [mantracoreapi.js File Reference](/docs/36-mantracoreapi-js-file-reference.md)



Mantra demos, components and projects marketplace at [mantrajs.com](https://www.mantrajs.com).