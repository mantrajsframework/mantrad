# 16 Red Entities recomendations

The purpose of Red Entities is to isolate how data are persisted. The client of Red Entities just want to:

* Define a data model as simple as posible (data schema).
* Access the data model easy with shorcuts like I(), S(), U(), D() (CRUD functions).
* Change data technology persistance if necesary (PostgreSQL, MySql, Aurora, DynamoDB, Azure Tables, etc.).

To allow this, it is higly recommendable to follow this tips:

* Avoid accesing data using directly "ID" field. This is an *internal* data field generated by Red Entities. Used SingleById() method instead.
* All entities names and fields should be lower case. This can prevent issues by engines like PostgreSQL.
* Define your logical data to persist as simple as posible (simple data types like string, datestamp, integer, json, etc).

You can use Red Entities individually in your project, despite it is a sub project of [Mantra Framework](https://www.mantrajs.com).