# Mantra Logger

Mantra doesn't provide its own mecanism for logging messages. This can be *injected* in "log_api" core component configuration.

By default, messages are shown to console.

There are three types of log messages: info, warning and error.

These are the method that can be used for logging:

* MantraAPI.LogInfo( description, data, key, counter )
* MantraAPI.LogWarning( description, data, key, counter )
* MantraAPI.LogError( description, data, key, counter )

Where:

* description: [description message for the log entry]
* data: [string with the data associated with the log entry, optional]
* key: [user key to identify the log entry, can be any unique string or component specific key, optional]
* counter: [used to identify some kind of order for log entries launched simultaneously, optional]

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).