const initValue = {
  email: '',
  password: '',
  code: '',
  check_token: '',
  checkword: '',
  check: 2
}

const init = () => {
  return initValue
}

interface IState {
  email: string;
  password: string;
  code: string;
  check_token: string;
  checkword: string;
  check: 1 | 2
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