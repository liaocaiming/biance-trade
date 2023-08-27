import * as React from "react";

import { connect } from "@containers/app";

import { renderRoutes } from "react-router-config";

import IProps from "@typings/react.d";

import { pageUrlsTitle } from "@src/mobile/config/routes";

@connect()
export default class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    this.setTitile();
  }

  private setTitile = () => {
    const { history, location } = this.props;
    const { pathname } = location;
    document.title = pageUrlsTitle[pathname];
    history.listen((options) => {
      const { pathname } = options;
      document.title = pageUrlsTitle[pathname];
    });
  };

  public render() {
    return <div className="layout">{renderRoutes(this.props.routes)}</div>;
  }
}
