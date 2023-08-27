


   export default (chinaAreaList:any[]) => {
    const filterRegionList = chinaAreaList.map((item: any) => {
      const newItem = { ...item };
      const childrenList = item.children || [];
      const newItem2 = childrenList.map((item2: any) => {
        const { label, value, key } = item2;
        return {
          label,
          value,
          key,
        };
      });
      newItem.children = newItem2;
      return newItem;
    });
    return filterRegionList;
  };
