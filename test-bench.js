var bench = require('./bench');

var r = bench.run({
  url: "http://localhost:8000/buffer/12345",
  concurrency: 10,
  requests: 50000
});


var sum = 0;
var total = 0;
r.on('progress', function(result) {
  sum += result.diff;
  total++;

  if (total % 1000 == 0) {
    process.stdout.write('.');
  }
});

r.on('complete', function() {
  console.error('done');
  console.log("average response time: ", sum / total);
});
