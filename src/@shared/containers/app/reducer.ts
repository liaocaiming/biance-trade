import { fromJS } from 'immutable';
import ACTION_TYPES from './actionTypes';

const defaultState = fromJS({
  fetching: false,
  saving: false,
  version: '',
  // tslint:disable-next-line:object-literal-sort-keys
  invalid: {},
  modal: {
    role: 'alert',
  },
  router: {
    routes: [],
  },
  rateInterval: 15000,

  // 跳转路由的信息
  listItem: {},

  dictionary: {

  },
  companyInfo:{}
});
const ajaxTypeMap = {
  get: 'fetching',
  post: 'saving',
  saveFile: 'saving',
};

interface IAction {
  type: string,
  payload?: any,
  meta?: any
}


function receiveReport(state: any, data: any) {
  let ret;

  if (!data.checkResult) {
    ret = state.deleteIn(['invalid', data.name]);
  } else {
    ret = state.setIn(['invalid', data.name], data.checkResult);
  }

  return ret;
}

function handleValidateAll(state: any, action: IAction) {
  const time = action.payload.validateAt;
  const formId = action.payload.formId || '__all__';

  return state.set('invalid', fromJS({}))
    .set('validateAt', `${formId}.${time}`);
}

export default function (state = defaultState, action: IAction) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_ROUTER:
      return state.mergeIn(['router'], action.payload);

    /**
     * 全局数据验证
     */
    case ACTION_TYPES.START_VALIDATE_ALL:
      return handleValidateAll(state, action);

    case ACTION_TYPES.RESET_VALIDATE_MSG:
      return state.set('invalid', fromJS({}));

    case ACTION_TYPES.REPORT_VALID_ERROR:
      return receiveReport(state, action.payload);

    /**
     * Request
     */
    case ACTION_TYPES.REQUEST_SAVE:
      return state.set('saving', true);

    case ACTION_TYPES.RECEIVE_SAVE:
      return state.set('saving', false)
        .set('savedAt', Date.now())
        .set('state', fromJS(action.payload));

    case ACTION_TYPES.RECEIVE_AJAX_ERROR:
      return state
        .mergeIn(['ajaxError'], action.payload)
        .set(ajaxTypeMap[action.payload.type], false);

    case ACTION_TYPES.RECEIVE_SERVER_ERROR:
      return state.set('state', fromJS(action.payload));

    case ACTION_TYPES.RQ_FETCH:
      return state.set('fetching', true);

    case ACTION_TYPES.RC_FETCH:
      return state.set('fetching', false);

    case ACTION_TYPES.RECEIVE_DICTIONARY:
      return state.mergeIn(['dictionary'], action.payload);
    case ACTION_TYPES.COMPANY_INFO:
      return state.mergeIn(['companyInfo'], action.payload);
    default:
  }
  return state;
}
