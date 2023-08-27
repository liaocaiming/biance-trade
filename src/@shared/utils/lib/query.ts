/**
 * get query object on search string
 * @param  {string} search search string
 * @return {object}        query object value is decode
 */

export { queryToParamsStr } from '@utils/index';

export function getQuery(search: string): object {
  const ret = {}
  let keyVal
  let len
  let strs
  let key
  let evalStr
  let i

  if (typeof search !== 'string') {
    throw new TypeError('getQuery cannot be called with string');
  }

  if (search.indexOf('?') >= 0) {
    search = search.split('?')[1] || ''
  }

  if (search.indexOf('=') !== -1) {
    strs = search.split('&');
    len = strs.length;

    for (i = 0; i < len; i++) {
      keyVal = strs[i].split('=');
      key = keyVal[0];
      evalStr = (window as any).decodeURIComponent(keyVal[1] || '');

      // handle val is number
      // TODO: handle val is JOSN string
      if (/^[\d.]+$/.test(evalStr)) {
        evalStr = parseInt(evalStr, 10);
      }
      ret[key] = evalStr;
    }
  }

  return ret;
}

export function getUrlQuery() {
  let ret: any = {};

  ret = getQuery(window.location.href);

  return ret;
}

/**
 * Query object to http request params string
 * @param  {object} query The query object
 * @return {FormData | string}       The http request params string
 */
export function queryToFormData(query: object): FormData | string {
  const ret = new FormData();

  if (typeof query !== 'object') {
    return '';
  }

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      ret.append(key, query[key]);
    }
  }

  return ret;
}

/**
 * [queryToJSON description]
 * @param  {[object]} query [description]
 * @return {string}       [description]
 */
export function queryToJSON(query: object): string {
  let ret = '';
  const encodeObj = {};

  if (typeof query !== 'object') {
    return ret;
  }

  for (const key in query) {
    if (query.hasOwnProperty(key)) {

      // not number
      if (/^[\d.]+$/.test(query[key])) {
        encodeObj[key] = query[key];
      } else {
        encodeObj[key] = encodeURIComponent(query[key]);
      }

    }
  }

  if (JSON.stringify) {
    ret = JSON.stringify(encodeObj);
  }

  return ret;
}

