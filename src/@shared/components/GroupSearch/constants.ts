

export const dateFormat = 'YYYY-MM-DD';

export const monthFormat = 'YYYY-MM';

import { ItemType } from './interface.d';

export const sizeClassNameMap = {
  small: 'fezs-groupSearch-sm',
  middle: 'fezs-groupSearch-md',
  large: 'fezs-groupSearch-lg',
};

export const defaultWidth = 200;

export const defaultAttr = {
  placeholder: '请输入',
  style: { width: defaultWidth },
};


export const widthMap = {
  4: 1400,
  3: 1170,
};


export const placeholderMap = {
  [ItemType.cascader]: '请选择',
  [ItemType.input]: '请输入',
  [ItemType.number]: '请输入',
  [ItemType.select]: '请选择',
  [ItemType.cascader]: '请选择省市区',
}


export const inputWidth = 200;


