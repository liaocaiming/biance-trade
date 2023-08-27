export interface IBossActions {
  getSymbol: (opions?: { url?: string, method: 'get' | 'post' }) => Promise<any>
}