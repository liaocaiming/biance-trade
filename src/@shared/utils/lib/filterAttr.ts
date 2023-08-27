export default (obj: object, attrs: string[]): any => {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (attrs.indexOf(key) < 0) {
      res[key] = obj[key]
    }
  })

  return res
}