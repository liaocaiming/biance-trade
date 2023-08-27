import { IRow } from '../interface';


export default  (rowData: IRow[] | undefined, searchParams: any): any => {
  const res: any = { ...searchParams };
  if (!Array.isArray(rowData)) {
    return searchParams;
  }

  rowData.forEach((row: IRow) => {
    let isShow: any = row.isSearch;
    const dataIndex: string = row.searchDataIndex || row.dataIndex || row.name || '';
    if (isShow && typeof isShow === 'function') {
      isShow = isShow(res);
    }

    if (isShow === false) {
      delete res[dataIndex];
    }
  });
  return res;
}
