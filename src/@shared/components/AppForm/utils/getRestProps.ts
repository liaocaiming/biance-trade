
/**
 * 获取剩余的属性，避免多余属性穿透子组件
 *
 * @export
 * @template T
 * @param {T} props
 * @param {string[]} keys
 * @returns {T}
 */
export default function getRestProps<T>(props: T, keys: string[]): T {
  let rest: T = props;

  if (keys.length > 0) {
    // 使用新的对象，避免修改原对象，带来可不预知的问题
    rest = {
      ...props,
    }
    keys.forEach(key => {
      delete rest[key];
    });
  }

  return rest;
}
