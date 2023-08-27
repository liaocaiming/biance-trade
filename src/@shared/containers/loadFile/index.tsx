import { Spin } from 'antd';
import * as React from 'react';

interface IState {
  component: any
}

interface ILoadOptions {
  load: () => Promise<any>;
  loading?: any
}

/**
 * 获取异步加载的组件
 *
 * @export
 * @param {{ load: () => Promise<any> }} options
 * @returns
 */
export default function getComponent(options: ILoadOptions) {
  return class FeLoadable extends React.Component<any, IState> {
    constructor(props: any) {
      super(props);
      this.state = {
        component: null
      };
    }

    public componentDidMount () {
      // 注意这里使用 Promise 对象;
      // mod.default导出默认
      options.load().then((mod: any) => {
        this.setState({
          component: mod.default ? mod.default : mod
        });
      });
    }

    public render() {
      const ModuleComponent = this.state.component;

      return this.state.component ? <ModuleComponent {...this.props} /> : <Spin spinning />;
    }
  }
}
