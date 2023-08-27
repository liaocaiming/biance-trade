interface IList {
  value: string;
  label: string;
}

export default (arr: IList[]) => {
  const res = {};
  if (!Array.isArray(arr) || arr.length === 0) {
    return res
  }
  arr.forEach((item) => {
    res[item.value] = item.label
  })
  return res;
}
