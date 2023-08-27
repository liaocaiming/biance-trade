import React from "react";
import linkPort from "@src/boss/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { constants, socket } from "@utils/index";
import { GroupSearch, TableComponent } from "@components/index";

import "./index.less";

const width = 80;

const list = constants.intervals.map((item) => {
  return {
    value: item,
    label: item,
  };
});

const render = (value: string) => {
  const isWhite =
    value && value.toLocaleLowerCase() === "#ffffff"
      ? "1px solid #ccc"
      : `1px solid ${value || 'transparent'}`;
  return (
    <div className="item" style={{ background: value, border: isWhite }} />
  );
};

interface IState {
  list: any[];
}

const colorMap = {
  "#F00000": 1,
  "#808080": 2,
  "#008000": 3
}

const sorter = (key: string) => {
  if (key.includes('_')) {
    return (a: any, b: any) => (colorMap[a[key]] || 1) - (colorMap[b[key]] || 1);
  }
  return (a: any, b: any) => a[key] - b[key];
};
@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private wss: WebSocket;

  private symbolMap = {}; // 记录每一个币在数组中的index, websocket的时候好处理

  private list: any[] = []; // 记录所有的数据， 用来做socket延时更新处理；

  private timer: any = null;

  private row: any = [
    {
      title: "币种",
      dataIndex: "symbol",
      align: "center",
      fixed: 'left',
      width,
    },
    {
      title: "当前价格",
      dataIndex: "price",
      align: "center",
      sorter: sorter("price"),
      fixed: 'left',
      width,
    },
    {
      title: "趋势",
      dataIndex: "qushi",
      children: [
        {
          title: "1m",
          dataIndex: "1m_trend",
          width,
          render,
          sorter: sorter("1m_trend"),
        },
        {
          title: "3m",
          dataIndex: "3m_trend",
          width,
          render,
          sorter: sorter("3m_trend"),
        },
        {
          title: "5m",
          dataIndex: "5m_trend",
          width,
          render,
          sorter: sorter("5m_trend"),
        },
        {
          title: "15m",
          dataIndex: "15m_trend",
          width,
          render,
          sorter: sorter("15m_trend"),
        },
        {
          title: "30m",
          dataIndex: "30m_trend",
          width,
          render,
          sorter: sorter("30m_trend"),
        },
        {
          title: "1h",
          dataIndex: "1h_trend",
          width,
          render,
          sorter: sorter("1h_trend"),
        },
        {
          title: "4h",
          dataIndex: "4h_trend",
          width,
          render,
          sorter: sorter("4h_trend"),
        },
        {
          title: "12h",
          dataIndex: "12h_trend",
          width,
          render,
          sorter: sorter("12h_trend"),
        },
        {
          title: "1d",
          dataIndex: "1d_trend",
          width,
          render,
          sorter: sorter("1d_trend"),
        },
        {
          title: "1w",
          dataIndex: "1w_trend",
          width,
          render,
          sorter: sorter("1w_trend"),
        },
      ],
    },
    {
      title: "乖离",
      dataIndex: "guaili",
      children: [
        {
          title: "cs",
          dataIndex: "cs",
          width,
          sorter: sorter("cs"),
        },
        {
          title: "sm",
          dataIndex: "sm",
          width,
          sorter: sorter("sm"),
        },
        {
          title: "ml",
          dataIndex: "ml",
          width,
          sorter: sorter("ml"),
        },
      ],
    },
  ];

  private searchRow: any[] = [
    {
      title: "周期",
      dataIndex: "period",
      type: "select",
      list,
    },
    {
      title: "校验类型",
      dataIndex: "s_type",
      type: "select",
      // 现货:1,合约:3
      list: [
        {
          value: "1",
          label: "现货",
        },
        {
          value: "3",
          label: "合约",
        },
      ],
    },
    {
      title: "币种",
      dataIndex: "symbol",
      type: "select",
      // 现货:1,合约:3
      eleAttr: {
        mode: "tags",
      },
    },
    {
      title: "交易对",
      dataIndex: "asset",
      type: "select",
      // 现货:1,合约:3
      list: [
        {
          value: 'btc',
          label: "btc",
        },
        {
          value: "usdt",
          label: "usdt",
        },
      ],
    },
  ];

  constructor(props: IProps) {
    super(props);
    this.state = {
      list: [],
    };
  }

  // componentDidMount() {
  //   this.socketStart();
  // }

  componentWillUnmount() {
    this.wss && this.wss.close && this.wss.close();
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        list: [...this.list]
      })
    }, 10000)
  }

  private socketStart = (open?: () => void) => {
    this.wss = socket({
      // url: "ws://47.74.177.128/cable",
      url: "cable",
      // url: "ws://47.74.250.66/cable", // 调试
      channel: "TrendDataChannel",
      message: (data: any) => {
        const list = this.list.slice();
        const { message = {} } = data || {};
        const { symbol } = message;
        const index = this.symbolMap[symbol];

        if (
          list.length > 0 &&
          symbol &&
          index !== undefined &&
          list[index] &&
          list[index].symbol === symbol
        ) {
          list[index] = { ...list[index], ...message };
          this.list = list;
        }
      },
      open: () => {
        open && open();
      },
    });
  };

  private handleSearch = (params: any) => {
    this.getListData(params);
  };

  private getListData = (params: any) => {
    const { actions } = this.props;
    this.wss && this.wss.close && this.wss.close();
    actions.post(linkPort.excel_data, params).then((res) => {
      const { data = [] } = res || {};
      if (data.length > 0) {
        const symbols: any[] = [];
        data.forEach((item, index: number) => {
          const { symbol } = item;
          this.symbolMap[symbol] = index;
          symbols.push(symbol);
        });

        const obj = {
          channel: "TrendDataChannel",
          ...params,
          symbol: symbols,
        };

        const query = {
          command: "subscribe",
          identifier: JSON.stringify(obj),
        };

        const msg = JSON.stringify(query);

        this.socketStart(() => {
          this.wss.send(msg);
        });

        this.list = data;
        this.setState({
          list: data,
        });
      }
    });
  };

  renderGroupSearch = () => {
    return (
      <div>
        <GroupSearch
          isShowResetBtn
          handleSearch={this.handleSearch}
          rowData={this.searchRow}
        />
      </div>
    );
  };

  renderTable = () => {
    const { list } = this.state;
    return (
      <div>
        <TableComponent
          columns={this.row}
          pagination={false}
          dataSource={list}
          scroll={{ x: 'max-content', y: '74vh' }}
        />
      </div>
    );
  };

  public render() {
    return (
      <div className="iconSelectList">
        {this.renderGroupSearch()}
        {this.renderTable()}
      </div>
    );
  }
}
