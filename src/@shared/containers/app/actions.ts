// import { helpers, User } from '@utils/index';
import request from '@shared/utils/lib/request';
import { message } from 'antd';
import ACTION_TYPES from './actionTypes';

const ERROR_MSG_MAP = {};

/**
 * 保存Ajax请求开始
 * @export
 * @returns Action 对象
 */
function requestSave() {
  return {
    type: ACTION_TYPES.REQUEST_SAVE
  };
}

export function receiveSave(payload?: any) {
  return {
    payload,
    type: ACTION_TYPES.RECEIVE_SAVE
  };
}

function receiveAjaxError(payload: any) {
  return {
    payload,
    type: ACTION_TYPES.RECEIVE_AJAX_ERROR
  };
}
function receiveServerError(payload: any) {
  let errorMsg = payload.msg;

  // 显示服务器错误
  if (payload.code >= '6000') {
    if (ERROR_MSG_MAP[payload.code]) {
      errorMsg = ERROR_MSG_MAP[payload.code];
    }
  } else if (payload.code === '4000') {
  } else if (payload.code === '10003' || payload.code === '10005') {
  }

  const url: string = payload.url;

  if (errorMsg) {
    message.error(`${errorMsg}`);
  } else {
    // message.error('网络错误');
  }


  return {
    payload: Object.assign({}, payload, {
      errorAt: Date.now(),
      errorMsg
    }),
    type: ACTION_TYPES.RECEIVE_SERVER_ERROR
  };
}

/**
 * 全局Ajax get action
 */
function rqFetch() {
  return {
    type: ACTION_TYPES.RQ_FETCH
  };
}
function rcFetch() {
  return {
    type: ACTION_TYPES.RC_FETCH
  };
}

function ajaxErrorCallback(dispatch: any, type: string, url: string) {
  return (error: any) => {
    dispatch(
      receiveAjaxError({
        error,
        type,
        url
      })
    );

    return { error: 'request error', url, type };
  };
}

export function get(url: string, query?: any, option?: any) {
  return async (dispatch: any) => {
    const showLoading = option && option.showLoading === false;
    if (!showLoading) {
      dispatch(rqFetch());
    }

    let json: any;

    try {
      json = await request.get(url, query, option);
      dispatch(rcFetch());

      if (Array.isArray(json)) {
        return json
      }

      if (json === undefined) {
        return {};
      }
      const { code } = json;

      if (code !== 200 && code !== 304) {
        throw new Error(json)
      }

      return json || {};
    } catch (err) {
      message.error('网络错误');
      return Promise.reject(json);
    }
  };
}

/**
 * 全局Ajax post action
 * @export
 * @param {String} url
 * @param {Object} query
 * @returns Fetch Promise 对象
 */
export function post(url: string, query: any, option?: any) {
  return (dispatch: any) => {

    dispatch(requestSave());

    return request
      .post(url, query, option)
      .then((json: any) => {
        // window.clearTimeout(timerOut)
        dispatch(receiveSave());

        if (Array.isArray(json)) {
          return json
        }

        if (json === undefined) {
          return {};
        }

        const { code } = json;
        if (code !== 200 && code !== 304) {
          json.url = url;
          return Promise.reject(json);
        }
        return json || {};
      })
      .catch((err) => {
        message.error(err.message || '网络错误')
        return Promise.reject(err);
      });
  };
}

/**
 * 全局Ajax post 带文件的表单
 * @export
 * @param {String} url
 * @param {Element} form表单元素
 * @returns Fetch Promise 对象
 */
export function postForm(url: string, formElem: any, option?: any) {
  return (dispatch: any) => {
    const errorFunc = ajaxErrorCallback(dispatch, 'postForm', url);
    dispatch(requestSave());

    return request
      .postForm(url, formElem, option)
      .then((json: any) => {
        if (json === undefined) {
          return {};
        }

        if (!json.success) {
          json.url = url;
          dispatch(receiveServerError(json));
        }

        dispatch(receiveSave());
        return json;
      })
      .catch(errorFunc);
  };
}

/**
 * Validate data
 */
export function startValidateAll(formId: any) {
  return {
    payload: {
      formId,
      validateAt: Date.now()
    },
    type: ACTION_TYPES.START_VALIDATE_ALL
  };
}

/**
 *
 *
 * @export
 * @param {function} func 验证完成后的回调函数
 * @param {Sting} formId 具体的表单ID（没有则验证界面所有可视元素）
 * @returns
 */
export function validateAll(formId: string, func: (arg0: any) => void) {
  return (dispatch: any, getState: () => any) => {
    let validatePromise: any = null;

    dispatch(startValidateAll(formId));
    validatePromise = new Promise(resolve => {
      setTimeout(() => {
        const invalid = getState().app.get('invalid');
        if (typeof func === 'function') {
          func(invalid);
        }
        resolve(invalid);
      }, 5);
    });
    return validatePromise;
  };
}


export function reportValidError(payload: any) {
  return {
    payload,
    type: ACTION_TYPES.REPORT_VALID_ERROR
  };
}


// 接受全局的数据字典;
export function receiveDictionary(payload: any) {
  return {
    payload,
    type: ACTION_TYPES.RECEIVE_DICTIONARY
  }
}

// 获取全局的数据字典
export function getDictionary(url: string, query: object) {
  return (dispatch: any): any => {
    return dispatch(get(url, query)).then((json: any) => {
      if (json.success) {
        // 如果请求的页码大于返回数据的总页数，请求最后页
        dispatch(receiveDictionary(json.data));
      }
      return json;
    });
  };
}