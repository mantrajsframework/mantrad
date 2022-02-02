# Mantra Logger

Mantra provides its own mecanism for logging messages.

These messages are saved at Mantra core databases.

There are three types of log messages: info, warning and error.

These are the method that can be used for logging:

* MantraAPI.LogInfo( description, data, key, counter )
* MantraAPI.LogWarning( description, data, key, counter )
* MantraAPI.LogError( description, data, key, counter )

Where:

* description: [description message for the log entry]
* data: [string with the data associated with the log entry, optional]
* key: [user key to identify the log entry, can be any unique string or component specific key, optional]
* counter: [used to identify some kind of order for log entries launched simultaneously]

By default, Mantra shows these messages in the console.

These behaviour can be overwritten using the injection of name "logapi" in the properties of "core" component.