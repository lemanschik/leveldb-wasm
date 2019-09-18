.PHONY: all
all: build/index.html

build/libleveldb.a:
	mkdir -p build
	cd build && emconfigure cmake -D WASM=1 ../
	cd build && emmake make -s WASM=1

build/api.js: src/ts/leveldb-functions.ts
	tsc

build/libleveldb.js: build/libleveldb.a build/api.js src/leveldb_worker.js
	emcc $< -o $@ \
	-s EXPORTED_FUNCTIONS=@exported_functions.json \
	-s FORCE_FILESYSTEM=1 \
	--post-js build/api.js \
	--post-js src/leveldb_worker.js

build/leveldb_client.js: src/leveldb_client.js build/libleveldb.js
	cp $< $@

build/index.html: src/index.html build/leveldb_client.js
	cp $< $@

run: build/index.html
	emrun --no_browser $<

clean:
	rm -rf build/
