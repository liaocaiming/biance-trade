// import { IBossActions } from '@src/boss/reducers'

export interface IAjax {
  url: string;
  query?: any;
  option?: { showLoading: boolean;[random: string]: any };
}

interface IPostFormAjax extends IAjax {
  formElem: any;
}

type TActionReturnParams<T> = {
  type: string;
  options?: T;
};

interface IOptions {
  showLoading?: boolean;
  isShowError?: boolean;
  errMsg?: string
}

interface IRes {
  code?: number;
  data: any;
  message?: string;
}

export interface IAppActions {
  get(url: string, query?: any, option?: IOptions): Promise<IRes>;
  post(url: string, query?: any, option?: IOptions): Promise<IRes>;
  initScreen({ fetchUrl: string }): void;
  [random: string]: any;
}

export interface IAppScreenAction {
  changeScreenQuery<T>(options: T): TActionReturnParams<any>;
  changeScreenActionQuery<T>(options: T): TActionReturnParams<any>;
  getScreenData(option?: { url?: string; query?: any, method: 'get' | 'post' }): Promise<any>;
  [random: string]: any;
}


export interface IActions extends IAppActions, IAppScreenAction { }

export interface IDictionaryItem {
  value: string;
  label: string;
}

interface IFetch {
  fetching: boolean;
  saving: boolean;
}
export interface IAppReducer extends IFetch {

  dictionary: { [random: string]: IDictionaryItem[] };
  companyInfo: any;
}

export interface IAppScreenReducer extends IFetch {
  query: { //
    pageSize: number;
    pageNo: number;
    [random: string]: any;
  }
  data: {   // 用于保存后台返回的数据
    list: any[];
    page: {
      pageSize: number;
      pageNo: number;
      totalCount: number;
      totalPages: number;
    }
  }
  // 操作相关查询对象
  actionQuery: any;
}

export interface IAppDetailScreenReducer extends IFetch {
  detail: any;
  fetchUrl: string;
  params: any;
  orderListDetailData: any; // 订单管理 =》 订单详情 =》 商品信息
  data: {   // 用于保存后台返回的数据
    list: any[];
    page: {
      pageSize: number;
      pageNo: number;
      totalCount: number;
      totalPages: number;
    }
  }
}
