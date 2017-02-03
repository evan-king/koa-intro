"use strict";

const
    koa = require('koa'),
    ErrorHandler = require('middleware/http-error-handler'),
    logRequests = require('middleware/log-requests');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Log all requests
    app.use(logRequests({clustered: config.processes > 1}));
    if(config.debug) app.use(logRequests.timer);

    // Catch errors and respect response codes from HttpErrors
    app.use(ErrorHandler.middleware({pretty: config.debug}));
    
    // Handle requests with 'Hello World' response
    app.use(function*(next) {
        this.body = 'Hello World';
    });
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
    return app;
};
