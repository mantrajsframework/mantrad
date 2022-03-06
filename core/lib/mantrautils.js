/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");

const MIME_TYPES = {
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

module.exports = {
    readTextFileAsync( file ) {
        return new Promise( (resolve,reject) => {
            fs.readFile( file, "utf-8", (err,data) => {
                if ( err ) return reject(err);
                
                resolve(data);
            })
        });
    },

    ReadFileAsync( file ) {
        return new Promise( (resolve,reject) => {
            fs.readFile( file, (err,data) => {
                if ( err ) reject(err);
                else resolve(data);
            })
        });
    },

    FileExists( fullPathToFile ) {
        return new Promise( (resolve,reject) => {
            fs.stat( fullPathToFile, (err,stats) => {
                if ( err ) {
                    if (err.code=='ENOENT') resolve(false);
                    else reject(err);
                }
                else resolve(true);
            });
        })
    },

    ReaddirSync( directory ) {
        return fs.readdirSync( directory );
    },

    FileExistsSync( fullPathToFile ) {
        return fs.existsSync( fullPathToFile );
    },

    SaveTextFileAsync( fullPathToFile, text ) {
        return new Promise( (resolve) => {
            const stream = fs.createWriteStream( fullPathToFile );

            stream.once( "open", (fd) => {
                stream.write( text );
                stream.end();

                resolve();
            });    
        });
    },

    GetMIMETypes() {
        return MIME_TYPES;
    },

    IsMIMEType( mimetype ) {
        return MIME_TYPES[mimetype] != null;
    },
    
   /*
    * Remove all accents/diacritics because indexer only accepts
    * plan english texts
    */
    NormalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },

    async ExistsDirectory( fullPath ) {
        return fsExtra.pathExists(fullPath)
    },

    ReadDirectory( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.readdir( fullPath, (err,files) => {
                if (err) reject(err);
                else resolve(files);
            })
        });
    },

    ReadDirectories( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.readdir( fullPath, (err,files) => {
                if (!!err) reject(err);
                else {
                    let directories = [];

                    for( const file of files ) {
                        const fullPathToFile = path.join(fullPath,file);
                        const fileStat = fs.statSync( fullPathToFile );
                        
                        if ( fileStat.isDirectory() ) {
                            directories.push( fullPathToFile )
                        }
                    }

                    resolve( directories );
                }
            })
        });
    },

    IsDirectorySync( fullPathToFile ) {
        return fs.existsSync( fullPathToFile ) && fs.lstatSync( fullPathToFile ).isDirectory();
    },

    ReadFilesWithExtension( fullPath, extension ) {
        return new Promise( (resolve,reject) => {
            fs.readdir( fullPath, (err,files) => {
                if (err) reject(err);
                else {
                    let filesInDirectory = [];

                    for( const file of files ) {
                        if ( path.extname(file).substr(1) == extension ) {
                            filesInDirectory.push( path.join(fullPath,file) )
                        }
                    }

                    resolve( filesInDirectory );
                }
            })
        });
    },

    ListFiles( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.readdir( fullPath, (err,files) => {
                if (err) reject(err);
                else {
                    let filesInDirectory = [];

                    for( const file of files ) {
                        let fullPathToFile = path.join(fullPath,file);

                        if ( fs.statSync( fullPathToFile ).isDirectory() == false ) {
                            filesInDirectory.push( fullPathToFile )
                        }                        
                    }

                    resolve( filesInDirectory );
                }
            })
        });
    },

    FilesCountInFolder( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.readdir( fullPath, (err,files) => {
                if (err) reject(err);
                else {
                    let filesCount = 0;

                    for( const file of files ) {
                        if ( fs.statSync( path.join(fullPath,file) ).isDirectory() == false ) {
                            filesCount++;
                        }                        
                    }

                    resolve( filesCount );
                }
            })
        });
    },

    FileStat( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.stat( fullPath, (err,stats) => {
                if ( err ) reject(err);
                else resolve(stats);
            });
        })
    },

    TouchFile( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.open(fullPath, "wx", function (err, fd) {
                if ( err ) reject(err);
                else {
                    fs.close(fd, function (err) {
                        if ( err ) reject(err);
                        else resolve();
                    });
                }
            })
        });
    },

    DeleteFile( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.unlink( fullPath, (err) => {
                if ( err )  {
                    reject(err);
                }
                else resolve();
            })
        });
    },

    DeleteFolder( fullPath ) {
        return new Promise( (resolve,reject) => {
            fs.rmdir( fullPath, (err) => {
                if ( err )  {
                    reject(err);
                }
                else resolve();
            })
        });
    },

    async EnsureDir( path ) {
        return fsExtra.ensureDir(path);
    },

    /*
     * Returns true if file is older than seconds indicated as parameter.
     */
    async IsFileOlderThan( fullPathToFile, seconds ) {
        return ((new Date() - new Date((await this.FileStat( fullPathToFile )).ctime)) / 1000) > seconds;
    },

    /*
     * Parses a component path like <component>.<asset>, like users.userview,
     * and returns a json like:
     * { component: <component name>, asset: <asset> }, or null
     * if path doesn't match
     */
    ParseComponentPath( path ) {
        const r = path.split( "." );

        if ( !r.length || r.length == 1 ) return null;

        return {
            component: r[0],
            asset: r.length == 2 ? r[1] : r.slice(1,r.length).join(".")
        }
    },

    /*
     * Returns the current date minus days indicated as parameter
     */
    CurrentDateMinusDays( days ) {
        return this.CurrentDateMinusSeconds( 60*60*24*days );
    },

    /*
     * Returns the current date minus seconds indicated as parameter
     */
    CurrentDateMinusSeconds( seconds ) {
        return new Date( Date.now() - seconds*1000 );
    },

    /*
     * Removes all characteres apart from letters and numbers, and accents
     */
    SanitizeToLatin( str ) {
        return str.trim().replace(/[^A-Za-z ñÑ áéíóúÁÉÍöÖÓÚüÜ 0-9 ,:"'-<>()]*/g, '')
    },

    /*
     * Deep copy all files in source to dest folder
     * source and dest are full paths
     */
    async DeepCopy( source, dest ) {
        const filesToCopy = await deepListFiles( source );

        for( const file of filesToCopy ) {
            const destFile = path.join( dest, file.substr(source.length) );

            await fsExtra.ensureDir( path.dirname(destFile) );
            await fsExtra.copy( file, destFile );
        }
    }, 

    /*
     * Copy a file from source to dest. Parameters includes full path to file
     */
    async CopyFile( source, dest ) {
        return fsExtra.copy( source, dest );
    }, 

    /*
     * Returns the instance of underscore library
     */
    Underscore: require("underscore"),

    /*
     * Returns the instance of extract-values library
     */
    ExtractValues: require("extract-values"),

    /*
     * Returns the instance of MantraConsole
     */
    Console: require("./mantraconsole.js")
}

async function deepListFiles( fullPath, allFiles ) {
    if (typeof allFiles == 'undefined') allFiles = [];

    let files = await fsExtra.readdir(fullPath);

    for (const file of files) {
        const fullPathToFile = path.join(fullPath, file);

        if (fs.statSync(fullPathToFile).isDirectory()) {
            await deepListFiles(fullPathToFile, allFiles);
        } else {
            allFiles.push(fullPathToFile);
        }
    }

    return allFiles;
}