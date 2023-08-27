import { helpers } from '@shared/utils';
import { fromJS } from "immutable";
import ACTION_TYPES from "./actionTypes";
import omit from 'loadsh/omit'

const defaultState = fromJS({
  fetching: false,
  saving: false,
  query: {
    pageSize: 20,
    pageNo: 1
  },

  // 用于保存后台返回的数据
  data: {
    settings: {},
    list: [],
    page: {

    }
  },

  // 用于保存Screen自定义属性
  customProps: {},

  // 页面全局配置
  curSettings: {},
  defaultSettings: {},

  // 当前列表
  curList: [],
  curListKeys: {
    pageDataKey: "page",
    listDataKey: "list",
    selectedListKey: "selectedList",
    id: ""
  },

  // 当前正在操作的列表项
  curListItem: {},
  defaultListItem: {},

  // 操作相关查询对象
  actionQuery: {}
});

interface IAction {
  type: string;
  payload?: any;
  meta?: any;
}

/**
 * Init screen state
 *
 * @param {immutable} state
 * @param {object} action
 * @returns New immutable state
 */
function initScreenState($$state: any, action: IAction) {
  let $$myScreenState = $$state.mergeDeep(action.payload);

  // 第一次初始化
  // if (!$$myScreenState) {
  $$myScreenState = defaultState.mergeDeep(action.payload);

  // 更新
  // } else {
  //   $$myScreenState = $$myScreenState.mergeDeep(action.payload);
  // }


  return $$myScreenState;
}


/**
 * 接收数据
 *
 * @param {any} $$state
 * @param {any} curScreenName
 * @param {any} action
 * @returns
 */
function receiveScreenData($$state: any, action: IAction) {
  const { payload } = action
  // const pageNo = payload && payload.pageNo || 1;
  // const pageSize = payload && payload.pageSize || 10
  // let list = payload && payload.dataList || [];
  // if (Array.isArray(payload)) {
  //   list = payload;
  // }

  let { count, data: list, pageNo, pageSize } = payload || {}

  const data = {
    list,
    page: {
      totalCount: count,
      pageNo: Number(pageNo),
      pageSize
    },
    other: omit(payload, ['data', 'count', 'pageNo', 'pageSize'])
  }
  return $$state
    .setIn(["fetching"], false)
    .mergeIn(["data"], data)
    .setIn(["data", "updateAt"], action.meta.updateAt);
}


export default function (state = defaultState, action: IAction) {

  switch (action.type) {
    // Screen 全局 action
    case ACTION_TYPES.INIT:

      return initScreenState(state, action);

    case ACTION_TYPES.UPDATE:
      return state.merge(action.payload);

    case ACTION_TYPES.LEAVE:
      return defaultState;

    case ACTION_TYPES.CHANGE_SAVE_STATUS:
      return state.setIn(["saving"], action.payload);

    case ACTION_TYPES.REQUEST_FETCH_DATA:
      return state.setIn(["fetching"], true);

    case ACTION_TYPES.UPDATE_CUSTOM_PROPS:
      return state.mergeDeepIn(["customProps"], action.payload);

    case ACTION_TYPES.RECEIVE_DATA:
      return receiveScreenData(state, action);

    // appScreen 操作
    case ACTION_TYPES.CHANGE_QUERY:
      return state.mergeIn(["query"], action.payload);

    case ACTION_TYPES.CHANGE_ACTION_QUERY:
      return state.setIn(["actionQuery"], fromJS(action.payload));

    default:
  }
  return state;
}
