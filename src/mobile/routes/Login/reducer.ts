const initValue = {
  binance_user_id: '', username: '', password: ''
}

const init = () => {
  return initValue
}

interface IState {
  binance_user_id?: string;
  username: string;
  password: string;
}

interface IAction {
  type?: string;
  payload?: object;
}

export {
  init,
  initValue
}

export default (state: IState, action: IAction) => {
  const { payload = {} } = action;
  if (action.type === 'init') {
    return init()
  }

  return { ...state, ...payload }
}