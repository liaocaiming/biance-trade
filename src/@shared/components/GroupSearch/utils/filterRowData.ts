import { IRow } from '../interface';

export  default (rowData: IRow[], searchParams: any): IRow[] => {
  if (!Array.isArray(rowData)) {
    return [];
  }

  const arr = rowData.filter((row: IRow) => {
    const { isSearch } = row;
    let ret = false;

    if (typeof isSearch === 'function') {
      ret = isSearch(searchParams);
    } else if (typeof isSearch === 'boolean') {
      ret = isSearch;
    }
    return ret;
  });

  const rows = arr.length ? arr : rowData;

  return rows
    .map((row: IRow, index: number) => {
      return { ...row, sort: row.sort || index };
    })
    .sort((a: any, b: any) => {
      return a.sort - b.sort;
    });
};
