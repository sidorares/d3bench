var express = require('express');
var socketio = require('socket.io');
var bench = require('./bench');

var app = express.createServer();

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.listen(9000)

var io = socketio.listen(app);

io.sockets.on('connection', function(socket) {
  console.log("connection");

  function progress(result) {
    socket.emit("progress", result);
  }
  
  socket.on('bench', function(options) {
    var e = bench.run(options);

    e.on('progress', function(result) {
      result2 = {
        diff: result.diff
      }
      socket.emit('progress', result2);
    });

    e.on('complete', function() {
      socket.emit('complete');
    });
  });
})
