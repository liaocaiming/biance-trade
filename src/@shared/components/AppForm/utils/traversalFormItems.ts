import { AppFormItemOptions } from '../interface.d';

/**
 * 递归遍历 items 对象中的所有 item
 *
 * @param {AppFormItemOptions[]} items
 * @param {Store} initialValues
 * @param {boolean} [numberToString]
 */
export default function traversalFormItems(items: AppFormItemOptions[], func: (item: AppFormItemOptions, index: number) => void) {
  items.forEach((item, index) => {
    const { formItems } = item;

    func(item, index);

    if (formItems) {
      traversalFormItems(formItems, func);
    }
  });
}
