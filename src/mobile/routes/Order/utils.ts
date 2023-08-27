export function validatorParams(values: any) {
  let res = {};
  if (!values) {
    return res;
  }

  Object.keys(values).forEach((key: string) => {
    if (key.indexOf('@') >= 0) {
      const [k, id] = key.split('@');
      if (res[k]) {
        res[k][id] = values[key]
      } else {
        res[k] = [];
        res[k][id] = values[key];
      }
    } else {
      Object.assign(res, { [key]: values[key] })
    }
  })
  return res
}