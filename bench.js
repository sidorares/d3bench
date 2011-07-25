var http = require('http');
var url = require('url');
var EventEmitter = require('events').EventEmitter;

exports.run = function(options) {
  var c = options.concurrency || 10;
  var requests = options.requests || 5000;
  var l = url.parse(options.url);

  var started = 0;
  var completed = 0;
  var agents = [];

  var e = new EventEmitter();

  function dispatch(agent) {
    var result = { start: new Date() };
    var reqOptions = {
      method: 'GET',
      path: l.pathname || '/',
      agent: agent
    };

    // If we've made our number of requests, bail out.
    if (started >= requests) {
      return;
    }

    started++;
    
    var req = http.request(reqOptions, function(res) {
      //process.stdout.write('.');
      result.statusCode = res.statusCode;
      addResult(result, agent);
    });

    req.on('error', function(error) {
      result.statusCode = -1;
      addResult(result, agent);
    });

    req.end();
  }

  function addResult(result, agent) {
    result.diff = new Date() - result.start;
    e.emit('progress', result);
    completed++;

    if (completed == requests) {
      e.emit('complete');
    } else {
      dispatch(agent);
    }
  }

  for (var i = 0; i < c; i++) {
    var agent = new http.Agent({
      host: l.hostname || '127.0.0.1',
      port: l.port || 80
    });
    agent.maxSockets = 1;
    dispatch(agent)
    agents.push(agent);
  }


  return e;
}


