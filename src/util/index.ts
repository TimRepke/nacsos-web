import type { App } from "vue";
import type { RouteLocationNormalized, RouteRecordNormalized } from "vue-router";
import { marked } from "marked";

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_shallowProperty.js
// Internal helper to generate a function to obtain property `key` from `obj`.
export function shallowProperty<T>(key: string) {
  // @ts-ignore
  return (obj: unknown): T | undefined => (obj == null ? undefined : obj[key]);
}

// inspired by https://github.com/jashkenas/underscore/blob/a15d1afc708ec23894880b2ec4c1eb309447a906/modules/_setup.js
// inspired by https://github.com/jashkenas/underscore/blob/a15d1afc708ec23894880b2ec4c1eb309447a906/modules/_tagTester.js
// Internal function for creating a `toString`-based type tester.
export const tagTester = (name: string) => (obj: unknown) => Object.prototype.toString.call(obj) === `[object ${name}]`;

// Internal function to check whether `key` is an own property name of `obj`.
export const has = (obj: object, key: string) => obj != null && Object.prototype.hasOwnProperty.call(obj, key);

// Is a given variable an object?
export const isObject = (obj: unknown) => {
  if (!obj) return false;
  const type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/keys.js
// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
export const nativeKeys = Object.keys;
export const keys = (obj: unknown) => {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj as object);
  const objKeys = [];
  for (const key in obj as object) if (has(obj as object, key)) objKeys.push(key);
  return objKeys;
};

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_getLength.js
// Internal helper to obtain the `length` property of an object.
export const getLength = shallowProperty<number>("length");
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isString.js
export const isString = tagTester("String");
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isArguments.js
export const isArguments = tagTester("Arguments");

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isArray.js
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_setup.js
// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
export const nativeIsArray = Array.isArray;
export const isArray = (obj: unknown) => nativeIsArray(obj) || tagTester("Array")(obj);

// From https://github.com/jashkenas/underscore/blob/master/modules/isEmpty.js
export const isEmpty = (obj: unknown | null | undefined) => {
  if (obj === null || obj === undefined) return true;
  const length = getLength(obj);
  if (typeof length === "number" && (isArray(obj) || isString(obj) || isArguments(obj))) return length === 0;
  return getLength(keys(obj)) === 0;
};

// get a list/generator of numbers from `start` to `end` (inclusive)
export function* range(start: number, end: number) {
  for (let i = start; i <= end; i += 1) {
    yield i;
  }
}

export function isOnRoute(loc: RouteLocationNormalized, name: string): boolean {
  return loc.matched.findIndex((match: RouteRecordNormalized) => match.name === name) >= 0;
}

export function is<T>(obj: T | null | undefined): obj is T {
  return obj !== null && obj !== undefined;
}

export function isNone(obj: unknown | null | undefined): obj is null | undefined {
  return obj === null || obj === undefined;
}

export function notNone(obj: unknown | null | undefined): obj is unknown {
  return obj !== undefined && obj !== null;
}

export function padZero(num: number, padding: number): string {
  return num.toString(10).padStart(padding, "0");
}

export function dt2str(datetime: string | null | undefined): string | null {
  if (datetime !== null && datetime !== undefined) {
    const dt = new Date(datetime);
    return `
    ${dt.getFullYear()}-${padZero(dt.getMonth() + 1, 2)}-${padZero(dt.getDate(), 2)} 
    ${padZero(dt.getHours(), 2)}:${padZero(dt.getMinutes(), 2)}`;
  }
  return null;
}

export function md2html(s: string): string {
  return marked.parse(s, { async: false }) as string;
}

export type StringValues<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
}[keyof T];

export type NumberValues<T> = {
  [K in keyof T]: T[K] extends number ? T[K] : never;
}[keyof T];

/**
 * Usage : type EnumValues = EnumAsUnion<typeof anEnum>
 */
export type EnumLiteral<T> = `${StringValues<T>}` | NumberValues<T>;

/**
 * Usage: type SearchParams = ArgumentTypes<typeof PipesService.searchTasksApiPipesTasksGet>[0];
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export function useDelay<T extends Array<any>, U>(fn: (...args: T) => U, delay: number) {
  let _delay: number | null = null;

  function clear() {
    if (_delay) clearTimeout(_delay);
    _delay = null;
  }

  function call(...args: T): U {
    clear();
    return fn(...args);
  }

  async function delayedCall(...args: T): Promise<U> {
    clear();
    return new Promise((resolve) => {
      // @ts-ignore
      _delay = setTimeout(() => {
        resolve(call(...args));
      }, delay);
    });
  }

  return { call, delayedCall, clear };
}

export default {
  install(app: App) {
    app.config.globalProperties.$util = {
      isEmpty,
      range,
      isObject,
      isArray,
      notNone,
      isNone,
      is,
      md2html,
      useDelay,
      dt2str,
      isOnRoute,
    };
  },
};
