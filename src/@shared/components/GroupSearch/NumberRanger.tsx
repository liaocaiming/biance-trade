import * as React from "react";

import { InputNumber } from "antd";

import "./numberRanger.less";

interface IRow {
  dataIndex: string;
  [k: string]: any;
}

interface IProps {
  row: IRow;
  searchParams: object;
  onChange: (it: IRow) => (e: any) => void;
}

export default class NumberRanger extends React.PureComponent<IProps> {
  public render() {
    const { row, searchParams, onChange } = this.props;
    const { dataIndex } = row || {};
    const keys = dataIndex.split("_");
    if (keys.length < 1) {
      console.error("您的dataIndex || searchDataIndex 传的有问题哦");
    }

    const [key1, key2] = keys;

    return (
      <span className="fe-numberRanger">
        <InputNumber
          placeholder="请输入"
          value={searchParams[key1]}
          onChange={onChange({ dataIndex: key1 })}
        />
        <i className="line" />
        <InputNumber
          placeholder="请输入"
          value={searchParams[key2]}
          onChange={onChange({ dataIndex: key2 || key1 })}
        />
      </span>
    );
  }
}
