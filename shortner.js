const md5 = require('md5');
let url = "www.google.com"
let hash = Buffer.from(md5(url)).toString('base64') ;
let shortenedUrl = hash.slice(0,3) + hash.slice(41);
console.log(shortenedUrl)

