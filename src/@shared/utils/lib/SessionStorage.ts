import {IStorage} from '../interface';

const fezsSessionStorage: IStorage = {
  setItem: (name: string, item: any) => {
    if (name && item) {
      const itemString = JSON.stringify(item);
      window.sessionStorage.setItem(name, itemString);
    } else {
      // tslint:disable-next-line:no-console
      console.error('请检查你的数据');
    }
  },
  getItem: (name: string) => {
    if (name) {
      const item = window.sessionStorage.getItem(name);
      if (item) {
        return JSON.parse(item);
      }
        // tslint:disable-next-line:no-console
        console.error('请检查你的数据');


    } else {
      // tslint:disable-next-line:no-console
      console.error('请检查你的数据');

    }
  },
  removeItem: (name: string) => {
    if (name) {
      window.sessionStorage.removeItem(name);
    } else {
      // tslint:disable-next-line:no-console
      console.error('请检查你的数据');
    }
  }
};

export default fezsSessionStorage;
