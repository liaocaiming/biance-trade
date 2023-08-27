import loadFile from '@containers/loadFile';

import Login from '@src/mobile/routes/Login';

import Layout from '@src/mobile/components/Layout';

interface IUrls {
  login: string;
  pay: string;
  home: string;
  bindUser: string;
  order: string;
  strategyList: string;
  strategyItem: string;
  orderDetail: string;
  openNumberLimit: string;
}

const router = [
  {
    path: '/',
    name: 'login',
    component: Login,
    title: '登录'
  },
  {
    path: 'mobile',
    component: Layout,
    routes: [
      {
        path: 'pay',
        name: 'pay',
        component: loadFile({
          load: () => import('@src/mobile/routes/Pay')
        }),
        title: 'USDT收款码',
        exact: true
      },
      {
        path: 'home',
        name: 'home',
        component: loadFile({
          load: () => import('@src/mobile/routes/Home')
        }),
        title: '首页',
        exact: true
      },
      {
        path: 'bindUser',
        name: 'bindUser',
        component: loadFile({
          load: () => import('@src/mobile/routes/BindUser')
        }),
        title: '账户绑定',
        exact: true
      },

      {
        path: 'order',
        name: 'order',
        component: loadFile({
          load: () => import('@src/mobile/routes/Order')
        }),
        title: '机器人设置',
        exact: true
      },

      {
        path: 'strategyList',
        name: 'strategyList',
        component: loadFile({
          load: () => import('@src/mobile/routes/StrategyList')
        }),
        title: '策略列表',
        exact: true
      },


      {
        path: 'strategyItem',
        name: 'strategyItem',
        component: loadFile({
          load: () => import('@src/mobile/routes/StrategyItem')
        }),
        title: '策略详情',
        exact: true
      },


      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: loadFile({
          load: () => import('@src/mobile/routes/OrderDetail')
        }),
        title: '仓位详情',
        exact: true
      },

      {
        path: 'openNumberLimit',
        name: 'openNumberLimit',
        component: loadFile({
          load: () => import('@src/mobile/routes/OpenNumberLimit')
        }),
        title: '开单数设置',
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


const pageUrlsTitle = {}
const pageUrlsMap: IUrls = {} as IUrls;

function formatPageUrl(data: any, parentPath?: string) {
  return data.forEach((item: { path: string; title: string; name: string; routes?: any }) => {
    let { path, title, name } = item;

    if (path !== undefined && parentPath) {
      path = parentPath + item.path;
    }

    if (item.routes) {
      formatPageUrl(item.routes, `/${item.path}/`);
    } else {
      Object.assign(pageUrlsTitle, { [path]: title })
      Object.assign(pageUrlsMap, { [name]: path })
    }
  });
}

const formatterRouter = formatter(router);

formatPageUrl(router);


export {
  pageUrlsTitle,
  pageUrlsMap,
  IUrls
}

(window as any).pageUrlsMap = pageUrlsMap;


export default formatterRouter;