import * as React from "react";
import dateFormat from "@utils/lib/dateFormat";
import "./index.less";
import { api } from "@src/boss/config";
import { Chart } from "@antv/g2";
import { searchRowData, coinType } from "./constants";
import { connect } from "@src/boss/reducers/index";
import formatNumber from "@utils/lib/formatNumber";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, LabelList, LineChart, Line, } from "recharts";
import { GroupSearch, Toggle } from "@components/index";
import { intervals } from "@utils/lib/constants";

interface IPort {
  url: string;
  key:
  | "forceOrders"
  | "openInterest"
  | "openInterestHist"
  | "longShortAccountRatio"
  | "longShortPositionRatio"
  | "longShortUserRatio"
  | "longShortTakerRatio";
  params: any;
}

interface IProps {
  [random: string]: any;
}

interface IList {
  time?: number;
  markPrice?: number;
  lastFundingRate?: number;
  symbol?: string;

  [k: string]: any;
}

interface IState {
  rateData: IList[];
  selectedData: IList[];
  selectedUsdt: string;
  selectedMap: { [k: string]: IList[] };
  forceOrders: any[]; // 市场强平订单
  openInterest: any; // 未平仓合约数
  openInterestHist: any; // 合约持仓量
  longShortAccountRatio: any; // 大户账号数多空比；
  longShortPositionRatio: any; // 大户持仓量多空币
  longShortUserRatio: any; // 多空持仓人数比
  longShortTakerRatio: any; // 合约主动买卖量
  [k: string]: any;
}

const map = {}; // 记录页面打开后的数据
@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private singleFirst: boolean = false;

  private chart: any = null;
  private singleChart: any = {};

  constructor(props: IProps) {
    super(props);
    this.state = {
      rateData: [],
      selectedData: [],
      selectedUsdt: "",
      selectedMap: {},
      forceOrders: [],
      openInterest: {},
      openInterestHist: {},
      longShortAccountRatio: {},
      longShortPositionRatio: {},
      longShortUserRatio: {},
      longShortTakerRatio: {},
    };
  }

  componentDidMount() {
    this.getBookTicker();
    this.getData(true);
    setInterval(() => {
      this.getData();
    }, 60 * 1000);

    this.singleChart = new Chart({
      container: "single-container",
      autoFit: true,
      height: 500,
      limitInPlot: false,
      localRefresh: true,
      padding: [100, 100, 100, 100],
    });
  }

  getData = (isFirst?: boolean) => {
    const { actions } = this.props;
    actions.get(api.v1PremiumIndex, {}, { showLoading: false, mode: 'cors', }).then((res: any) => {
      const data =
        Array.isArray(res) &&
        res.map((item: any) => {
          const it = { ...item, symbol: item.symbol.split("USDT")[0] };
          const { symbol } = it;
          if (map[symbol]) {
            if (map[symbol].length > 500) {
              map[symbol].shift();
            }
            map[symbol].push(it);
          } else {
            map[symbol] = [it];
          }
          return it;
        });

      this.renderAntLineChart(data || []);
    });
  };

  public BarChartOnClick = (e: any) => {
    const { selectedMap } = this.state;
    const { data = { data: {} } } = e || {};
    const { symbol } = data.data || {};
    this.setState({
      selectedData: map[symbol],
      selectedUsdt: symbol,
      selectedMap: {
        ...selectedMap,
        [symbol]: map[symbol],
      },
    });
  };

  public renderBarChart = (
    data: any[],
    YDataKey: "rate" | "lastFundingRate" = "lastFundingRate"
  ) => {
    if (!Array.isArray(data)) {
      return <span>没有数据</span>;
    }

    const res = data
      .map((item: any) => {
        return {
          ...item,
          lastFundingRate: item.lastFundingRate * 100,
        };
      })
      .sort((a, b) => a.lastFundingRate - b.lastFundingRate);

    return (
      <BarChart
        width={80 * res.length}
        height={200}
        data={res}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        onClick={this.BarChartOnClick}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* <XAxis dataKey="symbol" /> */}
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={YDataKey} fill="#8884d8">
          <LabelList dataKey="symbol" position="top" />
        </Bar>
      </BarChart>
    );
  };

  public renderLineChart = (data: any[]) => {
    if (!Array.isArray(data) || data.length == 0) {
      return null;
    }
    const res = data.map((item: any) => {
      return {
        ...item,
        time: dateFormat("YY-MM-DD hh:mm:ss", item.time),
        lastFundingRate: item.lastFundingRate * 100,
      };
    });

    return (
      <LineChart width={500} height={200} data={res}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="time" interval="preserveStart" />
        <YAxis yAxisId="left" dataKey="lastFundingRate" />
        <YAxis yAxisId="right" dataKey="markPrice" orientation="right" />

        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="lastFundingRate"
          stroke="orange"
          dot=""
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="markPrice"
          stroke="#82ca9d"
          dot=""
        />
      </LineChart>
    );
  };

  public renderAntLineChart = (data: any[]) => {

    if (!Array.isArray(data) || data.length == 0) {
      return;
    }

    const res = data
      .filter((item: any) => {
        return Math.abs(parseFloat(item.lastFundingRate)) > 0.001
      })
      .map((item: any) => {
        return {
          ...item,
          lastFundingRate: item.lastFundingRate * 100,
        };
      })
      .sort((a, b) => a.lastFundingRate - b.lastFundingRate);

    if (this.chart) {
      this.chart.changeData(res);
      return;
    }

    if (!this.chart) {
      this.chart = new Chart({
        container: "container",
        // autoFit: true,
        width: res.length * 60,
        height: 300,
        limitInPlot: false,
        localRefresh: true,
        padding: [30, 20, 20, 10],
      })
      // }).on("click", this.BarChartOnClick);
    }


    this.chart.clear();
    this.chart.data(res);
    this.chart.scale("lastFundingRate", {
      alias: "费率",
      nice: true,
    });
    this.chart.option("slider", {
      end: 1,
    });

    this.chart
      .interval()
      .position("symbol*lastFundingRate")
      .color("lastFundingRate", (val) => {
        if (Math.abs(val) >= 0.30) {
          return "#ff4d4f";
        }
        if (val < 0) {
          return "#1890ff";
        }
        return "#6dc609";
      });

    this.chart.interaction("element-active");

    // 添加文本标注
    res.forEach((item) => {
      let offsetY1 = -30;
      let offsetY2 = -12;
      if (item.lastFundingRate < 0) {
        offsetY1 = 12;
        offsetY2 = 30;
      }
      this.chart
        .annotation()
        // .encode('x', 'lastFundingRate')
        // .encode('y', 'symbol')
        // .axis('y', { labelFormatter: '.0%' })
        .text({
          position: [item.symbol, item.lastFundingRate],
          content: item.symbol,
          style: {
            textAlign: "center",
          },
          offsetY: offsetY1,
        })
        .text({
          position: [item.symbol, item.lastFundingRate],
          content: item.lastFundingRate.toFixed(2) + "%",
          style: {
            textAlign: "center",
          },
          offsetY: offsetY2,
        });
    });
    this.chart.render();
    return;
  };

  private renderSearch(options: {
    rowData: any;
    handleSearch: (params) => void;
  }) {
    const symbolList = this.props.$$boss.getIn(["symBolList"]).toJS() || [];
    const { rowData, handleSearch } = options;

    return (
      <div>
        <GroupSearch
          rowData={rowData}
          onValuesChange={handleSearch}
          handleSearch={handleSearch}
          showSearchBtn={false}
          selectMap={{
            symbol: symbolList,
            period: intervals,
          }}
        />
      </div>
    );
  }

  private renderSingleChart = (options: {
    longShortAccountRatio?: any[];
    openInterestHist?: any[];
    [k: string]: any;
  }) => {
    const { longShortAccountRatio = [], openInterestHist = [] } = options;
    this.singleChart.clear();

    // 合约持仓量和合约持仓价值
    const view1 = this.singleChart.createView({
      region: {
        start: { x: 0, y: 0 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
        end: { x: 0.2, y: 1 }, // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
      },
      padding: [20, 40], // 指定视图的留白
    });
    view1.data(
      openInterestHist.slice(
        openInterestHist.length - 10,
        openInterestHist.length
      )
    );
    view1.scale({
      sumOpenInterest: {
        alias: "合约持仓量",
        nice: true,
      },
      sumOpenInterestValue: {
        alias: "合约持仓总价值",
        nice: true,
      },
    });
    view1.axis("sumOpenInterest", {
      title: {
        style: {
          fill: "#e7d505",
          fontSize: 12,
        },
      },
      label: {
        formatter: (text: string, item: any, index: number) => {
          return formatNumber(text);
        },
      },
    });
    view1.axis("sumOpenInterestValue", {
      title: {
        style: {
          fill: "#4FAAEB",
          fontSize: 12,
        },
      },

      label: {
        formatter: (text: string, item: any, index: number) => {
          return formatNumber(text);
        },
      },
    });
    view1.line().position("timestamp*sumOpenInterestValue").color("#4FAAEB");
    view1.interval().position("timestamp*sumOpenInterest").color("#e7d505");

    this.singleChart.interaction("element-active");
    this.singleChart.render();
  };

  private getListData = (data: IPort[]) => {
    const { actions } = this.props;
    data.forEach((item) => {
      actions.get(item.url, item.params).then((res: any) => {
        if (res) {
          const { period = "1h" } = item.params;
          let arr = res;
          if (Array.isArray(arr)) {
            arr = arr.map((item) => {
              let format = "hh:mm";
              if (period.indexOf("d") >= 0 || period.indexOf("w") >= 0) {
                format = "MM-DD";
              }
              return { ...item, timestamp: dateFormat(format, item.timestamp) };
            });
          }

          // this.setState(
          //   {
          //     [item.key]: arr,
          //   },
          //   () => {
          //     this.renderSingleChart({
          //       [item.key]: arr,
          //     });
          //   }
          // );

          this.renderSingleChart({
            [item.key]: arr,
          });
        }
      });
    });
  };

  private handleSearch2 = (params: any) => {
    const { selectedUsdt } = this.state;
    const list: IPort[] = [
      {
        url: api.open_interest_hist,
        key: "openInterestHist",
        params: { ...params, symbol: `${selectedUsdt}${coinType[1]}` },
      },
      // {
      //   url: api.long_short_account_ratio,
      //   key: "longShortAccountRatio",
      //   params: { ...params, symbol: `${selectedUsdt}${coinType[1]}`},
      // },
      // {
      //   url: api.long_short_position_ratio,
      //   key: "longShortPositionRatio",
      //   params,
      // },
      // {
      //   url: api.long_short_user_ratio,
      //   key: "longShortUserRatio",
      //   params,
      // },
      // {
      //   url: api.long_short_taker_ratio,
      //   key: "longShortTakerRatio",
      //   params,
      // },
      // {
      //   url: api.depth,
      //   key: "longShortTakerRatio",
      //   params: {
      //     ...params,
      //     limit: 10,
      //   },
      // },
    ];

    this.getListData(list);
  };

  public renderSingleChartContent() {
    const { selectedUsdt } = this.state;
    return (
      <div>
        <Toggle isShow={!!selectedUsdt}>
          {this.renderSearch({
            rowData: searchRowData,
            handleSearch: this.handleSearch2,
          })}
        </Toggle>
        <div id="single-container"></div>
      </div>
    );
  }

  // 获取最优价格
  private getBookTicker = () => {
    const { actions } = this.props;
    actions.get(api.bookTicker, {}, { showLoading: false, mode: 'cors', }).then((data) => {
      console.log(data);

    })
  }

  render() {
    const { selectedData, selectedUsdt } = this.state;

    return (
      <div className="rate">
        <div>
          <h3>币安汇率</h3>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <div
              id="container"
            ></div>
          </div>
        </div>

        <div style={{ padding: "0 50px 50px 50px", overflow: "auto" }}>
          <div>
            <h3 style={{ marginTop: 50 }}>
              选中汇率--价格变化图 {selectedUsdt}
            </h3>
            {this.renderLineChart(selectedData)}
          </div>

          {this.renderSingleChartContent()}
        </div>
      </div>
    );
  }
}
