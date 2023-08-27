import { IProps, Type, IRow } from '../interface';

import { objToArr } from './index';

interface IReturn {
  type: Type,
  eleAttr: any;
}

export default (props: IProps, item: IRow): IReturn => {
  const {
    dateKeys = [],
    selectKeys = [],
    mulSelectKeys = [],
    selectMap = {},
    multipleSelectMap = {},
    rangePickerKeys = [],
    cascaderKeys = [],
    monthPicker = [],
    numberRangerKeys = [],
  } = props;

  const { type: eleType, eleAttr: attr = {}, searchDataIndex, dataIndex: dataKey, name } = item || {}
  let type: Type = eleType || 'input';

  let eleAttr = attr;

  const dataIndex = searchDataIndex || dataKey || name || '';

  const { fieldNames } = item;
  // 处理数字范围输入
  if (numberRangerKeys.includes(dataIndex)) {
    type = 'numberRanger'
  }

  // 处理日期选择
  if (dateKeys.includes(dataIndex)) {
    type = 'datePicker';
  }

  // 处理月选择
  if (monthPicker.includes(dataIndex)) {
    type = 'datePicker';
    eleAttr = { ...eleAttr, picker: 'month' };
  }

  // 处理时间范围选择
  if (rangePickerKeys.includes(dataIndex)) {
    type = 'rangePicker';
  }

  // 处理省市区选择
  if (cascaderKeys.includes(dataIndex)) {
    type = 'cascader';
  }

  const isMultipleSelect = mulSelectKeys.includes(dataIndex) || multipleSelectMap[dataIndex];

  if (selectKeys.includes(dataIndex) || selectMap[dataIndex] || isMultipleSelect) {
    type = 'select';
    if (isMultipleSelect) {
      eleAttr = { mode: 'multiple', ...eleAttr };
    }
    let options = multipleSelectMap[dataIndex] || selectMap[dataIndex];

    if (fieldNames && Array.isArray(options)) {
      options = options.map(item => {
        return {
          ...item,
          value: item[fieldNames?.value || ''],
          label: item[fieldNames?.label || ''],
        };
      });
    }

    if (Object.prototype.toString.call(options) === '[object Object]') {
      options = objToArr(options);
    }

    if (options) {
      eleAttr = { options, ...eleAttr };
    }
  }

  return { type, eleAttr }

}
