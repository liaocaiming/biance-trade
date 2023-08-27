
import Login from '@src/h-mobile/routes/Register';
import Home from '@src/h-mobile/routes/Home';

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
    path: 'register',
    name: 'register',
    component: Login,
    title: '登录'
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    title: '首页'
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

console.log(formatterRouter);


formatPageUrl(router);


export {
  pageUrlsTitle,
  pageUrlsMap,
  IUrls
}

(window as any).pageUrlsMap = pageUrlsMap;


export default formatterRouter;