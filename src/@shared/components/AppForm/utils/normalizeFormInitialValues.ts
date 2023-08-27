/* eslint-disable no-param-reassign */
// import { setIn } from 'fezs-js';

import { AppFormItemOptions, Store } from '../interface.d';
import traversalFormItems from './traversalFormItems';
import getInitialValue from './getItemValue';


/**
 * 合并与 AppForm 的初始值
 *
 * @export
 * @param {AppFormItemOptions[]} formItems
 * @param {Store} [initialValues]
 * @param {boolean} [numberToString]
 * @returns {Store}
 */
export default function normalizeFormInitialValues(
  formItems: AppFormItemOptions[],
  initialValues?: Store,
  numberToString?: boolean
): Store {
  const initValues = {};

  if (initialValues) {
    Object.keys(initialValues).forEach(name => {
      const curVal = initialValues[name];

      if (typeof curVal !== 'undefined') {
        initValues[name] = getInitialValue(curVal, numberToString);
      }
    });
  }

  // 需要合并初始值，并删除item中多余的初始值
  traversalFormItems(formItems, item => {
    const { initialValue, name } = item;

    if (typeof initialValue !== 'undefined') {
      const newValue = getInitialValue(initialValue, numberToString);

      // item.initialValue = newValue;
      Object.assign(initValues, { [name as any]: newValue })
      // setIn(initValues, name, newValue);

      // 避免冲突
      delete item.initialValue;
    }
  });

  return initValues;
}
