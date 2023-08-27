import { NamePath } from '../interface.d';

export default function createNamePathKey(namePath: NamePath): number | string {
  let ret: number | string;

  if (Array.isArray(namePath)) {
    ret = namePath.join('.');
  } else {
    ret = namePath;
  }

  return ret;
}
