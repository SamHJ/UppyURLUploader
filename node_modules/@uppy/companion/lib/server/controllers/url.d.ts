declare function _exports(): import("express-serve-static-core").Router;
export = _exports;
export type downloadCallback = (err: Error, chunk: string | Buffer | Buffer[]) => any;
