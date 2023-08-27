import * as React from 'react';

interface IState {
  hasError: boolean; 
  errMsg: string;
}


export default class ErrorBoundary extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errMsg: '' };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  public componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    this.setState({
      errMsg: JSON.stringify(errorInfo)
    })

    console.log(error, 'error')
    console.log(errorInfo, 'errorInfo')
  }

  public render() {
    const { hasError, errMsg } = this.state;
    if (hasError) {
      // 你可以自定义降级后的 UI 并渲染
    return <h1>{errMsg}</h1>;
    }

    return this.props.children; 
  }
}