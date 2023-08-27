export default (obj: object) => {
  const res: any = [];
  if (!obj) {
    return res;
  }
  Object.keys(obj).forEach((key: string) => {
    res.push({
      value: key,
      label: obj[key],
    });
  });

  return res;
}
