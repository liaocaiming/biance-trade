import { AppFormProps, Store } from '../interface';

/**
 * 需要计算是否需要更新整个 form
 * shouldFormUpdate 调用出错默认返回 Promise<false>
 *
 * @export
 * @param {AppFormProps} props
 * @param {Store} changeStore
 * @param {allStore} allStore
 * @returns {Promise<boolean>}
 */
export default function shouldUpdateForm(
  props: AppFormProps,
  changeStore: Store,
  allStore: Store
): Promise<boolean> {
  const { shouldFormUpdate } = props;

  if (typeof shouldFormUpdate === 'function') {
    return new Promise((resolve: (val: boolean) => void) => {
      const needUpdate = shouldFormUpdate(changeStore, allStore);

      if (typeof needUpdate === 'boolean') {
        resolve(needUpdate);
      } else if (needUpdate && typeof needUpdate.then === 'function') {
        needUpdate
          .then(val => {
            resolve(val);
          })

          // 错误也默认 false
          .catch(() => resolve(false));
      } else {
        resolve(false);
      }
    }).catch(() => false);
  }

  return Promise.resolve(false);
}
