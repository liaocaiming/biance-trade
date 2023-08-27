import routes from './routes';
import bossReducers from '@src/boss/reducers/bossReducer';
import appScreenReducer from '@shared/containers/appScreen/reducer';
import appReducer from '@shared/containers/app/reducer';
import api from './api';

const  reducers = {
  app: appReducer,
  screen:appScreenReducer,
  boss:bossReducers
}

export {
  routes,
  reducers,
  api
}