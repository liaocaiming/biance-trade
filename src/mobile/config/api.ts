
import { config } from '@utils/lib/request';
import OrderDetail from '../routes/OrderDetail';


const localApiPrefix = '/api/v1/';

export const urls = {
  login: 'authentication', // 登录
  register: 'users', // 注册
  checkTXid: 'deposit_records/check', // 检查转账id
  followRecords: 'follow_records', // 首页列表数据
  cancelFollowRecords: 'follow_records/destroy', // 取消跟单
  orderOpenSettingsUpdate: 'user_settings/update', // 跟新设置开单设置
  getOrderOpenSettingData: 'user_settings', // 获取开单设置
  getOrderOpenSettinOfficial: 'user_settings/official', // 推荐开单设置
  userSettings: 'user_settings', // 获取用户跟单设置
  setSecret: 'users/set_secret', // 绑定api
  StopOrStartUserSetting: 'follow_records/change', // 启动停止策略
  orderDetail: 'follow_records/show', // 订单详情
  usersStop_bot: 'users/stop_bot', // 停用机器人
  usersStart_bot: 'users/start_bot' // 启用机器人
};

config([
  {
    prefix: localApiPrefix,
    urls,
  },
]);

export default urls;
