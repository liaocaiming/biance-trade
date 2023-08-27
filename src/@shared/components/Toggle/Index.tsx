import * as React from 'react';

interface IToggle {
  isShow?:boolean;
  children:any;
}

export default class Toggle extends React.Component<IToggle> {
  constructor(props: IToggle) {
    super(props);
  }
  public render() {
    const { isShow, children } = this.props
    if (isShow) {
      return children
    }
    return null
  }
}
