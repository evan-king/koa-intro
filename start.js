"use strict";

// Enable requiring modules with local sub-paths as namespaces
require('app-module-path').addPath(__dirname + '/server');

const
    cluster = require('cluster'),
    env = process.env['APP_ENV'] || 'dev',
    config = require(`./config/${env}.js`),
    server = require('./server.js');

console.log('bootstrapping env: ' + env);

// startServer :: config -> koa
const startServer = server.startServer.bind(null, config);

// range :: int -> [int]
const range = length => Array.from(Array(length).keys());

function startMultiCore(count, runner) {
    if(!cluster.isMaster) return runner();
    
    function startCore(id) {
        const w = cluster.fork({processIdentity: id });
        console.log(`starting process ${id}, pid: ${w.process.pid}`);
    }
    
    range(count).forEach(startCore);

    cluster.on('exit', function(worker) {
        console.log(`worker ${worker.process.pid} died`);
        startCore(worker.id);
    });
    
}

config.processes > 1
    ? startMultiCore(config.processes, startServer)
    : startServer();
