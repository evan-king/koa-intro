"use strict";

const
    koa = require('koa'),
    logRequests = require('middleware/log-requests');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Log all requests
    app.use(logRequests({clustered: config.processes > 1}));
    
    // Handle requests with 'Hello World' response
    app.use(function*(next) {
        this.body = 'Hello World';
    });
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
};
