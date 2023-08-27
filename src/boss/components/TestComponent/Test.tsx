import * as React from 'react';

interface IProps {
  val: string;
  info: { name: string; age: number };
}
export default class App extends React.Component<IProps> {
  public render () {
    const { info } = this.props;
    return (
      <div>{info.name}</div>
    )
  }
}