export default function getInitialValue(val: any, numberToString?: boolean) {
  let ret = val;

  if (numberToString && typeof val === 'number') {
    ret = `${val}`;
  }

  return ret;
}
