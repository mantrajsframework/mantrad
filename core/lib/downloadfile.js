/*
 * This code file belongs to Mantra Framework project (www.mantrajs.com)
 * in the scope of MIT license. More info at support@mantrajs.com. Enjoy :-)
 */ 

"use strict";

const fs = require("fs");
const Path = require("path");

module.exports = {
    downloadFromUrl: (url, destinationFolder) => {       
        return new Promise( (resolve,reject) => {
            const httpClient = getHttpClientFromUrl(url);

            httpClient.get(url, (res) => {
                const fileName = extractFileNameFromResponse(res);
                const writeStream = fs.createWriteStream(Path.join(destinationFolder,fileName));
                res.pipe(writeStream);
              
                writeStream.on("finish", () => {
                  writeStream.close();
                  resolve(fileName);
                });
                writeStream.on("error", (err) => {
                    writeStream.close();
                    reject(err);
                  });
              });
        });
   }
}

function extractFileNameFromResponse(res) {
    let regexp = /filename=\"(.*)\"/gi;

    return regexp.exec( res.headers['content-disposition'] )[1];
}

function getHttpClientFromUrl(url) {
    if ( url.startsWith("http:") ) return require("http");
    if ( url.startsWith("https:") ) return require("https");

    throw new Error(`Uknown protocol in url ${url}` );
}