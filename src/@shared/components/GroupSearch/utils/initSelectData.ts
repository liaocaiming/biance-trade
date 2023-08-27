import { IProps } from '../interface';

import objToArr from './objToArr';


export default (props: IProps) => {
  const { selectMap, multipleSelectMap } = props;
  const selectData: any = {};
  if (selectMap) {
    Object.keys(selectMap).forEach((key: string) => {
      const values = selectMap[key];
      if (Object.prototype.toString.call(values) === '[object Object]') {
        selectData[key] = objToArr(values);
      } else {
        selectData[key] = values;
      }
    });
  }

  if (multipleSelectMap) {
    Object.keys(multipleSelectMap).forEach((key: string) => {
      const values = multipleSelectMap[key];
      if (Object.prototype.toString.call(values) === '[object Object]') {
        selectData[key] = objToArr(values);
      } else {
        selectData[key] = values;
      }
    });
  }
  return selectData;
};
