/* eslint-disable no-param-reassign */
import { getIn } from '@utils/index';
import { AppFormItemOptions, Store } from '../interface.d';
import traversalFormItems from './traversalFormItems';

/**
 * 清除 item 中 initialValue 已定义的项
 * 转换 initialValues 未定义的 initialValue 值
 *
 * @param {AppFormItemOptions[]} items
 * @param {Store} initialValues
 * @param {boolean} [numberToString]
 */
export default function transformItemsInitialValue(
  items: AppFormItemOptions[],
  initialValues: Store,
  numberToString?: boolean
) {
  traversalFormItems(items, item => {
    const { initialValue, name } = item;

    if (typeof getIn(initialValues, name) !== 'undefined') {
      delete item.initialValue;
    } else if (numberToString && typeof initialValue === 'number') {
      item.initialValue = `${initialValue}`;
    }
  });
}
