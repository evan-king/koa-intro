"use strict";

// Enable requiring modules with local sub-paths as namespaces
require('app-module-path').addPath(__dirname + '/../server');
require('app-module-path').addPath(__dirname + '/../test');

const
    co = require('co'),
    fs = require('fs'),
    config = require('../config/unit-test'),
    Mocha = require('mocha');

let httpClient, mongoClient;

// Get a test http client pointing to and backed by a JIT test server
module.exports.getHttpTestClient = function() {
    
    // Start test server and client
    if(!httpClient) {
        require('../server').startServer(config);
        
        httpClient = require('co-supertest')
            .agent('http://localhost:'+config.port);
    }
    
    return httpClient;
};

module.exports.getMongoClient = function() {
    if(!mongoClient) {
        const mongo = require('koa-mongo');
        mongoClient = mongo({
            uri: config.mongoUri,
            max: 100,
            min: 1,
            timeout: 5000,
            log: false
        });
    }
    return mongoClient;
};

// Test suite enumerator
const findTestSuites = function*(path, include, exclude) {
    const files = yield fs.readdir.bind(this, path);
    
    let suites = [];

    for(let idx in files) {
        const
            file = files[idx],
            filePath = path + '/' + file,
            stats = yield fs.lstat.bind(null, filePath);
        
        // Always skip dotfiles/dot-directories
        if(filePath.match(/\/\./)) continue;
        
        // Skip paths matching exclusion regex
        // Note: done before directory traversal for efficiency, but
        //       because of this expressions matching '$' won't work
        if(exclude && filePath.match(exclude)) continue;
        
        // Recurse into directories
        if(stats.isDirectory()) {
            suites = suites.concat(yield* findTestSuites(filePath, include, exclude));
            continue;
        }
        
        // Skip paths failing to match inclusion regex
        if(include && !filePath.match(include)) continue;
        
        suites.push(filePath);
    }
    
    return suites;
}

// Main test method
co(function*() {
    
    // All .test.js files in ./test
    const testSuites = yield* findTestSuites('.', /\.test\.js$/);
    
    // Run unit tests
    const mocha = new Mocha();
    testSuites.forEach(file => mocha.addFile(file));
    
    const runner = mocha.run(function(err) {
        process.on('exit', function() {
            process.exit(err);
        });
    });
    
    runner.on('end', process.exit);
    
}).catch(ex => console.log(ex.stack));
