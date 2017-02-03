"use strict";

const
    koa = require('koa'),
    base = require('middleware/base-stack'),
    routes = require('routes');

module.exports.startServer = function(config) {
    
    const app = koa();
    
    // Use a standardized partial application stack from elsewhere
    app.use(base({
        clustered: config.processes > 1,
        pretty: config.debug,
        debug: config.debug
    }));

    // Split into route-specific functionality
    app.use(routes.middleware());
    
    // Begin
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port);
    
    return app;
};
