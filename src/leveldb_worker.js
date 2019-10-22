// Switch to false if your browser doesn't support IOFS
var enableIOFS = true;

function handler(port, data) {
  switch (data.command) {
    case 'leveldbOptionsCreate':
      leveldbOptionsCreate()
        .then(connection => port.postMessage({connection: connection}))
        .catch(err => port.postMessage({error: err}));
      break;
    case 'leveldbOpen':
      leveldbOpen(data.request.options, data.request.name)
        .then(connection => port.postMessage({connection: connection}))
        .catch(err => port.postMessage({error: err}));
      break;
    case 'fsUnlink':
      try {
        FS.unlink(data.request.file);
        port.postMessage({});
      } catch (e) {
        port.postMessage({error: {
          errno: e.errno,
          code: e.code,
          message: e.message,
        }});
      }
      break;
    case 'profile':
      console.log('Profile', CHROMEFS.profileData);
      if(enableIOFS) {
        console.log('Profile', IOFS.profileData);
      }
      break;
    default:
      port.postMessage({error: 'Unknown command ', data});
      break;
  }
}

function handlerInitialized(port, data) {
  if (ready) {
    handler(port, data);
  } else {
    closures.push(function() { handler(port, data); });
  }
}

function leveldbOptionsCreate() {
  var result = Module.leveldb_options_create();
  return Promise.resolve(result);
}

function leveldbWriteOptionsCreate() {
  var result = Module.leveldb_writeoptions_create();
  return Promise.resolve(result);
}

function leveldbOpen(options, name) {
  var result = Module.leveldb_open(options, name);
  return Promise.resolve(result);
}

// Channel for Web worker.
onmessage = function(event) {
  handlerInitialized(event.ports[0], event.data);
};

// Channel for Shared worker.
onconnect = function(e) {
  e.ports.forEach(function(port) {
    port.onmessage = function(event) {
      handlerInitialized(event.ports[0], event.data);
    };
  });
}

var ready = false;
var closures = [];

Module.onRuntimeInitialized = function() {
  console.log('LevelDB worker on runtime initialized');
  FS.mkdir('/chrome');
  FS.mount(CHROMEFS, { root: '.' }, '/chrome');

  if(enableIOFS) {
    FS.mkdir('/io');
    FS.mount(IOFS, { root: '.' }, '/io');
  }

  var callbacks = closures;
  closures = null;
  ready = true;
  callbacks.forEach(callback => callback());
}
