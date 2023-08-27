import React from 'react';

import {
  UserSwitchOutlined,
  ToolOutlined,
  UsergroupAddOutlined,
  PayCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import companyConfig from './companyConfig';

let menuData = [
  // {
  //   "key": "role",
  //   "title": "角色管理",
  //   "hasChild": 0,
  //   "menuType": 1,
  // },

  {
    key: 'user',
    title: '用户管理',
    hasChild: 0,
    menuType: 1,
    icon: <UserSwitchOutlined />,
  },

  {
    key: 'rechargeList',
    title: '充值列表',
    hasChild: 0,
    menuType: 1,
    icon: <PayCircleOutlined />,
  },

  // {
  //   "key": "moreUser",
  //   "title": "大户列表",
  //   "hasChild": 0,
  //   "menuType": 1,
  // },

  {
    key: 'strategyList',
    title: '策略列表',
    hasChild: 0,
    menuType: 1,
    icon: <ToolOutlined />,
  },

  {
    key: 'robotFollowList',
    title: '机器人跟单',
    hasChild: 0,
    menuType: 1,
    icon: <UsergroupAddOutlined />,

    // ManualPustSymbol
  },

  {
    key: 'manualPustSymbol',
    title: '手动推送列表',
    hasChild: 0,
    menuType: 1,
    icon: <ToolOutlined />,
  },

  {
    key: 'warnSetting',
    title: '预警设置',
    hasChild: 0,
    menuType: 1,
    icon: <SettingOutlined />
  },


  // {
  //   key: "system",
  //   title: "系统设置",
  //   hasChild: 0,
  //   menuType: 1,
  //   icon: <SettingOutlined />,
  // },
];

const { menuKeys } = companyConfig;

if (menuKeys) {
  menuData = menuData.filter(item => menuKeys.includes(item.key));
}

export default menuData;
