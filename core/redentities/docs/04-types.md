# 04 Red Entities supported types

These are the types mapped from Red Entities to MySql databases:

* "string" -> Mysql type of VARCHAR(2048), default value of "" (empty string)
* "key"-> Mysql type of VARCHAR(24), default value of "" (empty string)
* "integer" -> Mysql type of INT, default value 0
* "boolean" -> Mysql type of BOOLEAN, default value of 0 (zero, false)
* "datetime" -> Mysql type of DATETIME, default value current date time in utc
* "json" -> Mysql type of LONGTEXT, default value of "" (empty string)
* "float" -> Mysql type of FLOAT, default value of 0.0
* "longtext" -> Mysql type of LONGTEXT, default value of "" (empty string)

The following are the mappings to Sqlite3 database engine:

* "string" -> Sqlite3 type of TEXT, default value of "" (empty string)
* "key"-> Sqlite3 type of TEXT, default value of "" (empty string)
* "integer" -> Sqlite3 type of INTEGER, default value 0
* "boolean" -> Sqlite3 type of INTEGER (0 or 1), default value of 0 (zero, false)
* "datetime" -> Sqlite3 type of TEXT, default value current date time in utc
* "json" -> Sqlite3 type of TEXT, default value of "" (empty string)
* "float" -> Sqlite3 type of REAL, default value of 0.0
* "longtext" -> Sqlite3 type of TEXT, default value of "" (empty string)

Tip: keeping your data persistance simple improves the design and scalability of your application.