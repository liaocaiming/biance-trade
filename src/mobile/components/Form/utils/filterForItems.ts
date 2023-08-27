import { FormItemOptions, Store } from '../interface.d';

export default (formItems: FormItemOptions[], data: Store): FormItemOptions[] => {
  if (!formItems || !Array.isArray(formItems)) {
    return [];
  }

  return formItems.filter((formItem) => {
    let { isShow } = formItem;
    if (typeof isShow === 'function') {
      isShow = isShow(data)
    }

    return !(isShow === false)
  })
}