var worker = null;

function leveldb_init() {
  if (worker != null) {
    return;
  }
  worker = new Worker('libleveldb.js');
  worker.onerror = function(err) { console.log(err); };
  worker.onmessage = function(event) {
    console.log('LevelDB web worker message received', event);
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

// TODO: These functions do not work, since the options object gets flattened to
// a dict. Call the equivalent functions in the worker scope.
function leveldb_options_create() {
  return new Promise(function(resolve, reject) {
    leveldb_call('leveldbOptionsCreate', null, function(response) {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.connection);
      }
    });
  });
}

function leveldb_open(options, name) {
  return new Promise(function(resolve, reject) {
    leveldb_call('leveldbOpen', {options: options, name: name}, function(response) {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.connection);
      }
    });
  });
}
