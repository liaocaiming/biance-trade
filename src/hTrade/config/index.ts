import routes from './routes';
import hTradeReducers from '@src/hTrade/reducers/hTradeReducer';
import appScreenReducer from '@shared/containers/appScreen/reducer';
import appReducer from '@shared/containers/app/reducer';
import api from './api';
import companyConfig from './companyConfig';
import menuData from './menuData';

const reducers = {
  app: appReducer,
  screen: appScreenReducer,
  htrade: hTradeReducers
}

export {
  routes,
  reducers,
  api,
  companyConfig,
  menuData
}
