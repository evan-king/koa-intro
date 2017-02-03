"use strict";

const 
    co = require('co'),
    wait = require('./random-wait');

const done = () => console.log('done');

let count = 0;
const helloPromise = co.wrap(function*(fail) {
    let idx = ++count;
    yield wait();
    console.log(`Hello (${idx})`);
    if(fail) throw new Error('boo '+idx);
    yield wait();
    console.log(`World (${idx})`);
    return idx;
});

co(function*() {
    const inits = {
        firstTwo: [helloPromise(), helloPromise(true)],
        syncData: 'Hello World',
        another: helloPromise()
    }
    
    console.log('parallel ops started');
    const result = yield inits;
    console.log('parallel ops finished');
    console.log(result);
})
    .catch(ex => console.log(ex))
    .then(done);
