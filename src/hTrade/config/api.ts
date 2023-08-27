
import { config } from '@utils/lib/request';


const localApiPrefix = '/api/v1/';
// const localApiPrefix = '/';
const bianceFApiPrefix = '/fapi/'

export const urls = {
  excel_data: 'excel_data', // 
  role: 'role/list', // 角色列表

  authentication: 'authentication', // 登陆
  // 用户信息
  userList: 'users', // 用户列表
  addUser: 'users', // 新增用户
  editUser: 'users/update', // 编辑用户

  // 返佣
  invite_records: 'invite_records', // 获取邀请列表
  invite_records_update: 'invite_records/update', // 设置返佣金额

  // 策略
  trade_signals: 'trade_signals', // 获取策略列表
  push_records: 'push_records', // 获取推送列表, 手动推送信号
  trade_signals_update: 'trade_signals/update', // 修改策略


  // 机器人
  bots: 'bots', // 列表, 新增
  bots_update: 'bots/update', // 修改机器人
  bots_start_bot: 'bots/start_bot', // 开启个人机器人
  bots_stop_bot: 'bots/stop_bot', // 关闭个人机器人
  bots_stop_all_bot: 'bots/stop_all_bot', // 关闭所有机器人
  bots_start_all_bot: 'bots/start_all_bot', // 开启所有机器人
  exception_records: 'exception_records', // 获取异常列表
  exception_records_update: 'exception_records/update', // 异常处理
  transfer_records: 'transfer_records', // 获取机器人划转列表:
  follow_records: 'follow_records', // 跟单列表
  follow_records_earnings_report: 'follow_records/earnings_report', // 盈亏分析
  follow_records_Show: 'follow_records/show', // 订单详情

  // 充值列表
  deposit_records: 'deposit_records', // 充值列表
  deposit_records_update: 'deposit_records/update', // 审核
  deposit_records_destroy: 'deposit_records/destroy', // 删除


  // 手机开单
  trade_signals_symbol_info: 'trade_signals/symbol_info',
  trade_signals_set_symbol: 'trade_signals/set_symbol', // 编辑策略


  // 预警
  users_notification_user: 'users/notification_user', 
  users_notifications: 'users/notifications'

};


// export const bianceUrls = {
//   v1PremiumIndex: 'v1/premiumIndex' // 最新标记价格和资金费率
// };


config([
  {
    prefix: localApiPrefix,
    urls,
  },
  // {
  //   prefix: bianceFApiPrefix,
  //   urls: bianceUrls,
  // },
]);

export default { ...urls };
