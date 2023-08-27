type IIsArray = (arr: any) => boolean

export function isArray(arg: any): boolean {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

const isArrayOrigin: IIsArray = typeof Array.isArray === 'function' ? Array.isArray : isArray

export default isArrayOrigin
