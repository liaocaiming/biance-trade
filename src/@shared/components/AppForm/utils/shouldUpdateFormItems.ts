import { FormInstance } from 'antd/lib/form';
import { getIn } from '@utils/index';

import { FormIsShowData, FormItemsUpdateResult, AppFormItemOptions, Store,  } from '../interface.d';
import createNamePathKey from './createNamePathKey'

const showData: { [key: string]: FormIsShowData } = {};

export function getShowFormItems(curFormName: string, formStore: Store, formItems: AppFormItemOptions[]): FormItemsUpdateResult {
  let shouldUpdate = false;

  if (!showData[curFormName]) {
    showData[curFormName] = {};
  }

  const newShowData: FormIsShowData = {};
  const cacheShowData = showData[curFormName];

  const recursionItems = (formItem: AppFormItemOptions, index: number) => {
    const { name, formItems: childrenItems, key } = formItem;

    // name 有可能会重复，需要再优化一下 使用 key + name 混合
    let itemKey = key || createNamePathKey(name);

    // 出现重复的 name, React Element key 是不能重复的
    if (typeof getIn(newShowData, name) === 'boolean') {
      itemKey = `${createNamePathKey(name)}${index}`;

      // eslint-disable-next-line no-param-reassign
      formItem.key = itemKey;
    }

    const cacheShowValue: boolean | undefined = cacheShowData[itemKey];
    let { isShow = true } = formItem;

    if (typeof isShow === 'function') {
      isShow = isShow(formStore);

      newShowData[itemKey] = isShow;

      if (cacheShowValue !== isShow) {
        shouldUpdate = true;
      }
    }

    // 子项也要判断
    if (childrenItems) {
      childrenItems.forEach(recursionItems);

      // 由于 AppFormItem 是 PureComponent，要修改值才会重新渲染
      // eslint-disable-next-line no-param-reassign
      formItem.formItems = [...childrenItems];
    }

    return isShow;
  };

  // 过滤掉需要隐藏的 formItems
  const filterShowItems: AppFormItemOptions[] = formItems.filter(recursionItems);

  showData[curFormName] = newShowData;

  return {
    shouldUpdate,
    showItems: filterShowItems,
  };
}

/**
 * 隐藏与显示会影响布局, 其实只有多列布局时才需更新布局
 *
 * @param {AppFormItemOptions[]} formItems
 * @param {FormInstance} form
 * @param {number} colSpan
 * @param {string} [formName]
 * @returns
 */
export default function shouldUpdateFormItems(
  formItems: AppFormItemOptions[],
  form: FormInstance | null,
  formName?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id?: number,
): FormItemsUpdateResult {
  // form 实例还没有，隐藏显示必须要使用 form.getFieldsValue() 值
  // showItems 返回空
  if (!form) {
    return {
      shouldUpdate: false,
      showItems: [],
    };
  }

  const formStore = form.getFieldsValue(true);
  const curFormName = formName || 'raForm';

  return getShowFormItems(curFormName, formStore, formItems);
}
