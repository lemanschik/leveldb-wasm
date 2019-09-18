function handler(port, data) {
  switch (data.command) {
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

  FS.mkdir('/idb');
  FS.mount(IDBFS, { root: '.' }, '/idb');

  var callbacks = closures;
  closures = null;
  ready = true;
  callbacks.forEach(callback => callback());
}
