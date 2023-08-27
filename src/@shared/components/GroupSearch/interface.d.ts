

interface SelectData {
  loading: boolean;
  data: any[];
  hasLoad: boolean;
}

interface IList {
  value: string | number;
  label: string;
  title?: string;
}


export interface IObject {
  [key: string]: any;
}

export interface IState {
  selectData: { [key: string]: IList[] };
  searchParams: IObject;
  fetchSelectData: { [key: string]: SelectData };
  [random: string]: any;
}


interface ISelectMap {
  [key: string]: IList[] | IObject;
}


export enum ItemType {
  // 下拉选择框
  select = 'select',

  // input 输入框
  input = 'input',
  // 数组类输入框
  number = 'number',
  datePicker = 'datePicker',
  rangePicker = 'rangePicker',
  timePicker = 'timePicker',
  timeRangePicker = 'timeRangePicker',
  cascader = 'cascader',
  // 数字范围
  numberRanger = 'numberRanger',
}

export type Type = keyof typeof ItemType;

export interface IRow {
  /**
   *  类型
   */
  type?: Type;
  title?: string;
  dataIndex?: string;
  /**
   * 和dataIndex一样, 兼容form
   */
  name?: string;
  /**
   *  解决表头字段冲突问题, 冲突时不用再写render了
   */
  searchDataIndex?: string;
  labelWith?: number; // title容器的宽度
  /**
   * 数据字典
   */
  dict?: string;
  list?: IList[]; // 列表传入的数据
  /**
   * listFilters: { values, opposite  } 要过滤的数据字典,
   *  values:  要过滤的值,
   *  opposite: 是否反向过滤, false: 表示 values的值是需要的, true: 表示values的值是要过滤的;
   */
  listFilters?: {
    values: string[];
    opposite?: boolean;
  };
  InputWidth?: number;
  fieldNames?: { value: string; label: string }; // 下拉数据用做字典转换映射的
  eleAttr?: { [random: string]: any }; // 元素的属性;
  renderSearch?: (item: IRow, state: IObject, search: (item: IRow) => (e: any) => void) => JSX.Element;
  isSearch?: ((data: IObject) => boolean) | boolean; // 是否要显示搜索

  sort?: number; // 排序; 越小排越前面
  /**
   * 异步请求数据，仅支持 Select 类型
   */
  fetchConfig?: {
    url: string;
    params?: unknown;
    method?: 'get' | 'post'; // 默认 GET
    lazy?: boolean; // 是否在下来框张开的时候加载数据;
    resultKey?: string; // result[key]，默认为空，代表 result 本身返回就是列表
  };
  [key: string]: any;
}

export interface IProps {
  rowData?: IRow[];
  onValuesChange?: (data: any, changeKey?: string, e?: any, others?: any) => Object | void; // data 搜索的值, changeKey修改的key;
  /*
  * @Deprecated 此方法已废除
  */
  dateKeys?: string[]; // 选择时间的字段
  rangePickerKeys?: string[]; // 时间区域的字段
  monthPicker?: string[]; // 月份选择
  numberRangerKeys?: string[]; // 数字范围选择; searchDataIndex 或者 dataIndex 用 _ 链接, 如 start_end
  defaultValues?: any; // 所有条件的默认值
  selectKeys?: string[]; // 属于单选下拉框的key,
  mulSelectKeys?: string[]; // 属于单选下拉框的key
  selectMap?: ISelectMap; // 单选下拉数据;
  multipleSelectMap?: ISelectMap; // 多选下拉数据;
  isShowResetBtn?: boolean; // 是否显示重置按钮;
  cascaderKeys?: string[]; // 省市区,
  isFilterRegion?: boolean;  // 是否将省市区的区去掉
  validateSearchParams?: (searchParams: any, isReset?: boolean) => boolean | IObject; // 校验搜索参数;
  map?: {
    // 做字段转化的
    [key: string]: string; // key是数据字典的字段,  value是转化后的字段;
  };
  getInstance?: (that: any) => void; // 获取组件的实力
  handleSearch?: (params: any, isReset?: boolean) => void | boolean; // 如果需要保存搜索参数请在搜索参数校验通过后返回true;
  actions?: any; // 如果需要保存搜索参数的和获取数据字典必须传入
  isSaveSearchParams?: boolean; // 是否记录搜索的值;
  $$screen?: any; // reducer 数据, 如果需要保存搜索参数的需要传入;
  colSpan?: number; // 按列排版, 一行排几列
  containerMinWidth?: number; // 特殊布局时容器的最小宽度;
  colMargin?: number; // 没列间距;
  btnAfterSearch?: boolean; // 默认false; // true 表示按钮放在搜索条件后面
  showSearchBtn?: boolean; // 默认true, 是否显示查询按钮
  [key: string]: any;
}


