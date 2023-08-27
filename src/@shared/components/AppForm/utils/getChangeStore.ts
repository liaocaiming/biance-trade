import { Store } from '../interface.d';
import getValue from './getItemValue';

interface ChangeProps {
  prev: Store;
  next?: Store;
  showKeyMap?: Store;
  numberToString: boolean;
}

// 获取 update Store 变化
export default function getChangeStore({ prev, next, showKeyMap, numberToString }: ChangeProps): null | Store {
  let ret: Store = {};

  if (!next) {
    return null;
  }

  if (prev) {
    const nextKeys = next ? Object.keys(next) : [];

    nextKeys.forEach(curKey => {
      let nextVal = next[curKey];
      const prevVal = prev[curKey];

      nextVal = getValue(nextVal, numberToString);

      if (typeof nextVal !== 'undefined' && nextVal !== prevVal) {
        ret[curKey] = nextVal;
        // 更新值后需要同步一下，避免多次渲染
        next[curKey] = nextVal;
      }
    });
  } else {
    ret = next;
  }

  return Object.keys(ret).length > 0 ? ret : null;
}
