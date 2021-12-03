#  MantraAPI Utils Reference

MantraAPI.Util returns an object with some useful methods used internally by Mantra framework but that it can be used by any component. Most of them are based on "fs" and "fs-extra" Node.js modules:

* [MantraAPI.Utils.CopyFile](#mantraapi.utils.copyfile)
  
* [MantraAPI.Utils.CurrentDateMinusDays](#mantraapi.utils.currentdateminusdays)

* [MantraAPI.Utils.CurrentDateMinusSeconds](#mantraapi.utils.currentdateminusseconds)

* [MantraAPI.Utils.DeepCopy](#mantraapi.utils.deepcopy)

* [MantraAPI.Utils.DeleteFile](#mantraapi.utils.deletefile)

* [MantraAPI.Utils.DeleteFolder](#mantraapi.utils.deletefolder)

* [MantraAPI.Utils.EnsureDir](#mantraapi.utils.ensuredir)

* [MantraAPI.Utils.ExistsDirectory](#mantraapi.utils.existsdirectory)

* [MantraAPI.Utils.ExtractValues](#mantraapi.utils.extractvalues)

* [MantraAPI.Utils.FileExists](#mantraapi.Utils.FileExists)

* [MantraAPI.Utils.FileExistsSync](#mantraapi.utils.fileexistssync)

* [MantraAPI.Utils.FilesCountInFolder](#mantraapi.utils.filescountinfolder)
  
* [MantraAPI.Utils.FileStat](#mantraapi.utils.filestat)

* [MantraAPI.Utils.GetMIMETypes](#mantraapi.utils.getmimetypes)

* [MantraAPI.Utils.IsDirectorySync](#mantraapi.utils.isdirectorysync)

* [MantraAPI.Utils.IsFileOlderThan](#mantraapi.utils.isfileolderthan)

* [MantraAPI.Utils.IsMIMEType](#mantraapi.utils.ismimetype)

* [MantraAPI.Utils.ListFiles](#mantraapi.utils.listfiles)

* [MantraAPI.Utils.NormalizeString](#mantraapi.utils.normalizestring)

* [MantraAPI.Utils.ParseComponentPath](#mantraapi.utils.parsecomponentpath)

* [MantraAPI.Utils.ReadDirectories](#mantraapi.utils.readdirectories)

* [MantraAPI.Utils.ReadDirectory](#mantraapi.utils.readdirectory)

* [MantraAPI.Utils.ReaddirSync](#mantraapi.utils.readdirsync)

* [MantraAPI.Utils.ReadFileAsync](#mantraapi.utils.readfileasync)

* [MantraAPI.Utils.ReadFilesWithExtension](#mantraapi.utils.readfileswithextension)

* [MantraAPI.Utils.SanitizeToLatin](#MantraAPI.Utils.SanitizeToLatin)

* [MantraAPI.Utils.SaveTextFileAsync](#mantraapi.utils.savetextfileasync)

* [MantraAPI.Utils.TouchFile](#mantraapi.utils.touchfile)

* [MantraAPI.Utils.Underscore](#mantraapi.utils.underscore)

# MantraAPI.Utils methods definitions

```js
```

## MantraAPI.Utils.CopyFile

```js
async CopyFile( source, destination )
```

Copy a file from source to destination.

Params:
* source: <full path to source file to be copied>
* destination: <full path to destination file>

## MantraAPI.Utils.CurrentDateMinusDays

```js
CurrentDateMinusDays( days ) {
```

Returns a Date object with the current date minus days indicated as parameter.

## MantraAPI.Utils.CurrentDateMinusSeconds

```js
CurrentDateMinusSeconds( seconds )
```

Returns a Date object with the current date minus seconds indicated as parameter.

## MantraAPI.Utils.DeepCopy

```js
async DeepCopy( source, dest ) {
```

Deep copy all files in source to dest folder.

Params:
* source: <full path to source folder>
* destination: <full path to destination folder>


## MantraAPI.Utils.DeleteFile

```js
async DeleteFile( fullPathToFile )
```

Removes the file indicated in the parameter.

Param:
* fullPathToFile: <full path to the file>

## MantraAPI.Utils.DeleteFolder

```js
async DeleteFolder( fullPathToFolder )
```

Removes an empty folder.

Param:
* fullPathToFolder: <full path to folder to remove>

## MantraAPI.Utils.EnsureDir

```js
async EnsureDir( fullPathToFolder )
```

Check if a folder exists, if not, creates it.

Param:
* fullPathToFolder: <full path to folder>

## MantraAPI.Utils.ExistsDirectory

```js
async ExistsDirectory( fullPathToDirectory )
```

Returns a boolean indicating if a path exists.

Param:
* fullPathToDirectory: <full path to folder to check if exists>

## MantraAPI.Utils.ExtractValues

Property with instance of ["extract-values"](https://github.com/laktek/extract-values) module.

## MantraAPI.Utils.FileExists

```js
async FileExists( fullPathToFile )
```

Returns a boolean indicating if a file exists.

Param:
* fullPathToFile: <full path to file to check if exists>

## MantraAPI.Utils.FileExistsSync

```js
FileExistsSync( fullPathToFile )
```

Synchronous version of FileExists.

## MantraAPI.Utils.FilesCountInFolder

```js
async FilesCountInFolder( fullPathToFolder )
```

Returns the number of files in a folder.

Param:
* fullPathToFolder: <full path to folder>

## MantraAPI.Utils.FileStat

```js
FileStat( fullPathToFile )
```

Returns a json object with the file stats.

Param:
* fullPathToFile: <full path to file>

## MantraAPI.Utils.GetMIMETypes

```js
GetMIMETypes()
```

Returns a json object with typical MIME TYPES.

This is the object returned:

```js
{
    '.ico': 'image/x-icon',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt',
    '.txt': 'text/plain',
    '.map': 'application/octet-stream',
    '.woff2': 'font/woff2',
    '.svg': 'image/svg+xml',
    '.ttf': 'application/x-font-ttf',
    '.otf': 'application/x-font-opentype',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.eot': 'application/vnd.ms-fontobject',
    '.sfnt': 'application/font-sfnt'
};
```

## MantraAPI.Utils.IsDirectorySync

```js
isDirectorySync( fullPathToCheck )
```

Returns synchronously a boolean checking if a path is a directory.

Param:
* fullPathToCheck: <full path to check if it's a directory>


## MantraAPI.Utils.IsFileOlderThan

```js
async IsFileOlderThan( fullPathToFile, seconds )
```

Returns a boolean indicating if a file is older than seconds indicated as parameter.

Params: 
* fullPathToFile: <full path to file to check>
* seconds: <seconds to check>

## MantraAPI.Utils.IsMIMEType

```js
IsMIMEType( mimeTypeToCheck )
```

Returns a boolean indicating if the string parameter is a MIME string.

Param:
* mimeTypeToCheck: <string with the mime type to check, like ".ico", ".wav" and the like>

## MantraAPI.Utils.ListFiles

```js
async ListFiles( fullPath )
```

Returns an array with the full paths of all files contained in the folder indicated as parameter.

Param:
* fullPath: <full path with the files to be listed>

## MantraAPI.Utils.NormalizeString

```js
NormalizeString(str) {
```

Returns the string indicated as parameter with all accents/diacritics removed.

## MantraAPI.Utils.ParseComponentPath

```js
ParseComponentPath( componentPath )
```

Parses a component path like <component>.<asset>, like users.userview, and returns a json like:

```js
{
  component: "<component name>", asset: "<asset>"
}
```

Returns null if the path doesn't match.


## MantraAPI.Utils.ReadDirectories

```js
async readDirectories( fullPath )
```

Returns an array with the full paths to all directories contained in the folder indicated as parameter.


## MantraAPI.Utils.ReadDirectory

```js
async ReadDirectory( fullPath )
```

Return an array with all files (files and directories) contained in the path indicated as parameter.

## MantraAPI.Utils.ReaddirSync

```js
ReaddirSync( directory )
```

Synchronous version of ReadDirectory method.

## MantraAPI.Utils.ReadFileAsync

```js
async ReadFileAsync( fullPathToFile )
```

Returns a Buffer object with the content of a file.

Param:
* fullPathToFile: <full path to file to read>

## MantraAPI.Utils.ReadFilesWithExtension

```js
async ReadFilesWithExtension( fullPath, extension ) {
```

Returns an array with the full path to all files containted in fullPath with the extension indicated as parameter.

Params: 
* fullPath: <full path with the files to list>
* extension: <extension of the files to be listed>

## MantraAPI.Utils.SanitizeToLatin

```js
SanitizeToLatin( str )
```

Returns the string indicated as parameter removing all characteres apart from letters, numbers, and accents.

## MantraAPI.Utils.SaveTextFileAsync

```js
async SaveTextFileAsync( fullPathToFile, text )
```

Creates a text file with the text content indicated as parameter.

Param:
* fullPathToFile: <full path of the file to create>
* text: <text content of the new file to create>

## MantraAPI.Utils.TouchFile

```js
TouchFile( fullPathToFile )
```

Creates an empty file.

Param:
* fullPathToFile: <full path to the file to "touch">

## MantraAPI.Utils.Underscore

Returns the instance of [underscore module](https://github.com/jashkenas/underscore).