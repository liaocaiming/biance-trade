
import { IRow } from '../interface';

export  default (rowData: IRow[], key: string) => {
  if (!Array.isArray(rowData) || rowData.length === 0) {
    return {};
  }
   return rowData.find((item) => {
    const dataIndex = item.searchDataIndex || item.dataIndex || item.name;
    return dataIndex === key
   }) || {}
}
