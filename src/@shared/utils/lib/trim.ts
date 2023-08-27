import isObject from './isObject';

import { ITrim } from '../interface';

const trim: ITrim = (arg: any) => {
  if (!isObject(arg)) {
    return arg;
  }
  const res = {};
  Object.keys(arg).forEach((key: string) => {
    if (typeof arg[key] === 'string') {
      res[key] = arg[key].trim();
    } else {
      res[key] = arg[key];
    }
  });

  return res;
};

export default trim;
