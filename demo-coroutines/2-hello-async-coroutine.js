"use strict";

const
    co = require('co'),
    noop = () => null,
    done = () => console.log('done');

function wait() {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, Math.random() * 100 + 100);
        //throw new Error('boo');
    });
}

function* hello(audience) {
    yield wait();
    console.log('Hello ' + audience);
}

co(hello, 'World')
    .catch(ex => console.log(ex))
    .then(done);
