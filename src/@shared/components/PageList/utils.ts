
export function getSearchData(data: any) {
  if (!Array.isArray(data) || data.length === 0) {
    return []
  }
  return data
    .filter((item) => item.isSearch)
    .map((it: any, index: number) => Object.assign(it, { sortKey: it.sortKey || index }))
    .sort((a: any, b: any) => a.sortKey - b.sortKey)
}
