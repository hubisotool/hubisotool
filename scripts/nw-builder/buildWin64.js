var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: ['./app/**/**','./icons/**/**','./package.json','./node_modules/**/**'],
    platforms: ['win64'],
    version: '0.12.2',
    buildDir:'./build'
});

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
