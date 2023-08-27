/**
 * Query object to http request params string
 *
 * @param  {object} query The query object
 * @return {string}       The http request params string
 */

import { filterXSS } from 'xss';

const originHasOwnProperty = {}.hasOwnProperty;

export default function queryToParamsStr(query: any = null): string {
  const ret: string[] = [];

  if (!query || typeof query !== 'object') {
    return '';
  }

  for (const key in query) {
    if (originHasOwnProperty.call(query, key)) {
      let curVal = (query[key] == null ? '' : query[key]);

      // 防止 xss 攻击
      curVal = filterXSS(curVal);
      ret.push(`${key}=${encodeURIComponent(curVal)}`);
    }
  }

  return ret.join('&');
}
