const hasOwnProperty = Object.prototype.hasOwnProperty;
export default (initialState:object, handlers:object) => {
  return  (state = initialState, action) => {
    if (hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}