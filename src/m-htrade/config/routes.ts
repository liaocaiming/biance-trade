import loadFile from '@containers/loadFile';

import Login from '@src/m-htrade/routes/Login';

import Layout from '@src/m-htrade/components/Layout';

import history from '@utils/lib/history';


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
  register: string;
  resetPassword: string;
  returnList: string;
}

const router = [
  {
    path: '/',
    name: 'login',
    component: Login,
    title: '登录'
  },
  {
    path: 'register',
    name: 'register',
    component: loadFile({
      load: () => import('@src/m-htrade/routes/Register')
    }),
    title: '注册'
  },
  {
    path: 'resetPassword',
    name: 'resetPassword',
    component: loadFile({
      load: () => import('@src/m-htrade/routes/ResetPassword')
    }),
    title: '找回密码'
  },

  {
    path: 'questions',
    name: 'questions',
    component: loadFile({
      load: () => import('@src/m-htrade/routes/Questions')
    }),
    title: '常见问题'
  },

  {
    path: 'returnList',
    name: 'returnList',
    component: loadFile({
      load: () => import('@src/m-htrade/routes/ReturnList')
    }),
    title: '返佣'
  },


  {
    path: 'bindUser',
    name: 'bindUser',
    component: loadFile({
      load: () => import('@src/m-htrade/routes/BindUser')
    }),
    title: '账户绑定',
    exact: true
  },


  {
    path: 'm-htrade',
    component: Layout,
    routes: [
      {
        path: 'notice',
        name: 'notice',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/Notice')
        }),
        title: '通知',
        exact: true
      },
      {
        path: 'pay',
        name: 'pay',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/Pay')
        }),
        title: '付费说明',
        exact: true
      },
      {
        path: 'home',
        name: 'home',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/Home')
        }),
        title: '首页',
        exact: true
      },

      {
        path: 'order',
        name: 'order',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/Order')
        }),
        title: '下单',
        exact: true
      },









      {
        path: 'strategyList',
        name: 'strategyList',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/StrategyList')
        }),
        title: '策略列表',
        exact: true
      },


      {
        path: 'strategyItem',
        name: 'strategyItem',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/StrategyItem')
        }),
        title: '策略详情',
        exact: true
      },


      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/OrderDetail')
        }),
        title: '仓位详情',
        exact: true
      },

      {
        path: 'openNumberLimit',
        name: 'openNumberLimit',
        component: loadFile({
          load: () => import('@src/m-htrade/routes/OpenNumberLimit')
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

const setTititle = (routes: any[], path: string) => {
  routes.some((item) => {
    if (path === item.path) {
      document.title = item.title
      return
    }
    if (item.routes && item.routes.length > 0) {
      setTititle(item.routes, path);
    }
  })
}


const formatterRouter = formatter(router);

formatPageUrl(router);

(window as any).pageUrlsMap = pageUrlsMap;

history.listen((location) => {
  const { pathname } = location;
  setTititle(formatterRouter, pathname);
})

const path = window.location.hash.replace('#', '');
setTititle(formatterRouter, path)


export {
  pageUrlsTitle,
  pageUrlsMap,
  IUrls
}


export default formatterRouter;