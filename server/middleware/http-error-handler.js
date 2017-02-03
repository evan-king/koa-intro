"use strict";

const HttpError = require('standard-http-error');

function omit(obj, keys) {
    const out = Object.assign({}, obj);
    (keys || []).forEach(key => delete out[key]);
    return out;
}

/**
 * handleError
 * End the request with an error response based on thrown exception.
 *
 * @author Evan King
 *
 * @param string ex Thrown error or exception
 * @param int statusCode Http error code, defaults to 500, overrides HttpError code if set
 * @param bool debug Whether to expose internal errors
 */
module.exports = function handleError(ex, statusCode, debug) {
    if(ex instanceof HttpError) {
        statusCode = statusCode || ex.code;
    } else if(ex && ex.stack) {
        // HttpErrors are not system failure, so don't log their stacks
        console.log(ex.stack);
    }
    
    if(!statusCode) {
        // Joi-like exceptions are validation, so default them as bad request
        statusCode = ex.name == 'ValidationError' ? 400 : 500;
    }

    // We really want a concise string representation, but sometimes objects
    // will force us to choose between [Object object] and JSON (valueOf()).
    const message = typeof ex == "string" ? ex : ex.message;

    // Log the error
    console.error(this.method, this.path, JSON.stringify(this.params), "Error:", ex.valueOf());

    // Set the status
    this.status = statusCode || 500;

    // End with an error document as body
    this.response.type = 'json';
    this.body = {
        errorCode: this.status,
        errorMessage: message,
    };

    // Add any constructor-supplied details from HttpError instances
    if(ex instanceof HttpError) {
        const details = omit(ex, ['name', 'message', 'code']);
        if(Object.keys(details).length) this.body.errorDetails = details;
    } else if(this.status == 500) {
        this.body.errorMessage = "Internal server error";
        if(debug) {
            this.body.errorDetails = ex.valueOf();
        }
    }
}

/**
 * middleware
 * Make standard error handling automatic by including this before routing.
 *
 * @author Evan King
 */
module.exports.middleware = function(options) {
    options = options || {}
    return function*(next) {
        try {
            yield* next;
        } catch(ex) {
            module.exports.handleError
                .call(this, ex, null, options.debug);

            if(options.pretty) {
                this.body = JSON.stringify(this.body, null, 2);
            }
        }
    }
}
