import { actions as appActions } from "../app";
import ACTION_TYPES from "./actionTypes";

let refreshTimeout: any = null

export function initScreen(option: any) {
  return {
    type: ACTION_TYPES.INIT,
    payload: option
  };
}
export function updateScreen(option: any) {
  return {
    type: ACTION_TYPES.UPDATE,
    payload: option
  };
}

export function leaveScreen(screenId: any) {
  window.clearTimeout(refreshTimeout);

  return {
    type: ACTION_TYPES.LEAVE,
    meta: {
      name: screenId
    }
  };
}
export function changeScreenQuery(payload: any) {
  return {
    type: ACTION_TYPES.CHANGE_QUERY,
    payload
  };
}
export function changeScreenActionQuery(payload: any) {
  return {
    type: ACTION_TYPES.CHANGE_ACTION_QUERY,
    payload
  };
}
// export function changeScreenSaveStatus(payload: any) {
//   return {
//     type: ACTION_TYPES.CHANGE_SAVE_STATUS,
//     payload
//   };
// }

interface Istatuspayload {
  fetchUrl: string;
  query: {
    id: string | number;
  }
}

export function changeScreenSaveStatus(payload: Istatuspayload) {
  const { fetchUrl, query } = payload
  return (dispatch: any) => {
    return dispatch(appActions.get(fetchUrl, query)).then((json: any) => {
      if (json.success) {
        dispatch(getScreenData())
      }
      return json;
    });
  };
}

export function updateScreenCustomProps(payload: any) {
  return {
    type: ACTION_TYPES.UPDATE_CUSTOM_PROPS,
    payload
  };
}

function requestFetchScreenData() {
  return {
    type: ACTION_TYPES.REQUEST_FETCH_DATA
  };
}
export function receiveScreenData(data: any) {
  return {
    type: ACTION_TYPES.RECEIVE_DATA,
    payload: data,
    meta: {
      updateAt: Date.now()
    }
  };
}

interface IOptions {
  method?: 'get' | 'post',
  formUrl?: string;
  query?: object;
  [key: string]: any
}

export function getScreenData(option?: IOptions) {
  return (dispatch: any, getState: any) => {
    const screenState = getState().screen;
    const refreshTime = getState().app.get("rateInterval");
    const isFetchInfinite = screenState.getIn(["isFetchInfinite"]);
    const formUrl = screenState.getIn(["formUrl"]);
    const ajaxMode = screenState.getIn(["ajaxMode"]);
    const fetchUrl = screenState.getIn(["fetchUrl"]) || formUrl;
    const curFetchIntervalTime = screenState.getIn(["fetchIntervalTime"]) || refreshTime;
    const actionQuery = screenState.getIn(['actionQuery']);
    const ajaxOption = {
      mode: ajaxMode
    };
    let myUrl = fetchUrl;
    let query = screenState.getIn(["query"]) || screenState.clear();

    window.clearTimeout(refreshTimeout);
    dispatch(requestFetchScreenData());
    if (query && query.toJS) {
      query = query.merge(actionQuery)
      query = query.toJS();
    }

    if (option) {
      // 处理 ajax mode参数，是否跨域
      if (option.mode) {
        ajaxOption.mode = option.mode;
      }

      // 处理 自定义 URL
      if (option.url) {
        myUrl = option.url;
      }

      // 处理完全自定义查询参数 query
      if (option.query) {
        query = option.query;
      }

      if (query.pageNo) {
        query.page = query.pageNo;
      }
    }

    const { method = 'get' } = option || {};
    // 如果 Url 路径不存在，返回空 Promise
    if (!myUrl) {
      return new Promise(resolve => {
        resolve("Fetch url is need");
      });
    }

    return dispatch(appActions[method](myUrl, query, ajaxOption)).then((json: any) => {
      // const pageNo = json && json.data && json.data.page && json.data.page.pageNo
      // if (json.success) {
      //   // 如果请求的页码大于返回数据的总页数，请求最后页
      //   if (pageNo < query.pageNo) {
      //     dispatch(
      //       changeScreenQuery({
      //         pageNo: json.totalPage
      //       })
      //     );
      //     dispatch(getScreenData());

      //     // 正常接收数据
      //   } else {
      //     dispatch(receiveScreenData(json.data));
      //   }
      // } else {
      //   dispatch(receiveScreenData(null));
      // }

      dispatch(receiveScreenData(json));

      // if (json.code == 200) {
      //   dispatch(receiveScreenData(json.data));
      // } else {
      //   dispatch(receiveScreenData(null));
      // }
      if (isFetchInfinite && curFetchIntervalTime > 0) {
        refreshTimeout = window.setTimeout(() => {
          dispatch(getScreenData());
        }, curFetchIntervalTime);
      }

      return json;
    });
  };
}
