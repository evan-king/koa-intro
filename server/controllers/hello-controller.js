"use strict";

const Greeting = require('models/greeting');

exports.hello = function*() {
    const greeter = Greeting(this.audience);
    this.body = greeter.greet();
}

exports.home = function*() {
    this.redirect('/hello/World');
}

exports.fail = function*() {
    throw new Error('goodbye');
}
