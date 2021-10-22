const Path = require("path");
const assert = require("chai").assert;

require("gimport").initm( process.cwd() );

const MantraUtils = global.gimport("mantrautils");

describe( 'MantraUtils tests', () => {
    it( '# readTextFileAsync test', async () => {
        const fileContent = await MantraUtils.readTextFileAsync( __filename );

        assert.isString( fileContent );
    });

    it( '# readFileAsync test', async () => {
        const fileContent = await MantraUtils.ReadFileAsync( __filename );

        assert.isTrue( Buffer.isBuffer(fileContent) );
    });

    it( '# fileExists exists test', async () => {
        assert.isTrue( await MantraUtils.FileExists( __filename ) );
    });

    it( '# fileExists no exists test', async () => {
        assert.isFalse( await MantraUtils.FileExists( __filename+"noexisting" ) );
    });

    it( '# fileExistsSync exists test', () => {
        assert.isTrue( MantraUtils.FileExistsSync( __filename ) );
    });

    it( '# fileExistsSync no exists test', () => {
        assert.isFalse( MantraUtils.FileExistsSync( __filename+"noexisting" ) );
    });

    it( '# getMIMETypes test', () => {
        assert.isTrue( typeof MantraUtils.GetMIMETypes() == 'object' );
    });

    it( '# isMIMEType test', () => {
        assert.isTrue( MantraUtils.IsMIMEType(".ico") );
        assert.isTrue( MantraUtils.IsMIMEType(".pdf") );
        assert.isTrue( MantraUtils.IsMIMEType(".jpg") );
        assert.isTrue( MantraUtils.IsMIMEType(".png") );
    });

    it( '# isMIMEType bad type test', () => {
        assert.isFalse( MantraUtils.IsMIMEType(".icooo") );
    });

    it( '# normalizeString test', () => {
        assert.equal( "Gomez", MantraUtils.NormalizeString("Gómez") );
        assert.equal( "aeiouaeiouAEIOU", MantraUtils.NormalizeString("àèìòùáéíóúÁÉÍÓÚ") );
    });

    it( '# existsDirectory exists test', async () => {
        assert.isTrue( await MantraUtils.ExistsDirectory(__dirname) );
    });

    it( '# existsDirectory no exists test', async () => {
        assert.isFalse( await MantraUtils.ExistsDirectory(__dirname+"noexists") );
    });

    it( '# readDirectory read existing test', async () => {
        let files = await MantraUtils.ReadDirectory( __dirname );
    
        assert.isTrue( Array.isArray(files) );
        assert.isTrue( files.length > 0  );
    });

    it( '# readDirectory read no existing test', async () => {
        try {
            let files = await MantraUtils.ReadDirectory( __dirname+"noexists" );

            assert.fail( "Exception expected" );

        } catch(err) {
            
        }
    });

    it( '# readDirectories', async () => {
        const directories = await MantraUtils.ReadDirectories( process.cwd() );
    
        assert.isTrue( Array.isArray(directories) );
        assert.isTrue( directories.length > 0  );

        for( const directory of directories ) {
            const files = await MantraUtils.ReadDirectory( directory );
    
            assert.isTrue( Array.isArray(files) );
            assert.isTrue( files.length > 0  );    
        }
    });

    it( '# readFilesWithExtension exists test', async () => {
        const jsFiles = await MantraUtils.ReadFilesWithExtension( __dirname, "js" );

        assert.isTrue( Array.isArray(jsFiles) );
        assert.isTrue( jsFiles.length > 0  );
    });

    it( '# readFilesWithExtension no exists test', async () => {
        const jsFiles = await MantraUtils.ReadFilesWithExtension( __dirname, "ts" );

        assert.isTrue( Array.isArray(jsFiles) );
        assert.isTrue( jsFiles.length == 0  );
    });


    it( '# listFiles', async () => {
        const files = await MantraUtils.ListFiles( __dirname );

        assert.isTrue( Array.isArray(files) );
        assert.isTrue( files.length > 0  );

        for( const file of files ) {
            const fileStat = await MantraUtils.FileStat( file );

            assert.isFalse( fileStat.isDirectory() );
        }
    });

    it( '# listFiles from testsfiles folder', async () => {
        let files = await MantraUtils.ListFiles( Path.join(__dirname, "testassets", "testfiles" ) );

        assert.isTrue( Array.isArray(files) );
        assert.isTrue( files.length == 3 );
        
        files = files.sort();

        assert.isTrue( files[0].endsWith("file1.txt") );
        assert.isTrue( files[1].endsWith("file2.txt") );
        assert.isTrue( files[2].endsWith("file3.txt") );

    });

    it( '# parseComponentPath', async () => {
        let cmp = "books.show";

        const p = MantraUtils.ParseComponentPath( cmp );

        assert.isObject( p );
        assert.equal( "books", p.component );
        assert.equal( "show", p.asset );
    });

    it( '# parseComponentPath bad path', async () => {
        let cmp = "books-show";

        const p = MantraUtils.ParseComponentPath( cmp );

        assert.isNull(p);
    });

    it( '# SanitizeToLatin test', async () => {
        assert.equal( '', MantraUtils.SanitizeToLatin("àèì") );
        assert.equal( 'mantra', MantraUtils.SanitizeToLatin("mantra") );
    });

    it( '# Underscore test', async () => {
        assert.isFunction( MantraUtils.Underscore );
    });

    it( '# ExtractValues test', async () => {
        assert.isFunction( MantraUtils.ExtractValues );
    });

    it( '# CurrentDateMinusSeconds test', async () => {
        const date = MantraUtils.CurrentDateMinusSeconds(10);
   
        try {
            Date.parse(date);
        }catch(err) {
            assert.fail("Exception when parsing date");
        }
    });

    it( '# CurrentDateMinusDays test', async () => {
        const date = MantraUtils.CurrentDateMinusDays(2);
   
        try {
            Date.parse(date);
        }catch(err) {
            assert.fail("Exception when parsing date");
        }
    });

    it( '# filesCountInFolder test', async () => {
        const filesCount = await MantraUtils.FilesCountInFolder(process.cwd());

        assert.isTrue( filesCount > 0 );
    })

    it( '# filesCountInFolder in testfiles folder test', async () => {
        const filesCount = await MantraUtils.FilesCountInFolder(Path.join(__dirname, "testassets", "testfiles" ));

        assert.isTrue( filesCount == 3 );
    })

    it( '# fileStat test', async() => {
        const stat = await MantraUtils.FileStat(__filename);
        
        assert.isObject(stat);
    });
});