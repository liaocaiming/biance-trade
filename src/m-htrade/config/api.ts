
import { config } from '@utils/lib/request';
import OrderDetail from '../routes/OrderDetail';


const localApiPrefix = '/app/v1/';

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
  usersStart_bot: 'users/start_bot', // 启用机器人



  getCode: 'users/get_code', // 获取验证码
  users: 'users', // 注册
  authentication: 'authentication',  // 登录
  reset_password: 'users/reset_password', ///修改密码
  notifications: 'users/notifications', // /// 通知列表
  check_code: 'users/check_code', // 校验邮箱验证码
  question_answers: 'question_answers', // 问题列表
  push_records: 'push_records', // 获取推送列表
  system_settings: 'system_settings', // 获取系统配置；
  deposit_records: 'deposit_records', // 提交充值
  invite_records: 'invite_records', // 返佣记录
  subscribe: 'push_records/subscribe', // 关注
  unsubscribe: 'push_records/unsubscribe' // 取消关注
};

config([
  {
    prefix: localApiPrefix,
    urls,
  },
]);

export default urls;
