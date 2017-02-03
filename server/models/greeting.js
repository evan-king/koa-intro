"use strict";

module.exports = function(audience) {
    
    const API = {};
    
    API.greet = function() {
        return 'Hello ' + audience;
    }
    
    return API;
    
}
