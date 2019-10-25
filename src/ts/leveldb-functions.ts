namespace Module {
    export type u8 = number & { __type__: "u8", __size__: 1 }
    export type i8 = number & { __type__: "i8", __size__: 4 }
    export type i32 = number & { __type__: "i32", __size__: 4 }
    export type i64 = number & { __type__: "i64", __size__: 8 }
    export type double = number & { __type__: "double", __size__: 8 }

    export type arr<T extends sized> = { __type__: "arr", __deref__: Array<T> }
    export type fn<F extends Function> = { __type__: "fn", __deref__: F }
    export type ptr<T extends { __type__: any }> = number & { __type__: "ptr", __deref__: T, __size__: 4 }
    export type sized = { __type__: unknown, __size__: number }
    export type stack = number & { __type__: "stack" }
    export type str = { __type__: "str" }

    /* FFI */

    export declare function getValue<T extends ptr<any>>(ptr: ptr<T>, type: "*", noSafe?: boolean): T;
    export declare function getValue(ptr: ptr<i32>, type: "i32", noSafe?: boolean): i32;
    export declare function getValue(ptr: ptr<double>, type: "double", noSafe?: boolean): number;

    export declare function setValue<T extends ptr<any>>(ptr: ptr<T>, value: T, type: "*"): T;
    export declare function setValue(ptr: ptr<i32>, value: i32, type: "i32"): i32;

    export declare function UTF8ToString(ptr: ptr<str>): string
    export declare function stringToUTF8(str: string, outPtr: ptr<str>, maxBytesToWrite: number): void
    export declare function lengthBytesUTF8(str: string): number

    export declare function stackSave(): stack
    export declare function stackRestore(stack: stack): void
    export declare function stackAlloc<T extends sized>(size: number & T["__size__"]): ptr<T>

    export declare function ccall<
        ReturnType extends Exclude<NativeJsTypeSignature, "array">,
        ArgTypes extends Array<NativeJsTypeSignature>>(
            ident: string,
            returnType: ReturnType,
            argTypes: ArgTypes,
            args: { [i in keyof ArgTypes]: NativeJsTypeOf<ArgTypes[i]> }): NativeJsTypeOf<ReturnType>

    type NativeJsTypeSignature =
        | "undefined"
        | "boolean"
        | "string"
        | "number"
        | "array"

    type NativeJsTypeOf<S> =
        S extends NativeJsTypeSignature ? {
            "undefined": undefined
            "boolean": boolean
            "string": string
            "number": number
            "array": Int8Array | i8[]
        }[S]
        : never

    /* Types */

    export interface leveldb_t { __type__: "leveldb_t" }
    export interface leveldb_cache_t { __type__: "leveldb_cache_t" }
    export interface leveldb_comparator_t { __type__: "leveldb_comparator_t" }
    export interface leveldb_env_t { __type__: "leveldb_env_t" }
    export interface leveldb_filelock_t { __type__: "leveldb_filelock_t" }
    export interface leveldb_filterpolicy_t { __type__: "leveldb_filterpolicy_t" }
    export interface leveldb_iterator_t { __type__: "leveldb_iterator_t" }
    export interface leveldb_logger_t { __type__: "leveldb_logger_t" }
    export interface leveldb_options_t { __type__: "leveldb_options_t" }
    export interface leveldb_randomfile_t { __type__: "leveldb_randomfile_t" }
    export interface leveldb_readoptions_t { __type__: "leveldb_readoptions_t" }
    export interface leveldb_seqfile_t { __type__: "leveldb_seqfile_t" }
    export interface leveldb_snapshot_t { __type__: "leveldb_snapshot_t" }
    export interface leveldb_writablefile_t { __type__: "leveldb_writablefile_t" }
    export interface leveldb_writebatch_t { __type__: "leveldb_writebatch_t" }
    export interface leveldb_writeoptions_t { __type__: "leveldb_writeoptions_t" }

    /* Functions */

    /* DB operations */

    export declare function _leveldb_open(
        options: ptr<leveldb_options_t>,
        name: ptr<str>,
        errptr: ptr<ptr<str>>) : ptr<leveldb_t>
    export declare function _leveldb_close(
        db: ptr<leveldb_t>) : void
    export declare function _leveldb_put(
        db: ptr<leveldb_t>, options: ptr<leveldb_writeoptions_t>,
        key: ptr<str>, keylen: i32,
        val: ptr<str>, vallen: i32,
        errptr: ptr<ptr<str>>) : void
    export declare function _leveldb_delete(
        db: ptr<leveldb_t>, options: ptr<leveldb_writeoptions_t>,
        key: ptr<str>, keylen: i32,
        errptr: ptr<ptr<str>>) : void
    export declare function _leveldb_write(
        db: ptr<leveldb_t>, options: ptr<leveldb_writeoptions_t>,
        key: ptr<str>, keylen: i32,
        batch: ptr<leveldb_writebatch_t>,
        errptr: ptr<ptr<str>>) : void
    export declare function _leveldb_get(
        db: ptr<leveldb_t>,
        options: ptr<leveldb_readoptions_t>,
        key: ptr<str>, keylen: i32,
        vallen: ptr<i32>,
        errptr: ptr<ptr<str>>) : ptr<str>
    export declare function _leveldb_create_iterator(
        db: ptr<leveldb_t>,
        options: ptr<leveldb_readoptions_t>) : ptr<leveldb_iterator_t>
    export declare function _leveldb_create_snapshot(
        db: ptr<leveldb_t>) : ptr<leveldb_snapshot_t>
    export declare function _leveldb_create_snapshot(
        db: ptr<leveldb_t>,
        snapshot: ptr<leveldb_snapshot_t>) : void
    export declare function _leveldb_property_value(
        db: ptr<leveldb_t>,
        propname: ptr<str>) : ptr<str>
    export declare function _leveldb_approximate_sizes(
        db: ptr<leveldb_t>,
        num_ranges: i32,
        range_start_key: ptr<str>,
        range_start_key_len: ptr<i32>,
        range_limit_key: ptr<str>,
        range_limit_key_len: ptr<i32>,
        sizes: ptr<arr<i64>>) : void
    export declare function _leveldb_compact_range(
        db: ptr<leveldb_t>,
        start_key: ptr<str>,
        start_key_len: i32,
        limit_key: ptr<str>,
        limit_key_len: ptr<i32>) : ptr<str>

    /* Management operations */

    export declare function _leveldb_destroy_db(
        options: ptr<leveldb_options_t>,
        name: ptr<str>,
        errptr: ptr<ptr<str>>) : void
    export declare function _leveldb_repair_db(
        options: ptr<leveldb_options_t>,
        name: ptr<str>,
        errptr: ptr<ptr<str>>) : void

    /* Iterator */

    export declare function _leveldb_iter_destroy(
        iterator: ptr<leveldb_iterator_t>) : void
    export declare function _leveldb_iter_valid(
        iterator: ptr<leveldb_iterator_t>) : u8
    export declare function _leveldb_iter_seek_to_first(
        iterator: ptr<leveldb_iterator_t>) : void
    export declare function _leveldb_iter_seek_to_last(
        iterator: ptr<leveldb_iterator_t>) : void
    export declare function _leveldb_iter_seek(
        iterator: ptr<leveldb_iterator_t>,
        key: ptr<str>,
        keylen: i32) : void
    export declare function _leveldb_iter_next(
        iterator: ptr<leveldb_iterator_t>) : void
    export declare function _leveldb_iter_prev(
        iterator: ptr<leveldb_iterator_t>) : void
    export declare function _leveldb_iter_seek_key(
        iterator: ptr<leveldb_iterator_t>, keylen: ptr<i32>) : ptr<str>
    export declare function _leveldb_iter_seek_value(
        iterator: ptr<leveldb_iterator_t>, vallen: ptr<i32>) : ptr<str>
    export declare function _leveldb_iter_get_error(
        iterator: ptr<leveldb_iterator_t>, errptr: ptr<ptr<str>>) : void

    /* Write batch */

    export declare function _leveldb_writebatch_create() : ptr<leveldb_writebatch_t>
    export declare function _leveldb_writebatch_destroy(
        batch: ptr<leveldb_writebatch_t>) : void
    export declare function _leveldb_writebatch_clear(
        batch: ptr<leveldb_writebatch_t>) : void
    export declare function _leveldb_writebatch_put(
        batch: ptr<leveldb_writebatch_t>,
        key: ptr<str>, klen: i32,
        val: ptr<str>, vlen: i32) : void
    export declare function _leveldb_writebatch_delete(
        batch: ptr<leveldb_writebatch_t>,
        key: ptr<str>, klen: i32) : void
    export declare function _leveldb_writebatch_iterate(
        batch: ptr<leveldb_writebatch_t>,
        state: ptr<any>,
        put: fn<(state: ptr<any>, k: ptr<str>, klen: i32, v: ptr<str>, vlen: i32) => void>,
        deleted: fn<(state: ptr<any>, k: ptr<str>, klen: i32) => void>) : void
    export declare function _leveldb_writebatch_append(
        destination: ptr<leveldb_writebatch_t>,
        source: ptr<leveldb_writebatch_t>) : void

    /* Options */

    export declare function _leveldb_options_create() : ptr<leveldb_options_t>
    export declare function _leveldb_options_destroy(
        options: ptr<leveldb_options_t>) : void
    export declare function _leveldb_options_set_comparator(
        options: ptr<leveldb_options_t>,
        comparator: ptr<leveldb_comparator_t>) : void
    export declare function _leveldb_options_set_filter_policy(
        options: ptr<leveldb_options_t>,
        filterpolicy: ptr<leveldb_filterpolicy_t>) : void
    export declare function _leveldb_options_set_create_if_missing(
        options: ptr<leveldb_options_t>,
        create_if_missing: u8) : void
    export declare function _leveldb_options_set_error_if_exists(
        options: ptr<leveldb_options_t>,
        error_if_exists: u8) : void
    export declare function _leveldb_options_set_paranoid_checks(
        options: ptr<leveldb_options_t>,
        paranoid_checks: u8) : void
    export declare function _leveldb_options_set_env(
        options: ptr<leveldb_options_t>,
        env: ptr<leveldb_env_t>) : void
    export declare function _leveldb_options_set_info_log(
        options: ptr<leveldb_options_t>,
        logger: ptr<leveldb_logger_t>) : void
    export declare function _leveldb_options_set_write_buffer_size(
        options: ptr<leveldb_options_t>,
        write_buffer_size: i32) : void
    export declare function _leveldb_options_set_max_open_files(
        options: ptr<leveldb_options_t>,
        max_open_files: i32) : void
    export declare function _leveldb_options_set_cache(
        options: ptr<leveldb_options_t>,
        cache: ptr<leveldb_cache_t>) : void
    export declare function _leveldb_options_set_block_size(
        options: ptr<leveldb_options_t>,
        block_size: i32) : void
    export declare function _leveldb_options_set_block_restart_interval(
        options: ptr<leveldb_options_t>,
        interval: i32) : void
    export declare function _leveldb_options_set_max_file_size(
        options: ptr<leveldb_options_t>,
        max_file_size: i32) : void

    export enum leveldb_compression_t {
        LEVELDB_NO_COMPRESSION = 0,
        LEVELDB_SNAPPY_COMPRESSION = 1,
    }
    export declare function _leveldb_options_set_compression(
        options: ptr<leveldb_options_t>,
        compression: i32) : void

    /* Comparator */

    // export declare function _leveldb_comparator_create(
    //     state: ptr<any>, void (*destructor)(void*),
    //     int (*compare)(void*, const char* a, size_t alen, const char* b, blen: i32),
    //  const char* (*name)(void*)) : ptr<leveldb_comparator_t>;
    export declare function _leveldb_comparator_destroy(comparator: ptr<leveldb_comparator_t>) : void


    /* Filter policy */

    // export declare function leveldb_filterpolicy_create(
    //     void* state, void (*destructor)(void*),
    //     char* (*create_filter)(void*, const char* const* key_array,
    //                            const size_t* key_length_array, int num_keys,
    //                            size_t* filter_length),
    //     uint8_t (*key_may_match)(void*, const char* key, size_t length,
    //                              const char* filter, size_t filter_length),
    //     const char* (*name)(void*)) : ptr<leveldb_filterpolicy_t>
    export declare function _leveldb_filterpolicy_destroy(
        filterpolicy: ptr<leveldb_filterpolicy_t>) : void
    export declare function _leveldb_filterpolicy_create_bloom(
        bits_per_key: i32) : ptr<leveldb_filterpolicy_t>

    /* Read options */

    export declare function _leveldb_readoptions_create() : ptr<leveldb_readoptions_t>
    export declare function _leveldb_readoptions_destroy(
        options: ptr<leveldb_readoptions_t>) : void
    export declare function _leveldb_readoptions_set_verify_checksums(
        options: ptr<leveldb_readoptions_t>, verify_checksum: u8) : void
    export declare function _leveldb_readoptions_set_fill_cache(
        options: ptr<leveldb_readoptions_t>,
        fill_cache: u8) : void
    export declare function _leveldb_readoptions_set_snapshot(
        options: ptr<leveldb_readoptions_t>,
        snapshot: ptr<leveldb_snapshot_t>) : void

    /* Write options */

    export declare function _leveldb_writeoptions_create() : ptr<leveldb_writeoptions_t>
    export declare function _leveldb_writeoptions_destroy(
        options: ptr<leveldb_writeoptions_t>) : void
    export declare function _leveldb_writeoptions_set_sync(
        options: ptr<leveldb_writeoptions_t>, sync: u8) : void

    /* Cache */

    export declare function _leveldb_cache_create_lru(capacity: i32) : ptr<leveldb_cache_t>
    export declare function _leveldb_cache_destroy(cache: ptr<leveldb_cache_t>) : void

    /* Env */

    export declare function _leveldb_create_default_env() : ptr<leveldb_env_t>
    export declare function _leveldb_env_destroy(env: ptr<leveldb_env_t>) : void

    /* If not NULL, the returned buffer must be released using leveldb_free(). */
    export declare function _leveldb_env_get_test_directory(env: ptr<leveldb_env_t>) : ptr<str>

    /* Utility */

    /* Calls free(ptr).
       REQUIRES: ptr was malloc()-ed and returned by one of the routines
       in this file.  Note that in certain cases (typically on Windows), you
       may need to call this routine instead of free(ptr) to dispose of
       malloc()-ed memory returned by this library. */
    export declare function _leveldb_free(ptr: ptr<any>) : void

    /* Return the major version number for this release. */
    export declare function _leveldb_major_version() : i32

    /* Return the minor version number for this release. */
    export declare function _leveldb_minor_version() : i32

    /* JavaScript shim */

    export class LevelDB {
        constructor(public readonly db: ptr<leveldb_t>) {}

        put(options: LevelDBWriteOptions, key: string, value: string) {
            leveldb_put(this, options, key, value)
        }
        get(options: LevelDBReadOptions, key: string) {
            return leveldb_get(this, options, key)
       }
    }

    export class LevelDBOptions {
        private _createIfMissing: boolean

        //TODO: destroy pointer
        constructor(public readonly options: ptr<leveldb_options_t>) {this._createIfMissing = false}

        set createIfMissing(value: boolean) {
          const stack = stackSave();
          Module.ccall('leveldb_options_set_create_if_missing', 'undefined', ['number', 'boolean'], [this.options, value]);
          stackRestore(stack);
          this._createIfMissing = value
        }

        get createIfMissing() {
          return this._createIfMissing
        }
    }

    export class LevelDBWriteOptions {
        private _sync: boolean;

        //TODO: destroy pointer
        constructor(public readonly options: ptr<leveldb_writeoptions_t>) {this._sync = false;}

        set sync(value: boolean) {
          const stack = stackSave();
          Module.ccall('leveldb_writeoptions_set_sync', 'undefined', ['number', 'boolean'], [this.options, value]);
          stackRestore(stack);
          this._sync = value;
        }

        get sync() {
          return this._sync;
        }

    }

    export class LevelDBReadOptions {
        constructor(public readonly options: ptr<leveldb_readoptions_t>) {}
    }

    export const leveldb_options_create : () => Promise<LevelDBOptions>
        = () => {
            return new Promise((resolve, reject) => {
                const stack = stackSave()
                let optPtr = Module.ccall('leveldb_options_create', 'number', [], []);
                stackRestore(stack)
                resolve(new LevelDBOptions(optPtr as ptr<leveldb_options_t>));
            });
        }

    export const leveldb_open : (options: LevelDBOptions, name: string) => Promise<LevelDB>
        = (options, name) => {
            return new Promise((resolve, reject) => {
                const stack = stackSave();

                // char** errptr = NULL;
                let ppErrptr = stackAlloc<ptr<str>>(4);
                setValue(ppErrptr, (0 as ptr<str>), "*");
                let dbPtr = Module.ccall('leveldb_open', 'number', ['number', 'string', 'number'], [options.options, name, ppErrptr]);
                const pErrmsg = getValue<ptr<str>>(ppErrptr, "*")
                stackRestore(stack);

                const errmsg = pErrmsg === 0 ? null : UTF8ToString(pErrmsg)
                leveldb_free(pErrmsg);
                if(errmsg !== null) {
                  reject(errmsg);
                }
                resolve(new LevelDB(dbPtr as ptr<leveldb_t>));
            });
        }

    export const leveldb_close : (db: LevelDB) => Promise<void>
        = (db) => {
            return new Promise((resolve, reject) => {
                const stack = stackSave();
                Module.ccall('leveldb_close', 'undefined', ['number'], [db.db]);
                stackRestore(stack);
                resolve();
            });
        }

    export const leveldb_writeoptions_create : () => Promise<LevelDBWriteOptions>
        = () => {
            return new Promise((resolve, reject) => {
                const stack = stackSave()
                let optPtr = Module.ccall('leveldb_writeoptions_create', 'number', [], []);
                stackRestore(stack)
                resolve(new LevelDBWriteOptions(optPtr as ptr<leveldb_writeoptions_t>));
            });
        }

    export const leveldb_put : (db: LevelDB, options: LevelDBWriteOptions, key: string, value: string) => Promise<void>
        = (db, options, key, value) => {
            return new Promise((resolve, reject) => {
                const stack = stackSave();

                const keyLen = lengthBytesUTF8(key)+1
                const valLen = lengthBytesUTF8(value)+1

                // char** errptr = NULL;
                let ppErrptr = stackAlloc<ptr<str>>(4);
                setValue(ppErrptr, (0 as ptr<str>), "*");
                Module.ccall('leveldb_put', 'undefined', ['number', 'number', 'string', 'number', 'string', 'number', 'number'], [db.db, options.options, key, keyLen, value, valLen, ppErrptr]);
                const pErrmsg = getValue<ptr<str>>(ppErrptr, "*")
                stackRestore(stack);

                const errmsg = pErrmsg === 0 ? null : UTF8ToString(pErrmsg)
                leveldb_free(pErrmsg);
                if(errmsg !== null) {
                  reject(errmsg);
                }
                resolve();
            });
        }

    export const leveldb_readoptions_create : () => Promise<LevelDBReadOptions>
        = () => {
            return new Promise((resolve, reject) => {
                const stack = stackSave()
                let optPtr = Module.ccall('leveldb_readoptions_create', 'number', [], []);
                stackRestore(stack)
                resolve(new LevelDBReadOptions(optPtr as ptr<leveldb_readoptions_t>));
            });
        }

    export const leveldb_get : (db: LevelDB, options: LevelDBReadOptions, key: string) => Promise<string>
        = (db, options, key) => {
            return new Promise((resolve, reject) => {
                const stack = stackSave();

                //TODO: does it make sense to use *utf8* length?
                const keyLen = lengthBytesUTF8(key)+1

                // char** errptr = NULL;
                let ppErrptr = stackAlloc<ptr<str>>(4);
                setValue(ppErrptr, (0 as ptr<str>), "*");

                // NOTE: This pointer is required by the call but it is not used
                // size_t* vallen = 0;
                let valLenPtr = stackAlloc<i32>(4);
                setValue(valLenPtr, (0 as i32), "i32");

                let value = Module.ccall('leveldb_get', 'string', ['number', 'number', 'string', 'number', 'number', 'number'], [db.db, options.options, key, keyLen, valLenPtr, ppErrptr]);

                //TODO: free the pointer
                const pErrmsg = getValue<ptr<str>>(ppErrptr, "*")
                stackRestore(stack);

                const errmsg = pErrmsg === 0 ? null : UTF8ToString(pErrmsg)
                leveldb_free(pErrmsg);
                if(errmsg !== null) {
                  reject(errmsg);
                }

                resolve(value);
            });
        }


    export const leveldb_free : (db: ptr<any>) => void
        = (db) => {
            _leveldb_free(db);
        }
}
