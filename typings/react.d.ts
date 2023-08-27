
import { IActions } from '@containers/index.d'

import { History, Location } from 'history';

export type ICompany = {
  title: string;
  name: string;
  menuKeys?: string[]
}

interface IMatch {
  path: string;
  url: string;
  params: { // 路由的参数
    id: string;
    [random: string]: any;
  }
}

interface ITitleArrItem {
  title: string;
  href?: string;
}
interface IRoute {
  component: React.ReactDOM;
  title: string; // 页面tittle
  path: string;
  parentHref: string; // 详情页面跳转到列表页用的
  // 下面俩个属性bssp系统没有
  titleArr?: ITitleArrItem[]; // 页面面包导航
  config?: any; // 数据的按钮权限
}


export default interface IProps {
  $$app: any;
  $$boss: any;
  $$screen: any;
  $$detailScreen: any;
  actions: IActions;
  history: History;
  match: IMatch;
  location: Location;
  route: IRoute;
  companyConfig?: ICompany;
  [random: string]: any;
}
