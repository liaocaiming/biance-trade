
import { config } from '@utils/lib/request';



const localApiPrefix = '/app/v1/';

export const urls = {
  users: 'users', // 注册
  users_get_code: 'users/get_code', // 获取验证码
  system_settings: 'system_settings', // 获取系统配置


};

config([
  {
    prefix: localApiPrefix,
    urls,
  },
]);

export default urls;
