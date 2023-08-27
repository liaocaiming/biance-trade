import * as React from "react";

import { connect } from "@shared/containers/appScreen";

import { Card, message } from "antd";

import "./index.less";

import { GroupSearch, TableComponent, Toggle } from "@components/index";

import ChartModal from './ChartModal';

import {
  types,
  indicators,
  defaultTableRows,
  searchRows,
  filterTypes,
  coinTypes
} from "./constants";

import { intervals } from '@utils/lib/constants'

import { add, sub, mul, div } from "@utils/lib/calculate";

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
  isShow: boolean;
  [key: string]: any;
}

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private indicators = [];
  private chartOptions: any = {
    symbol: 'BTCUSDT',
    interval: '1h'
  };

  private options = [
    {
      title: '涨幅(close-open)/close',
      dataIndex: 'diffRate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.diffRate - b.diffRate,
      render: (val: any) => {
        const value = parseFloat(val && val.toFixed(3))
        return <span className={reactClassNameJoin([value > 0 ? 'green' : 'red', 'diff']) }>{value > 0 ? `+${value} %` : `${value} %` }</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (value: string, record: any) => {
        return <a onClick={this.toggleModal('isShow', true, record)}>打开看图表</a>
      }
    }
  ]

  constructor(props: IProps) {
    super(props);
    this.state = {
      rows: defaultTableRows,
      list: [],
      isShow: false,
    };
  }

  public componentDidMount() {
    // this.getList();
  }

  private getList(params: any) {
    const { actions } = this.props;
    actions.get(`${api.get_indicators}`, params).then((data: any[]) => {
      const { indicators, filterType } = params;
      const arr = indicators.toString().match(/(\d+)/g);
      const max = Math.max.apply(null, arr);
      // const min = Math.min.apply(null, arr);
      const maxKey = indicators.find((key: string) => key.indexOf(max) >= 0);
      // const minKey = indicators.find((key: string) => key.indexOf(min) >= 0);

      let res: any[] = [];

      data.forEach((item: any) => {
        const { price = [] } = item || {};
        const [first = {}] = price || [];
        const { close, open } = first;
        const maxValue = item[maxKey];
        let obj = {};
        let is = true;
        indicators.forEach((key: string) => {
          if (item[key] === null || item[key] === undefined) {
            is = false;
          }
          if (maxKey !== key) {
            if (String(filterType) === "1") {
              // 上穿
              if (sub(item[key], maxValue) < 0) {
                is = false;
              }
              // 1: "上穿",  2: "下穿",
            } else if (String(filterType) === "2") {
              if (sub(item[key], maxValue) > 0) {
                is = false;
              }
            } else {
            }
          }
          Object.assign(obj, {
            [`${key}_price`]: sub(close, item[key]),
            [`${key}_rate`]: mul(div(sub(close, item[key]), close), 100),
            close,
            diffRate: mul(div(sub(close, open), close), 100)
          });
        });

        if (is) {
          res.push({ ...item, ...obj });
        }
      });

      this.setState({
        list: res,
      });
    });
  }

  private handleSearch = (options: any) => {
    let rows = defaultTableRows.slice();
    if (!options.interval) {
      message.warn("请选择周期");
      return;
    }

    if (!options.indicators) {
      message.warn("请选择指标");
      return;
    }
    if (
      JSON.stringify(options.indicators) !== JSON.stringify(this.indicators)
    ) {
      this.indicators = options.indicators;
      const indicators: any[] = []
       this.indicators.forEach((it: string) => {
        indicators.push({
          title: it,
          dataIndex: it,
          render: (value: number, item: any) => {
            const diff = item[`${it}_price`];
            return (
              <div>
                <span>{value}</span>
                <Toggle isShow={diff}>
                  <span className={reactClassNameJoin([diff > 0 ? 'green' : 'red', 'diff']) }>({diff > 0 ? `+${diff} ` : `${diff} ` })</span>
                </Toggle>
              </div>
            );
          },
        },
        {
          title: `${it} / close`,
          dataIndex: `${it}_rate`,
          defaultSortOrder: 'descend',
          sorter: (a, b) => a[`${it}_rate`] - b[`${it}_rate`],
          render: (val: any, item: any) => {
            const value = parseFloat(val && val.toFixed(3));

            return (
              <div>
                <Toggle isShow={!!value}>
                  <span className={reactClassNameJoin([value > 0 ? 'green' : 'red', 'diff']) }>{value > 0 ? `+${value} %` : `${value} %` }</span>
                </Toggle>
              </div>
            );
          },
        })
      });
      rows = rows.concat(indicators).concat(this.options);

      this.setState(
        () => {
          return { rows };
        });
    }

    Object.assign(this.chartOptions, { interval: options.interval });
    this.getList(options);
  };

  private renderSearch() {
    return (
      <GroupSearch
        rowData={searchRows}
        handleSearch={this.handleSearch}
        selectKeys={["indicators"]}
        defaultValues={{
          coinType: 'USDT'
        }}
        map={{
          coinType: 'coin_type'
        }}
        selectMap={{
          filterType: filterTypes,
          interval: intervals,
          type: types,
          indicators,
          coinType: coinTypes
        }}
      />
    );
  }

  private renderTable() {
    const { rows, list } = this.state;
    return <TableComponent dataSource={list} columns={rows} pagination={false} scroll={{ y: '70vh' }}/>;
  }

  private toggleModal = (key: string, value: boolean, item?: any) => {
    return () => {
      if (item) {
        Object.assign(this.chartOptions, { symbol: item.symbol})
      }
      this.setState({
        [key]: value
      })
    }
  }

  private renderChartModal () {
    const { isShow } = this.state;
    const { interval, symbol } = this.chartOptions;
    if (!isShow) {
      return null;
    }
    return (
      <ChartModal isShow={isShow}  interval={interval} symbol={symbol} onClose={this.toggleModal('isShow', false)}/>
    )
  }

  public render() {
    return (
      <Card className="bestCoinList">
        {this.renderSearch()}
        {this.renderTable()}
        {this.renderChartModal()}
      </Card>
    );
  }
}
