var worker = null;

function db_bench_init() {
  if (worker != null) {
    return;
  }
  worker = new Worker('db_bench.js');
  worker.onerror = function(err) { console.log(err); };
  worker.onmessage = function(event) {
    console.log('db_bench web worker message received', event);
  };
}

function leveldb_call(command, request, callback) {
  var channel = new MessageChannel();
  channel.port1.onmessage = function(event) {
    callback(event.data);
  };
  if (worker.postMessage !== undefined) {
    // WebWorker
    worker.postMessage({command: command, request: request}, [channel.port2]);
  } else if (worker.port.postMessage !== undefined) {
    // SharedWorker
    worker.port.postMessage({command: command, request: request}, [channel.port2]);
  } else {
    throw new Error('Failed to call postMessage');
  }
}
