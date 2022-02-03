# Core Events

A number of events are triggered by Mantra core according to core component configuration.

*Important to note:* core events are triggered if "cron" service is actived in the application.

## "system.startup" event

This event is triggered when the application has been launched, all components loaded and intialized and up & running.

## "system.cleanup" event

This event is triggered according to property "croncleanupevent" cron configuration for "core" component.

Is intended to perform some kind to cleaning during the application behaviour: remove old data in databases, remove temporal files and so no.

## "system.backup" event

This event is triggered according to property "cronbackupevent" cron configuration for "core" component.

Is is intended to perform backups if necesary in the application.

***
To learn by example, go to [Mantra demos](https://www.mantrajs.com/mantrademos/showall) and [components](https://www.mantrajs.com/marketplacecomponent/components) sections of [Mantra site](https://www.mantrajs.com).