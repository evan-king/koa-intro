"use strict";

module.exports = function wait() {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, Math.random() * 400 + 100);
    });
}

