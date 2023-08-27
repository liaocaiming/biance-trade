import warning from './warning';

import { filterXSS } from 'xss';

import * as query from './query';

import User from './User';

function checkStatus(response: any) {
  if (!response.ok) {
    warning(false, "Response Status not ok: %s", response.statusText);
  }
  return response;
}

/**
 *
 *
 * @param {any} response
 * @returns
 */

export interface IResponse {
  code?: number;
  message?: string;
  data?: any;
  error?: string;
  count?: number;
}

export interface IRequest {
  url: string;
  data?: any;
  option?: any
}

function parseJSON(response: any): IResponse {
  let ret: any = {};

  try {
    ret = response.json();
  } catch (err) {
    warning(false, "JSON parse error: %s", err);
    ret = {
      state: {
        code: 2001,
        msg: err
      }
    };
  }

  ret.__response__ = response;

  return ret;
}
/**
 *
 *
 * @param {any} json
 * @returns
 */
function handleServerError(json: any): IResponse {
  /* eslint-disable no-console */
  // if (!json) {
  //   warning(false, "Not return json = %s", json);
  // } else if (!json.success) {
  //   warning(false, "Return Json is not ok = %s", json);
  // }
  return json;
}

function setHeader(url: string) {
  const res: any = {}
  const filterArr = ['authentication']

  // 非登录页面
  if (filterArr.indexOf(url) < 0) {
    const userInfo: any = User.getUserInfo();

    if (userInfo && userInfo.token) {
      res.Authorization = userInfo.token
      return JSON.stringify(res)
    } else {
      // window.location.hash = '#/'
      return '';
    }
  }

  return '';
}

const localIdToUrlsMap = {};
const localUrlToAbsoluteMap = {};
let globalApiPrefix = ''

function isAbsoluteUrl(url: string) {
  if (typeof url !== 'string') {
    throw new TypeError('Expected a string');
  }

  return /^[a-z][a-z0-9+.-]*:/.test(url);
}

export function config(apiList: any[]) {
  globalApiPrefix = apiList[0].prefix || '/';

  // 依据配置列表来生成新的映射
  apiList.forEach((item: any) => {
    const prefix = item.prefix;
    const apiUrls = item.urls;

    Object.keys(apiUrls).forEach(key => {
      const relativeUrl = apiUrls[key];
      const absoluteUrl = prefix + relativeUrl;

      localIdToUrlsMap[key] = absoluteUrl;
      localUrlToAbsoluteMap[relativeUrl] = absoluteUrl;
    });
  });
}

export function formatUrl(url: string) {

  // 如果是绝对路径不做任何处理
  if (isAbsoluteUrl(url)) {
    return url;
  }

  return localIdToUrlsMap[url] || localUrlToAbsoluteMap[url] || globalApiPrefix + url;
}

const loadedScripts: string[] = [];

const sync = {
  // 默认使用 JSON 格式数据传递
  post(url: string, data: any, option?: any) {
    const baseOption: any = {
      method: "POST"
    };
    const subUrl = formatUrl(url);
    let subData;

    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === "cors") {
      baseOption.mode = "cors";
      subData = query.queryToFormData(data);

      // 同域请求
    } else {
      if (data !== undefined) {
        subData = filterXSS(JSON.stringify(data));
      }
      baseOption.credentials = "include";
      baseOption.headers = {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "If-Modified-Since": "1",
        "Content-Type": "application/json",
        "Common-header": setHeader(url)
      };
    }

    baseOption.body = subData;

    return fetch(subUrl, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  postForm(url: string, form: HTMLFormElement, option?: any) {
    const subUrl = formatUrl(url);
    const baseOption: any = {
      method: "POST",
      headers: {
        "Feng1-Head": setHeader(url)
      }
    };
    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === "cors") {
      baseOption.mode = "cors";

      // 同域请求
    } else {
      baseOption.credentials = "include";
    }

    baseOption.body = form;

    return fetch(subUrl, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  //
  get(url: string, data: any, option?: any) {
    let subUrl = formatUrl(url);
    const baseOption: any = {
      method: "GET"
    };
    let queryStr = "";

    if (typeof data === "object") {
      queryStr = query.queryToParamsStr(data);
    }

    if (queryStr) {
      subUrl += "?" + queryStr;
    }

    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === "cors") {
      baseOption.mode = "cors";

      // 同域请求
    } else {
      baseOption.credentials = "include";
      baseOption.headers = {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        'Access-Control-Allow-Origin': '*',
        "Common-header": setHeader(url)
      };
    }

    return fetch(subUrl, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  loadScript(url: string, option: any) {
    return new Promise(resolve => {
      const myOption = option || {};
      let script: any = document.createElement("script");
      let thisTimeout: any = null;
      const myTimeout = myOption.timeout || 6000;
      const scriptElems = document.getElementsByTagName("script");
      const len = scriptElems.length;
      let i;

      // 判断是否已加载了相同的 域名和端口的文件
      for (i = 0; i < len; i++) {
        if (url.split("?")[0] === scriptElems[i].src.split("?")[0]) {
          // resolve('has same');
          return null;
        }
      }

      // 防止重复加载同一URL
      if (loadedScripts.indexOf(url) !== -1) {
        // resolve('has same');
        return null;
      }

      script.type = "text/javascript";
      script.async = !!myOption.isAsync;

      // IE
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            resolve({});
            loadedScripts.push(url);
            clearTimeout(thisTimeout);
          }
        };

        // Others: Firefox, Safari, Chrome, and Opera
      } else {
        script.onload = () => {
          resolve({});
          loadedScripts.push(url);
          clearTimeout(thisTimeout);
        };
      }

      thisTimeout = setTimeout(() => {
        const urlIndex = loadedScripts.indexOf(url);

        resolve("load script " + url + " error!");
        document.body.removeChild(script);

        if (urlIndex !== -1) {
          loadedScripts.splice(urlIndex, 1);
        }
        script = null;
      }, myTimeout);

      if (typeof script.onerror === "function") {
        script.onerror = (error: any) => {
          resolve(error);
        };
      }

      script.src = url;
      document.body.appendChild(script);

      return script;
    });
  }
};

export default sync;
