import * as appActions from '@containers/app/actions';

import ACTION_TYPES from './actionTypes';

interface Option {
  url?: string
}

export function getSymbol(option?: Option) {
  return (dispatch: any) => {
    const { url = 'realtime'} = option || {};
    return dispatch(appActions.get(url)).then((json: any) => {
      if (json) {
        dispatch({
          type:ACTION_TYPES.GETSYMBOL,
          payload: json
        })
      }
      return json;
    });
  };
}
