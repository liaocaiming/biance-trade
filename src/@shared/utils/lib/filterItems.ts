//  过滤数组里面的想
interface IList {
  dataIndex?: string;
  name?: string;
  [key: string]: any
}



interface IOptions {
  list: IList[];
  keys: string[];
  direction?: boolean; // true 表示要过滤的数据, false, 表示要获取的数据
  key?: 'name' | 'dataIndex'
}

export default (options: IOptions) => {
  const { list = [], keys = [], direction = true, key = 'name' } = options;
  if (direction) {
    return list.filter((item) => {
      return !keys.includes(item[key] || '')
    })
  }

  return list.filter((item) => {
    return keys.includes(item[key] || '')
  })
}