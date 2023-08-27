import { fromJS } from "immutable";

import ACTION_TYPES from "./actionTypes";

const defaultState = fromJS({
  symBolList: []
  
});

interface IAction {
  type: string;
  payload?: any;
  meta?: any;
}



export default function(state = defaultState, action: IAction) {

  switch (action.type) {
    // Screen 全局 action
    case ACTION_TYPES.GETSYMBOL :{
      return state.mergeIn(['symBolList'], action.payload)
    } 

    default:
  }
  return state;
}
