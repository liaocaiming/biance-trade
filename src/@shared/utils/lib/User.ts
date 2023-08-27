import Storage from './Storage';

const User = {
  name: 'boss',
  user: {
    username: 'admin',
    password: '111'
  },
  isLogin: () => {
    const userInfo = User.getUserInfo()
    return userInfo.token
  },
  getUserInfo: () => {
    const userInfo = window.localStorage.getItem('userInfo') || "{}";
    return JSON.parse(userInfo)
  },
  saveUserInfo: (userInfo: any) => {
    window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },
  removeUserInfo: () => {
    window.localStorage.removeItem('userInfo')
  },
  setListItem: (data: any) => {
    Storage.SessionStorage.setItem('listItem', data)
  },
  getListItem: () => {
    return Storage.SessionStorage.getItem('listItem');
  },
  removeListItem: () => {
    return Storage.SessionStorage.removeItem('listItem')
  }
}

export default User;