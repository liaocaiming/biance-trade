
export default (data: any[], value: any, key = 'value') => {
  let res = {}
  if (value === undefined || !Array.isArray(data) || data.length === 0) {
    return res;
  }
  return data.find(it => it[key] == value)
}