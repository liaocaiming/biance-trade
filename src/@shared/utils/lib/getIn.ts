/**
 * 依据给定的路径，安全访问对象中的某个属性值不抛出错误
 * 即使没有也不会报错，直接放回 undefined 或 给定的默认属性
 *
 * @param {*} obj
 * @param {(any[] | string)} [keys]
 * @param {*} [def]
 * @returns 要访问的属性的值
 */
import isArray from './isArray';

function getIn<T>(obj: T): T;
function getIn(obj: any, keys: any[] | string | number): any;
function getIn<T>(obj: any, keys: any[] | string | number, def: T): T | any;
function getIn(obj: any, keys?: any[] | string | number, def?: any): any {
  let ret = typeof obj === 'undefined' ?  def : obj;
  let len;
  let i = 0;

  if (!obj || !keys) {
    return ret;
  }

  if (typeof keys === 'string' || typeof keys === 'number') {
    return typeof obj[keys] !== 'undefined' ? obj[keys] : def;
  } if (isArray(keys)) {
    len = keys.length;

    while (i < len) {
      ret = ret[keys[i]];

      // 不是最后最后一项
      if (i !== len - 1 && !ret) {
        return def;
      }

      i++;
    }
  }

  return typeof ret === 'undefined' ? def : ret;
}

export default getIn;
