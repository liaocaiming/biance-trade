import * as React from "react";

import { connect } from "@shared/containers/appScreen";

import { Card } from "antd";

import { GroupSearch, TableComponent } from "@components/index";

import { reactClassNameJoin } from '@utils/lib/helpers'

import IProps from "@typings/react.d";

import { api } from "@src/boss/config/";

interface IRow {
  title: string;
  dataIndex: string;
}

interface IState {
  rows: IRow[];
  list: any[];
  [key: string]: any;
}

const width = 100;
@connect()
export default class App extends React.PureComponent<IProps, IState> {

  private rowData = [
    {
      title: '币种',
      dataIndex: 'symbol',
      fixed: 'left',
      width: 100,
    },
    {
      title: '价格',
      dataIndex: 'price',
      fixed: 'left',
      width: 100,
    },

    {
      title: '趋势',
      dataIndex: 'qushi',
      children: [
        {
          title: '1分钟',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '3分钟',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '15分钟',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '1小时',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '4小时',
          dataIndex: 'one',
          width,
          key: 'one',
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '12小时',
          dataIndex: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '日线',
          dataIndex: 'one',
          width,
          key: 'one',
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '周线',
          dataIndex: 'one',
          width,
          key: 'one',
          sorter: (a, b) => a.age - b.age,
        },


      ]
    },
    {
      title: '乖离',
      dataIndex: 'qushi',
      children: [
        {
          title: 'cs',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: 'sm',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: 'ml',
          dataIndex: 'one',
          key: 'one',
          width,
          sorter: (a, b) => a.age - b.age,
        },
      ]
    },


  ]

  constructor(props: IProps) {
    super(props);
    this.state = {
      rows: [],
      list: []
    }
  }

  public componentDidMount() {
    // this.getList();
  }

  private handleSearch = (options: any) => {
  };

  private renderSearch() {
    return (
      <GroupSearch
        handleSearch={this.handleSearch}
        selectKeys={["indicators"]}
        defaultValues={{
          coinType: 'USDT'
        }}
        map={{
          coinType: 'coin_type'
        }}

      />
    );
  }

  private renderTable() {
    const { list } = this.state;
    return <TableComponent dataSource={list} columns={this.rowData} pagination={false} scroll={{ y: '70vh', x: 'max-content' }} />;
  }

  private toggleModal = (key: string, value: boolean, item?: any) => {


  }

  public render() {
    return (
      <Card className="bestCoinList">
        {this.renderSearch()}
        {this.renderTable()}
      </Card>
    );
  }
}
