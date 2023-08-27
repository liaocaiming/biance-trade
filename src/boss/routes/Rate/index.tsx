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

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private chart: any = null;

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
    this.getData();
    setInterval(() => {
      this.getData();
    }, 60 * 1000);
  }

  getData = () => {
    const { actions } = this.props;
    actions.get(api.v1PremiumIndex, {}, { showLoading: false, mode: 'cors', }).then((res: any) => {
      const data =
        Array.isArray(res) &&
        res.map((item: any) => {
          const it = { ...item, symbol: item.symbol.split("USDT")[0] };
          return it;
        });

      this.renderAntLineChart(data || []);
    });
  };


  private renderAntLineChart = (data: any[]) => {

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

    let width = 800;
    if (res.length > 10) {
      width = 100 * res.length
    }

    if (!this.chart) {
      this.chart = new Chart({
        container: "container",
        // autoFit: true,
        width: width,
        height: 500,
        limitInPlot: false,
        localRefresh: false,
        padding: [100, 100, 100, 100],
      })
    }


    this.chart.clear();
    this.chart.data(res);
    this.chart.scale("lastFundingRate", {
      alias: "费率",
      nice: true,
    });
    // this.chart.option("slider", {
    //   end: 1,
    // });

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

  // 获取最优价格
  private getBookTicker = () => {
    const { actions } = this.props;
    actions.get(api.bookTicker, {}, { showLoading: false, mode: 'cors', }).then((data) => {
      console.log(data);
    })
  }

  render() {
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
      </div>
    );
  }
}
