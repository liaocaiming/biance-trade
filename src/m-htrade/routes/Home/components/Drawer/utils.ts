
import help from './images/icon-help.png';
import notice from './images/icon-notice.png';
// import pay from './images/icon-pay.png';
import iconreturn from './images/icon-return.png';
import set from './images/icon-set.png';
// import use from './images/icon-use.png';

interface Side {
  url: string;
  title: string;
  showBorder?: boolean;
  icon: any;
}

export const sideRowData: Side[] = [
  // {
  //   title: '通知',
  //   url: '/m-htrade/notice',
  //   showBorder: false,
  //   icon: notice
  // },

  {
    title: '绑定API',
    url: '/bindUser',
    showBorder: false,
    icon: notice
  },

  {
    title: '邀请返佣',
    url: '/returnList',
    showBorder: false,
    icon: iconreturn
  },
  // {
  //   title: '收款方式',
  //   url: '/m-htrade/pay',
  //   showBorder: true,
  //   icon: pay
  // },
  {
    title: '重置密码',
    url: '/resetPassword',
    showBorder: true,
    icon: set
  },
  {
    title: '帮助中心',
    url: '/questions',
    showBorder: false,
    icon: help
  },
  // {
  //   title: '使用说明',
  //   url: '/questions',
  //   showBorder: false,
  //   icon: use
  // },

]