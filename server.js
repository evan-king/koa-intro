"use strict";

const koa = require('koa');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Handle requests with 'Hello World' response
    app.use(function*(next) {
        this.body = 'Hello World';
    });
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
};
