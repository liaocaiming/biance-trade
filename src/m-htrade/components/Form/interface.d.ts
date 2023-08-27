import { IRule } from '@utils/lib/validator'

type IDomFun = ((data: Store) => JSX.Element | string) | JSX.Element | string;

export enum FormType {
  input = 'input',
  select = 'select',
  switch = 'switch',
  checkbox = 'checkbox',
  radio = 'radio'
}


interface IList {
  value: string | number;
  label: string;
}

type Type = keyof typeof FormType;

export type Store = {
  [key: string]: any;
}

export interface FormInstance {
  getFieldValue?: (key: string) => any;
  getFieldsValue?: () => Store;
  setFieldsValue?: (values: Store) => void
}

interface FormItemOptions {
  name: string;
  label?: IDomFun;
  type?: Type;
  initialValue?: any;
  data?: IList[]; // 下来框数据
  rules?: IRule[];
  isShow?: ((data: Store) => boolean) | boolean;
  eleAttr?: Store;
  afterDom?: IDomFun,
  render?: (options: { form: FormInstance }) => JSX.Element;
}


export interface FormOptions {
  formItems: FormItemOptions[];
  onFinish?: (data: Store) => void;
  onError?: (rule: IRule) => void;
  onValuesChange?: (data: Store, formItem: FormItemOptions) => void;
  afterDom?: IDomFun,
  initialValues?: Store;
  submitOptions?: {
    containerClassName?: string;
    text?: string;
    btnAttr?: JSX.Element;
  }
  getRef?: (form: FormInstance) => void
}