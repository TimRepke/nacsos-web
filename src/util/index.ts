import type { App } from 'vue';
import { isFunctionInfo, isArtefactOrSerializedArtefact, type2str } from '@/util/typeChecks';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_shallowProperty.js
// Internal helper to generate a function to obtain property `key` from `obj`.
export function shallowProperty<T>(key: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  return type === 'function' || (type === 'object' && !!obj);
};

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/keys.js
// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
export const nativeKeys = Object.keys;
export const keys = (obj: unknown) => {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj as object);
  const objKeys = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj as object) if (has(obj as object, key)) objKeys.push(key);
  return objKeys;
};

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_getLength.js
// Internal helper to obtain the `length` property of an object.
export const getLength = shallowProperty<number>('length');
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isString.js
export const isString = tagTester('String');
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isArguments.js
export const isArguments = tagTester('Arguments');

// inspired by https://github.com/jashkenas/underscore/blob/master/modules/isArray.js
// inspired by https://github.com/jashkenas/underscore/blob/master/modules/_setup.js
// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
export const nativeIsArray = Array.isArray;
export const isArray = (obj: unknown) => nativeIsArray(obj) || tagTester('Array')(obj);

// From https://github.com/jashkenas/underscore/blob/master/modules/isEmpty.js
export const isEmpty = (obj: unknown) => {
  if (obj == null) return true;
  const length = getLength(obj);
  if (typeof length === 'number' && (
    isArray(obj) || isString(obj) || isArguments(obj)
  )) return length === 0;
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

export function isNotNone(obj: unknown): obj is object | boolean | string | number {
  return obj !== undefined && obj !== null;
}

export default {
  install(app: App) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$util = {
      isEmpty,
      range,
      isObject,
      isArray,
      isFunctionInfo,
      isArtefactOrSerializedArtefact,
      type2str,
      isOnRoute,
      isNotNone,
    };
  },
};
