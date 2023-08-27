import loadFile from '@containers/loadFile';

import Login from '@src/hTrade/routes/Login';

import Layout from '@src/hTrade/components/Layout';

const router = [
  {
    path: '/',
    component: Login,
  },
  {
    path: 'hTrade',
    component: Layout,
    routes: [

      // {
      //   path: 'role',
      //   component: loadFile({
      //     load: () => import('@src/hTrade/routes/Role')
      //   }),
      //   title: '角色管理',
      //   exact: true
      // },

      // {
      //   path: 'moreUser',
      //   component: loadFile({
      //     load: () => import('@src/hTrade/routes/MoreUser')
      //   }),
      //   title: '用户管理',
      //   exact: true
      // },

      // {
      //   path: 'moreUser/:id',
      //   component: loadFile({
      //     load: () => import('@src/hTrade/routes/MoreUser/Detail')
      //   }),
      //   title: '用户管理',
      //   exact: true
      // },

      {
        path: 'test',
        component: loadFile({
          load: () => import('@src/hTrade/routes/Test')
        }),
        title: '测试页面',
        exact: true
      },


      {
        path: 'user',
        component: loadFile({
          load: () => import('@src/hTrade/routes/User')
        }),
        title: '用户管理',
        exact: true
      },
      {
        path: 'strategyList',
        component: loadFile({
          load: () => import('@src/hTrade/routes/StrategyList')
        }),
        title: '策略管理',
        exact: true
      },
      {
        path: 'strategyList/:id',
        component: loadFile({
          load: () => import('@src/hTrade/routes/StrategyList/StrategyItem')
        }),
        title: '策略详情',
        exact: true
      },

      {
        path: 'robotFollowList',
        component: loadFile({
          load: () => import('@src/hTrade/routes/RobotFollowList')
        }),
        title: '机器人跟单',
        exact: true
      },

      {
        path: 'robotFollowList/:id',
        component: loadFile({
          load: () => import('@src/hTrade/routes/RobotFollowList/Detail')
        }),
        title: '机器人跟单详情',
        exact: true
      },


      {
        path: 'system',
        component: loadFile({
          load: () => import('@src/hTrade/routes/System')
        }),
        title: '系统设置',
        exact: true
      },


      {
        path: 'rechargeList',
        component: loadFile({
          load: () => import('@src/hTrade/routes/RechargeList')
        }),
        title: '充值列表',
        exact: true
      },

      {
        path: 'manualPustSymbol',
        component: loadFile({
          load: () => import('@src/hTrade/routes/ManualPustSymbol')
        }),
        title: '手动推送列表',
        exact: true
      },

      {
        path: 'warnSetting',
        component: loadFile({
          load: () => import('@src/hTrade/routes/WarnSetting')
        }),
        title: '预警设置',
        exact: true
      },

      {
        path: 'warnSetting/:id',
        component: loadFile({
          load: () => import('@src/hTrade/routes/WarnSetting/Detail')
        }),
        title: '预警设置',
        exact: true
      },

    ],
  },

]


function formatter(data: any, parentPath = '/') {
  return data.map((item: { path: string; routes?: any }) => {
    let { path } = item;

    if (path !== undefined) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.routes) {
      result.routes = formatter(item.routes, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

const formatterRouter = formatter(router);

export default formatterRouter;