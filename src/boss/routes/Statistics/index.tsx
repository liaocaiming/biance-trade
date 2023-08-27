import * as React from "react";

import { connect } from "@src/boss/reducers/index";

import dateFormat from "@utils/lib/dateFormat";

import { Select, Card } from 'antd';

import { api } from '@src/boss/config'

import IProps from '@typings/react';

import { GroupSearch } from '@components/index'

import { getSearchData }  from '@utils/lib/helpers'

import { intervals } from '@utils/lib/constants';

interface IState {
  forceOrders: any[]; // 市场强平订单
  openInterest: any; // 未平仓合约数
  openInterestHist: any; // 合约持仓量
  longShortAccountRatio: any; // 大户账号数多空比；
  longShortPositionRatio: any, // 大户持仓量多空币 
  longShortUserRatio: any, // 多空持仓人数比
  longShortTakerRatio: any, // 合约主动买卖量
  [key:string]: any;
}

interface IPort {
  url: string;
  key: 'forceOrders' | 'openInterest' | 'openInterestHist' | 'longShortAccountRatio' | 'longShortPositionRatio' | 'longShortUserRatio' | 'longShortTakerRatio';
  params: any;
}

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private rowData: any = [
    {
      title: '交易币',
      dataIndex: 'symbol',
      fieldNames: { value: 'symbol', label: 'symbol' }
  
    },
    {
      title: '周期',
      dataIndex: 'period',
    }
  ]
  constructor(props: IProps) {
    super(props);
    this.state = {
      forceOrders: [],
      openInterest: {},
      openInterestHist: {},
      longShortAccountRatio: {},
      longShortPositionRatio: {},
      longShortUserRatio: {},
      longShortTakerRatio: {}
    };
  }
  public componentDidMount() {
    const { actions } = this.props;
    actions.getSymbol();
  }

  private getData = (data: IPort[]) => {
    const { actions } =this.props;
    data.forEach((item) => {
      actions.get(item.url, item.params).then((res: any) => {
        if (res) {
          this.setState({
            [item.key]: res
          })
        }
      })
    })
  }

  private handleSearch1 = (params: any) => {
    const list: IPort[] = [
      {
        url: api.force_orders,
        key: 'forceOrders',
        params
      },
      {
        url: api.open_interest,
        key: 'openInterest',
        params
      }
    ]

    this.getData(list);
  }


  private handleSearch2 = (params: any) => {
    const list: IPort[] = [
      {
        url: api.open_interest_hist,
        key: 'openInterestHist',
        params
      },
      {
        url: api.long_short_account_ratio,
        key: 'longShortAccountRatio',
        params
      },
      {
        url: api.long_short_position_ratio,
        key: 'longShortPositionRatio',
        params
      },
      {
        url: api.long_short_user_ratio,
        key: 'longShortUserRatio',
        params
      },
      {
        url: api.long_short_taker_ratio,
        key: 'longShortTakerRatio',
        params
      },
      {
        url: api.depth,
        key: 'longShortTakerRatio',
        params: {
          ...params,
          limit: 10
        }
      }
    ]

    this.getData(list);
    this.handleSearch1(params)
  }


  private renderSearch(opptions: { rowData: any, handleSearch: (params) => void}) {
    const symbolList = this.props.$$boss.getIn(['symBolList']).toJS() || [];
    const { rowData, handleSearch } = opptions;

    return (
      <div>
        <GroupSearch
          rowData={rowData}
          handleSearch={handleSearch}
          selectMap={{
            symbol: symbolList,
            period: intervals
          }}
        />
      </div>
    )
  }

  public render() {

    return (
      <div>
        <Card title='市场强平订单和未平合约数'>
          {this.renderSearch({
            rowData: getSearchData(this.rowData, ['symbol']),
            handleSearch: this.handleSearch1
          })}
        </Card>

        <Card title='合约数数据统计'>
          {this.renderSearch({
            rowData: this.rowData,
            handleSearch: this.handleSearch2
          })}
        </Card>
      </div>
    );
  }
}
