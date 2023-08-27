import { fromJS } from 'immutable';

import { createReducer } from '@utils/index';

const initialState = fromJS({
  order: '32132132', 
  list: [
    {
      name: 4389537,
      title: 8888
    }
  ]
})

const nameSpace = 'ORDER';
export default createReducer(initialState, {
  [`${nameSpace}/BOSS`]: receiveName
})

function receiveName ($$state:any, action:any) {
  return $$state.mergeIn(['userName'], action.payload)
}