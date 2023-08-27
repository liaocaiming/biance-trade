interface IRowData {
  name: string;
  label: string
}

interface IList {
  dataIndex: string;
  title: string;
}

export default (data: IRowData[]): IList[] => {
  if (!Array.isArray(data)) {
    return []
  }
  return data.map((item) => {
    return { dataIndex: item.name, title: item.label }
  })
}