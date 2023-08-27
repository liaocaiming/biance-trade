export default (obj: any, attrs: string[]) => {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (!attrs.includes(key)) {
      res[key] = obj[key]
    }
  })

  return res;
}

