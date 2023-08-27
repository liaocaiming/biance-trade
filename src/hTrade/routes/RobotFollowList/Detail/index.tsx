import React from "react";
import { PageList } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import DetaiModal from "./DetaiModal";
import { AppForm } from "@components/index";
import { AppFormItemOptions } from "@components/AppForm/interface.d";
import { query, User, constants } from "@utils/index";
import { Chart } from "@antv/g2";
import api from "@src/hTrade/config/api";
import "./index.less";
import { getRangeTime } from "../utils";
import { GroupSearch } from "@components/index";
import { userType, orderType } from "@src/hTrade/constants";
import { sum } from "../utils";
import { bot_status } from "@src/hTrade/constants";

const renderMoney = (detail: any, key: string) => {
  console.log(sum(detail.bot_infos || [], key), "sum");
  return (formItem: any, form: any) => {
    return <span>{sum(detail.bot_infos || [], key)}</span>;
  };
};

interface IState {
  isShow: boolean;
  detail: any;
  profitList: any[];
}
const format = "YYYY-MM-DD";

const dateArr = getRangeTime();

const dateMap = {
  start_date: dateArr[0].format(format),
  end_date: dateArr[1].format(format),
};

const defaultValues = {
  status: "2",
};

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem = {};
  private chart: any = null;

  private row: any[] = [
    {
      dataIndex: "symbol",
      title: "币种",
    },
    {
      dataIndex: "leverage",
      title: "倍数",
    },

    {
      dataIndex: "order_type",
      title: "订单类型",
      type: "select",
      isSearch: true,
      showList: true,
      list: orderType,
    },

    {
      dataIndex: "avg_price",
      title: "开单均价",
    },

    {
      dataIndex: "quantity",
      title: "开单总数量",
    },

    {
      dataIndex: "current_quantity",
      title: "剩余数量",
    },

    {
      dataIndex: "current_margin",
      title: "当前保证金",
    },

    {
      dataIndex: "next_profit_price",
      title: "止盈价格 ",
    },

    {
      dataIndex: "next_loss_price",
      title: "止损价格 ",
    },

    {
      dataIndex: "residue_entry_amount",
      title: "未买入金额",
    },

    {
      dataIndex: "profit_loss",
      title: "收益",
    },

    {
      dataIndex: "status",
      title: "订单状态",
      showList: true,
      type: "select",
      list: {
        1: "暂未买入",
        2: "正在执行",
        3: "系统取消",
        4: "手动取消",
        5: "止损",
        6: "完成",
        7: "跳过",
        8: "买入后在binane上取消",
        9: "强平",
      },
    },

    // {
    //   dataIndex: "strategyType",
    //   title: "策略类型",
    //   type: "select",
    //   isSearch: true,
    //   list: [
    //     {
    //       value: 101,
    //       label: "101",
    //     },
    //   ],
    // },

    {
      dataIndex: "operate",
      title: "操作",
      render: (val: string, item: any) => {
        return (
          <a onClick={this.toggle({ key: "isShow", value: true, item })}>
            查看
          </a>
        );
      },
    },
  ];

  private searchParams = {};

  constructor(props: IProps) {
    super(props);
    this.state = {
      isShow: false,
      detail: {},
      profitList: [],
    };

    this.searchParams = query.getUrlQuery();
  }

  componentDidMount() {
    this.getProfitList(dateMap);
  }

  componentWillUnmount() {
    User.removeListItem();
  }

  private getProfitList = (params: any = {}) => {
    const { actions } = this.props;
    actions
      .get(api.follow_records_earnings_report, {
        ...this.searchParams,
        ...params,
      })
      .then((res) => {
        if (res.data) {
          const arr: any[] = [];
          const { data = {} } = res;
          Object.keys(data).forEach((key) => {
            arr.push({
              date: key,
              money: parseFloat(data[key]),
            });
          });

          this.renderProfitChart(arr || []);
        }
      });
  };

  private toggle = (options: { key: "isShow"; value; item?: any }) => {
    return () => {
      const { key, value, item } = options;
      if (item) {
        this.changeItem = item;
      }

      this.setState({
        [key]: value,
      });
    };
  };

  private renderBaseInfo = (detail: any) => {
    const editable = false;
    const rowData: AppFormItemOptions[] = [
      {
        label: "邮箱名称",
        name: "email",
        editable,
      },
      {
        label: "币安uid",
        name: "binance_user_id",
        editable,
      },

      {
        label: "机器人创建时间",
        name: "created_at",
        editable,
      },
      {
        label: "机器人结束时间",
        name: "expire_time",
        editable,
      },

      {
        label: "机器人到期时间",
        name: "expire_time",
        editable,
      },

      {
        label: "用户类型",
        name: "user_type",
        type: "select",
        list: userType,
        editable,
      },

      {
        label: "本周期盈利金额",
        name: "profit_loss",
        editable,
        render: renderMoney(detail, "profit_loss"),
      },
      {
        label: "盈利单数",
        name: "success_sum",
        editable,
        render: renderMoney(detail, "success_sum"),
      },
      {
        label: "亏损单数",
        name: "loss_sum",
        editable,
        render: renderMoney(detail, "loss_sum"),
      },

      {
        label: "每单的U数量",
        name: "open_margin",
        editable,
      },

      {
        label: "机器人状态",
        name: "start_bot",
        editable,
        list: bot_status,
        type: "select",
      },

      {
        label: "备注",
        name: "remark",
        editable,
      },
    ];

    return (
      <AppForm
        formItems={rowData}
        submitButton={null}
        colSpan={3}
        updateStore={detail}
        initialValues={detail}
      />
    );
  };

  private renderProfitChart = (list: any[]) => {
    let data = list;
    // if (data.length === 0) {
    //   data = chartData;
    // }

    if (!this.chart) {
      this.chart = new Chart({
        container: "container",
        autoFit: true,
        height: 300,
      });
    }

    this.chart.data(data);
    this.chart.scale({
      money: {
        nice: true,
      },
    });

    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    this.chart.axis("money", {
      label: {
        formatter: (val) => {
          return val + "USDT";
        },
      },
    });

    this.chart
      .line()
      .position("date*money")
      .color("#0fbf3c")
      .shape("smooth");

    this.chart.render();
  };

  private renderDetailModal = () => {
    const { actions } = this.props;
    const { isShow } = this.state;
    if (!isShow) {
      return null;
    }

    return (
      <DetaiModal
        actions={actions}
        query={this.changeItem}
        isShow={isShow}
        title="订单详情"
        onCancel={this.toggle({ key: "isShow", value: false })}
      />
    );
  };

  private renderTotalAmount = () => {
    return null
    // return (
    //   <h2>
    //     <span>本周期总收益:</span>
    //     <span>444</span>
    //   </h2>
    // );
  };

  render() {
    const data = User.getListItem();
    const searchRowData = this.row.concat({
      title: "状态",
      dataIndex: "status",
      type: "select",
      list: constants.ORDER_STATUS,
      isSearch: true,
    });

    return (
      <div className="robotFollow-detail">
        <div className="margin_bottom_20 line">
          <h3>基本信息</h3>
          {this.renderBaseInfo(data)}
        </div>

        <div className="margin_bottom_20 line">
          <h3 className="chart-container">
            <span className="margin_right_20">总收益曲线图</span>
            <GroupSearch
              showSearchBtn={false}
              onValuesChange={(params) => {
                this.getProfitList(params);
              }}
              rowData={[
                {
                  dataIndex: "start_date&end_date",
                  type: "rangePicker",
                },
              ]}
              defaultValues={{ "start_date&end_date": dateArr }}
            />
          </h3>

          <div id="container" />
        </div>

        <div>
          <h3>订单详情</h3>
          <PageList
            initOption={{
              params: { ...this.searchParams, ...defaultValues },
            }}
            {...this.props}
            url={linkPort.follow_records}
            tableComponentProps={{ columns: this.row }}
            actionDom={this.renderTotalAmount}
            groupSearchProps={{
              isShowResetBtn: true,
              rowData: searchRowData,
              defaultValues: defaultValues,
            }}
          />

          {this.renderDetailModal()}
        </div>
      </div>
    );
  }
}
