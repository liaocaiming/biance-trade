import loadFile from '@containers/loadFile';

import Login from '@src/boss/routes/Login';

import Layout from '@shared/components/Layout';

const router = [
  {
    path: '/',
    component: Login,
  },
  {
    path: 'boss',
    component: Layout,
    routes: [
      {
        path: 'bindUser',
        component: loadFile({
          load: () => import('@src/boss/routes/BindUser')
        }),
        title: '账户绑定',
        exact: true
      },

      {
        path: 'orderSet',
        component: loadFile({
          load: () => import('@src/boss/routes/OrderSet')
        }),
        title: '下单设置',
        exact: true
      },

      {
        path: 'FollowOrderSet',
        component: loadFile({
          load: () => import('@src/boss/routes/FollowOrderSet')
        }),
        title: '下单设置',
        exact: true
      },


      {
        path: 'chart',
        component: loadFile({
          load: () => import('@src/boss/routes/Chart')
        }),
        title: '汇率-价格统计图',
        exact: true
      },



      {
        path: 'rate',
        component: loadFile({
          load: () => import('@src/boss/routes/Rate')
        }),
        title: '汇率柱形统计图',
        exact: true
      },


      {
        path: 'bestCoinList',
        component: loadFile({
          load: () => import('@src/boss/routes/BestCoinList')
        }),
        title: '牛逼赛选列表',
        exact: true
      },

      {
        path: 'statistics',
        component: loadFile({
          load: () => import('@src/boss/routes/Statistics')
        }),
        title: '合约数据统计',
        exact: true
      },

      {
        path: 'symbolSlectList',
        component: loadFile({
          load: () => import('@src/boss/routes/SymbolSlectList')
        }),
        title: '牛币筛选',
        exact: true
      },
      {
        path: 'iconSelectList',
        component: loadFile({
          load: () => import('@src/boss/routes/IconSelectList')
        }),
        title: '合约数据统计',
        exact: true
      },

      {
        path: 'test',
        component: loadFile({
          load: () => import('@src/boss/routes/Test')
        }),
        title: '测试',
        exact: true
      }
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