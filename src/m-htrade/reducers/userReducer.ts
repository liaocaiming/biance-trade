import { fromJS } from 'immutable';

import { createReducer } from '@utils/index';

const initialState = fromJS({
  userName: 'liaocaiming', 
  list: [
    {
      name: 5555,
      title: 8888
    }
  ]
})

const nameSpace = 'USER';
export default createReducer(initialState, {
  [`${nameSpace}/CAIMINGLIAO`]: receiveName
})

function receiveName ($$state:any, action:any) {
  return $$state.mergeIn(['userName'], action.payload)
}