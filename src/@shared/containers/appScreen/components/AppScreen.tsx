import * as React from "react";

interface IScreenProps {
  actions?: any;
  location?: any;
  method?: 'post' | 'get';
  initOption?: {
    fetchUrl: string;
    params?: object;
    initType?: string;
  };
  [random: string]: any;
}

export default class AppScreen extends React.Component<IScreenProps> {
  constructor(props: IScreenProps) {
    super(props);
  }

  public componentWillMount() {
    const { actions, initOption } = this.props;
    if (initOption) {
      actions.initScreen(initOption);
      if (initOption.params) {
        if (initOption.initType === "actionQuery") {
          actions.changeScreenActionQuery(initOption.params);
          return;
        }
        actions.changeScreenQuery(initOption.params);
      }
    }
  }

  public componentDidMount() {
    const { method = "get", initOption } = this.props;
    const { isFirst = true } = initOption || ({} as any);
    if (initOption && isFirst) {
      this.props.actions.getScreenData({
        method,
      });
    }
  }

  public componentWillUnmount() {
    this.props.actions.leaveScreen();
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}
