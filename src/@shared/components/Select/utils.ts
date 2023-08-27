export const valueOnSearch = (options: {
  searchFn: (params?: any) => void;
  searchKey: string;
  wait?: number;
  emptyFn?: () => void;
}) => {
  let timeout: any = null;
  const { searchFn, emptyFn, searchKey, wait = 500 } = options;

  return (value: string) => {
    if (!value) {
      emptyFn && emptyFn();
      clearTimeout(timeout);
      timeout = null;

      return;
    }


    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      searchFn({ [searchKey]: value });
    }, wait);
  };
};

export const filterAttr = (obj: Object, keys: string[]) => {
  const res = {};
  Object.keys(obj).forEach((key: string) => {
    if (!keys.includes(key)) {
      res[key] = obj[key]
    }
  })
  return res;
}
