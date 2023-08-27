declare function createReducer<T>(options: T, handler:Object): T;

export type ITrim = <T>(arg: T) => T;
export interface IStorage {
  setItem: (name: string, item: any) => void;
  getItem: (name: string) => any;
  removeItem: (name: string) => void;
}