.PHONY: all
all: build/index.html

build/libleveldb.a:
	mkdir -p build
	cd build && emconfigure cmake -D WASM=1 -D LEVELDB_BUILD_TESTS=OFF ../
	cd build && emmake make -s WASM=1

build/api.js: src/ts/leveldb-functions.ts
	tsc

build/libleveldb.js: build/libleveldb.a build/api.js src/leveldb_worker.js src/benchmark.js ../emfs/library_chromefs.js ../emfs/library_iofs.js ../emfs/library_nativeiofs.js
	emcc $< -o $@ \
	-s EXPORTED_FUNCTIONS=@exported_functions.json \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'lengthBytesUTF8']" \
	-s FORCE_FILESYSTEM=1 \
	-s DEFAULT_LIBRARY_FUNCS_TO_INCLUDE='["$$CHROMEFS", "$$NATIVEIOFS"]' \
	-lnodefs.js \
	--js-library ../emfs/library_chromefs.js \
	--js-library ../emfs/library_nativeiofs.js \
	--post-js build/api.js \
	--post-js src/leveldb_worker.js \
	--post-js src/benchmark.js

build/leveldb_client.js: src/leveldb_client.js build/libleveldb.js
	cp $< $@

build/index.html: src/index.html build/leveldb_client.js
	cp $< $@

run: build/index.html
	emrun --no_browser $<

clean:
	rm -rf build/
