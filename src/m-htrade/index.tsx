import * as React from "react";

import * as ReactDOM from "react-dom";

import App from "@components/AppRoot";

import { HashRouter as Router } from "react-router-dom";

import { reducers, routes } from "./config";

import { Provider } from "react-redux";

import rem from "@utils/lib/rem";

// import VConsole from 'vconsole';

// new VConsole()


rem(375, 100);

import { createStore, applyMiddleware, combineReducers } from "redux";

import reduxThunk from "redux-thunk";

import "./index.less";

import './index.css';

const remoteActionMiddleware = applyMiddleware(reduxThunk)(createStore);

const mountNode: HTMLElement = document.getElementById("app") as HTMLElement;

// Store
const store = remoteActionMiddleware(
  combineReducers({
    ...reducers,
  }),

  // 支持 chrome 插件 Redux DevTools
  // tslint:disable-next-line:no-string-literal
  window["devToolsExtension"] ? window["devToolsExtension"]() : (f: any) => f
);

document.body.addEventListener("focusout", () => {
  document.body.scrollTop = document.body.scrollTop;
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App config={{ routes }} />
    </Router>
  </Provider>,
  mountNode
);
