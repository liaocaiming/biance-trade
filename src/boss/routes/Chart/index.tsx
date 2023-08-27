import * as React from "react";

import { connect } from "@shared/containers/appScreen";

import dateFormat from "@utils/lib/dateFormat";

import { Select } from 'antd';

import {api}  from '@src/boss/config'

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from "recharts";


const { Option } = Select;

interface IProps {
  [random: string]: any;
}

interface IList {
  date_time: number;
  close?: number;
  rate?: number;
}

interface IState {
  data: IList[];
  listData: IRateList[];
  rateData: IList[];
  selected: string;
}

interface IRateList {
  time?: number;
  markPrice?: number;
  lastFundingRate?: number;
  symbol: string;
}

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: [],
      rateData: [],
      selected: 'BTCUSDT',
      listData: []
    };
  }

  public componentDidMount() {
    const { selected } = this.state;
    this.getData(selected);
    this.getRoitaData();
  }

  public getData = (symbol: string) => {
    const { actions } = this.props;
    actions.get(api.results, { symbol }).then((res: any) => {
      const { funding_rate = [], k_data } = res || {};
      this.setState({
        data: k_data,
        rateData: funding_rate,
      });
    });
  };

  public getRoitaData = () => {
    const { actions } = this.props;
    actions.get(api.realtime).then((res: any) => {
      this.setState({
        listData: res || [],
      });
    });
  };


  public renderLineChart = (
    data: any[],
    YDataKey: "rate" | "close" = "rate"
  ) => {
    if (!Array.isArray(data)) {
      return <span>没有数据</span>;
    }
    const res = data.map((item: any) => {
      if (YDataKey === "rate") {
        return {
          ...item,
          date_time: dateFormat("YY-MM-DD hh", item.date_time),
          rate: item.rate * 100,
        };
      }
      return {
        ...item,
        date_time: dateFormat("YY-MM-DD hh", new Date(item.date_time)),
      };
    });
    return (
      <LineChart width={1800} height={400} data={res}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date_time" interval="preserveStart" />
        <YAxis dataKey={YDataKey} interval="preserveStart" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={YDataKey} stroke="#82ca9d" />
      </LineChart>
    );
  };


  public renderAllChart = (
    data: any[],
  ) => {
    if (!Array.isArray(data)) {
      return <span>没有数据</span>;
    }
    const res = data.map((item: any) => {
      return {
        ...item,
        date_time: dateFormat("YY-MM-DD hh", item.date_time),
        rate: item.rate * 100,
      };
    });


    return (
      <LineChart width={1800} height={400} data={res}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis  dataKey="date_time" interval="preserveStart" />
        <YAxis yAxisId="left"  dataKey='close' />
        <YAxis  yAxisId="right"  dataKey='rate' orientation="right"  />

        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey='close' stroke="orange"  dot=''/>
        <Line yAxisId="right" type="monotone" dataKey='rate' stroke="#82ca9d" dot='' />
      </LineChart>
    );
  };


  public renderAntLineChart = (data: any[], YDataKey: "rate" | "close" = "rate") => {

  }

  public onSelectChange = (value: any) => {
    console.log(value, 'value')
    this.getData(value);
    this.setState({
      selected: value
    })
  };

  public renderSelect = (data: IRateList[]) => {
    const  { selected } = this.state
    return (
      <div>
        <span style={{ marginRight: 10}} >交易对</span>
        <Select style={{ width: '300px' }} defaultValue={selected} onChange={this.onSelectChange} >
          {
            data.map((it) => {
            return <Option value={it.symbol} key={it.symbol}>{it.symbol}</Option>
            })
          }
        </Select>
      </div>
    )
  }

  public render() {
    const { data = [], rateData = [], listData } = this.state;
    const res = data.map((item: any, index: number) => {
      return { ...item, ...rateData[index]}
    })

    return (
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          position: "relative",
        }}
      >
        {this.renderSelect(listData)}

        <div style={{ padding: '50px 50px 50px 0', overflow: 'auto' }}>
          {this.renderAllChart(res)}
        </div>
      </div>
    );
  }
}
