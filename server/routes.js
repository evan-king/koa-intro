"use strict";

const
    Router = require('koa-router'),
    HttpError = require('standard-http-error'),
    Controller = require('controllers/hello-controller');

module.exports.middleware = function() {
    
    const routes = new Router();
    
    // Set up a path parameter parser
    routes.param('audience', function*(audience, next) {
        this.audience = audience;
        yield* next;
    });
    
    const audienceFromPost = function*(next) {
        this.audience = this.request.body;
        yield* next;
    }
    
    const validateAudience = function*(next) {
        if(!/^[A-Z]/.test(this.audience)) {
            throw new HttpError(
                400,
                "Audience's name must start with a captial letter",
                {reason: 'grammar'}
            );
        }
        yield* next;
    }
    
    // Start listing routes (first fully matching path determines route)
    routes.get('/', Controller.home);
    routes.get('/hello/fail', Controller.fail);
    routes.get('/hello/:audience', validateAudience, Controller.hello);
    routes.post('/hello', audienceFromPost, validateAudience, Controller.hello);
    
    return routes.middleware();
}
