
export const SessionStorage = {

  setItem: (name: string, data: any) => {
    if (!name) {
      return new Error('name is undefined')
    }

    if (!data) {
      return new Error('name is data')
    }

    return window.sessionStorage.setItem(name, JSON.stringify(data))
  },

  removeItem: (name: string) => {
    if (!name) {
      return new Error('name is undefined')
    }
    return window.sessionStorage.removeItem(name);
  },

  getItem: (name: string) => {
    if (!name) {
      return new Error('name is undefined')
    }
    try {
      const data = window.sessionStorage.getItem(name) || '';
      return JSON.parse(data)
    } catch {
      return new Error('data is error')
    }
  }
}


export const LocalStorage = SessionStorage


export default {
  SessionStorage,
  LocalStorage
}


