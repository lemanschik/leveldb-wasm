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
