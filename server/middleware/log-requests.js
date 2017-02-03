
const cluster = require('cluster');

module.exports = function(options) {
    return function* logger(next) {
        const args = [
            new Date().toISOString(),
            this.method.toUpperCase(),
            this.url,
        ];
        
        if(options.clustered) args.push('wid:', cluster.worker.id);
        
        console.log(args.join(' '));
        yield* next;
    }
}
