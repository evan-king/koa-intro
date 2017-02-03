"use strict";

const
    koa = require('koa'),
    logRequests = require('middleware/log-requests');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Log all requests
    app.use(logRequests({clustered: config.processes > 1}));
    if(config.debug) app.use(logRequests.timer);
    
    // Handle requests with 'Hello World' response
    app.use(function*(next) {
        this.body = 'Hello World';
    });
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
    return app;
};
