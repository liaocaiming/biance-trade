import { Store } from './interface.d'


const initValue: Store = {

}

const init = () => {
  return initValue
}


interface IAction {
  type?: string;
  payload?: object;
}

export {
  init,
  initValue
}

export default (state: Store, action: IAction) => {
  const { payload = {} } = action;
  if (action.type === 'init') {
    return init()
  }
  switch (action.type) {
    case 'init': {
      return init();
    }

    case 'all': {
      return payload;
    }

    default: {
      return { ...state, ...payload }
    }
  }

}