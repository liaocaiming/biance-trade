import { FormProps, FormItemProps, FormInstance } from 'antd/lib/form/index.d';
import { ButtonProps } from 'antd/lib/button/index.d';
import { ColProps } from 'antd/lib/grid/index.d';
import React from 'react';

export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

export interface Store {
  [name: string]: any;
}

interface IList {
  value: string;
  label: string
}

export enum FormItemType {
  /**
   * 下拉选择框
   */
  select = 'select',

  /**
   * 纯文本
   */
  plainText = 'plainText',

  /**
   * input 输入框
   */
  input = 'input',

  /**
   * 数组类输入框
   */
  number = 'number',
  textArea = 'textArea',
  datePicker = 'datePicker',
  checkbox = 'checkbox',

  radio = 'radio',

  rangePicker = 'rangePicker',
  timePicker = 'timePicker',
  timeRangePicker = 'timeRangePicker',

  /**
   * 自动补全下拉框
   */
  autoComplete = 'autoComplete',

  cascader = 'cascader',
  password = 'password'
}

export type ItemBooleanFunction = ((formData: Store) => boolean) | boolean;

export interface SelectListItem {
  value: string | number;
  label: string;
  [random: string]: any;
}

export interface ListFieldNames {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FormIsShowData {
  [name: string]: boolean;
}

export interface DomOptions {
  form: FormInstance;
  formItem: AppFormItemElementProps;
}

export type FormItemDOMFunction = ((options: DomOptions) => JSX.Element | string | null) | JSX.Element | null | string; // data 是表单的数据

// data 是表单的数据
export type FormDOMFunction =
  | ((options: { form: FormInstance }) => JSX.Element | string | null)
  | JSX.Element
  | null
  | string;

export interface FormItemsUpdateResult {
  showItems: AppFormItemOptions[];
  shouldUpdate: boolean;
}

type onItemChange = (e: any) => Store | void;

export interface FormInputAttr {
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;

  /**
   * 运行后，无返回值则不做其他处理
   *
   * 返回对象，则会调用 form.setFieldsValue(ret), 把返回对象合并到 form Store 中
   */
  onChange?: onItemChange;
  onBlur?: (e: any) => void;
  onClick?: (e: any) => void;
  filterOption?: boolean | ((inputValue: any, option: any) => boolean);
  [k: string]: any;
}

export type ItemFunctionKey = 'disabled' | 'isShow' | 'placeholder' | 'list';

type RenderDom = JSX.Element | string | null;

/**
 * 表单元素的子表单元素，用于表单项的子表单项
 * item.formItems: 子项不支持 beforeDOM afterDOM rowAlone formItems 属性
 */
export interface AppFormItemBase extends FormItemProps {
  /**
   * 注意：可以定义成数组
   */
  name: string | number | InternalNamePath;

  numberToString?: boolean;

  key?: string;
  label?: string | React.ReactDOM;

  type?: keyof typeof FormItemType;

  /**
   * 有一些需要依据表单值动态渲染，可以传自定义函数
   */
  disabled?: ItemBooleanFunction;
  placeholder?: ItemBooleanFunction;
  showPop?: ItemBooleanFunction;
  isShow?: ItemBooleanFunction;

  shouldUpdate?(prev: Store, next: Store): boolean;

  /**
   * 运行后，无返回值则不做其他处理
   *
   * 返回对象，则会调用 form.setFieldsValue(ret), 把返回对象合并到 form Store 中
   */
  onChange?: onItemChange;

  /**
   * 支持函数返回值或直接列表
   */
  fieldNames?: ListFieldNames;

  /**
   * 注意函数不要写异步函数, 不要在里面请求接口, 只做数据处理;
   * allValues: 所有表单数据;
   */
  list?: IList[] | ((allValues: Store) => IList[]) | object;

  /**
   * 用于直接配置表单 input 组件属性
   */
  eleAttr?: FormInputAttr;


  /**
   * 内部定义，不要从外面传进来
   */
  children?: React.ReactElement;

  /**
   * 自定义表单项渲染函数，优先级最高
   */
  render?: (formItem: AppFormItemChildProps, form: FormInstance) => React.ReactElement;
}

export interface FormItemDOMFunctions {
  beforeDOM?: FormItemDOMFunction;
  afterDOM?: FormItemDOMFunction;
}

export interface AppFormItemOptions extends FormItemDOMFunctions, AppFormItemBase {
  rowAlone?: boolean;

  isTitle?: boolean;
  title?: ((form: FormInstance) => RenderDom) | RenderDom;

  dataIndex?: NamePath;

  /**
   * 自定义表单项渲染函数
   */
  render?: (formItem: AppFormItemChildProps, form: FormInstance) => React.ReactElement;

  formItems?: AppFormItemBase[];

  /**
   * 是否可编辑，默认为 true
   * 不可编辑，则为只读展示模式，只展示文本，不展示组件
   */
  editable?: boolean;

  /**
   * editable 为 false 时, 展示的默认文本
   */
  emptyContent?: React.ReactDOM | string;
}

export interface AppFormLayoutProps {
  /**
   * antd 表单实例
   */
  form: FormInstance | null;

  /**
   * 具体项的配置列表
   */
  showItems: AppFormItemOptions[];

  /**
   * 统一控制所有表单项的布局，具体表单的自定义布局优先级更高
   */
  labelCol?: ColProps;
  wrapperCol?: ColProps;

  /**
   * 表单元素布局一行几列
   */
  colSpan?: number;

  /**
   * 表单值是否 number 转 字符串，list 值不做转换
   */
  numberToString?: boolean;

  /**
   * 不建议使用：强制更新时间，用于特殊情况强制更新所有表单
   */
  formUpdateTime?: number;

  /**
   * 是否可编辑，默认为 true
   * 不可编辑，则为只读展示模式，只展示文本，不展示组件
   */
  editable?: boolean;
}

/**
 * 用户与内部渲染的属性
 */
export interface AppFormItemElementProps extends AppFormItemOptions {
  form: FormInstance;
  updateTime?: number;
  editable?: boolean;
}

export interface AppFormItemChildProps extends AppFormItemElementProps {
  id: string;
  value: any;
  onChange(ev: any): Store | void;
}

export interface SubmitButton extends ButtonProps {
  text: string;
}

export interface FormInitialValuesOption {
  formItems: AppFormItemOptions[];
  numberToString?: boolean;
  initialValues?: Store;
}

type shouldFormUpdate = (
  changeStore: Store,
  allValues?: Store,
  form?: FormInstance | null
) => boolean | Promise<boolean>;
export interface AppFormProps extends FormProps {
  /**
   * 表单项列表
   */
  formItems: AppFormItemOptions[];

  /**
   * 通过对象来更新 form 的 Store
   * 例如：数据是异步获取，需要过一段时间再更新表单值
   */
  updateStore?: Store;

  /**
   * 定义一行有几列
   */
  colSpan?: 1 | 2 | 3 | 4;

  /**
   * 自定义 dom
   */
  afterFormDOM?: FormDOMFunction;

  /**
   * 用于控制整个表单 强制更新
   */
  shouldFormUpdate?: shouldFormUpdate;

  /**
   * 自定义 footer 样式控制类
   */
  footerClassName?: string;
  footerStyle?: React.CSSProperties;

  // 提交按钮点击，表单提交前调用函数
  beforeSubmit?(form: FormInstance): void;

  /**
   * 配置提交按钮内容
   */
  submitButton?: SubmitButton | null;

  /**
   * 表单实例准备好后调用
   */
  onReady?(form: FormInstance): void;

  /**
   * 是否开启数字转换字符串
   */
  numberToString?: boolean;

  /**
   * 只读展示模式，只展示文本，不展示组件
   */
  editable?: boolean;
}
