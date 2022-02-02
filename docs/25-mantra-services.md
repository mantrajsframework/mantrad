# Mantra Services

Current version of Mantra supports these services:

* 'cron'
* 'get'
* 'middleware'
* 'post'
* 'view'
* 'extend'

By default, when running a Mantra app with "startapp" command, all services are enabled, this is, Mantra loads all registering *hooks* for all components and manage them properly.

If 'get' or 'post' services are enabled, then Express server is started.

In the same way, if "cron" service is enabled, then cron scheluder y launched.

The services to run by Mantra in an application, is indicated with "ActiveServices" property in the application configuration file. Also, you can define which hooks will be registered in the application using "ActiveServices" property in mantraconfig.json configuration file.

For more details about those two properties, ses [mantraconfig.json configuration file](/docs/mantraconfig.json-file.md).

With this, you can define multiple applications within your system and enabling exactly the services they need to run.

For instance, for a Mantra application that only read files from an ftp server periodically and store them in a database, only "cron" service needs to be enabled. For another application that only renders a web application, then "view" and "middleware" service should be enabled and so on.