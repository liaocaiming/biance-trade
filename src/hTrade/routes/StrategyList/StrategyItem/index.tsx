import React from "react";
import { PageList } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { Card } from "antd";
import DetaiModal from "./DetaiModal";
import { orderStatus } from "@src/hTrade/constants/index";
import { query } from "@utils/index";
import "./index.less";

interface IState {
  isShow: boolean;
}

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem = {};

  private row: any[] = [
    {
      dataIndex: "push_time",
      title: "推送时间",
      isSearch: true,
      searchDataIndex: "start_date&end_date",
      type: "rangePicker",
    },
    {
      dataIndex: "symbol",
      title: "币种",
      isSearch: true,
    },
    {
      dataIndex: "leverage",
      title: "倍数",
    },
    {
      dataIndex: "signal_type",
      title: "策略编码",
    },

    {
      dataIndex: "p_type",
      title: "订单状态",
      type: "select",
      list: orderStatus,
      listFilters: {
        values: ["7"],
        opposite: true,
      },
      showList: true,
    },

    {
      dataIndex: "dist",
      title: "止盈目标",
      render: (value: string) => {
        const arr = value.split(",");
        return (
          <div>
            {arr.map((val: string, index: number) => {
              return (
                <span className="margin_right_5 dist-item" key={`${index}`}>
                  {val}
                </span>
              );
            })}
          </div>
        );
      },
    },

    {
      dataIndex: "dist_index",
      title: "已止盈目标",
      render: (value: number) => {
        if (value <= 0) {
          return "未止盈";
        }
        return value;
      },
    },

    {
      dataIndex: "spend_time",
      title: "花费时间",
      render: (value: string) => {
        if (!value) {
          return null;
        }
        const arr = value.split(",");
        return arr[arr.length - 1];
      },
    },

    {
      dataIndex: "loss",
      title: "止损点位",
    },
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

  constructor(props: IProps) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

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

  private renderDetaiModal = () => {
    const { actions } = this.props;
    const { isShow } = this.state;

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

  render() {
    const searchRowData = this.row.concat({
      dataIndex: "p_type",
      title: "订单状态",
      isSearch: true,
      list: orderStatus,
      type: "select",
    });
    return (
      <Card title="策略详情" className="strategyItem">
        <PageList
          initOption={{
            params: {
              signal_id: query.getUrlQuery().id,
            },
          }}
          {...this.props}
          url={linkPort.push_records}
          tableComponentProps={{ columns: this.row }}
          groupSearchProps={{
            isShowResetBtn: true,
            rowData: searchRowData,
          }}
        />

        {this.renderDetaiModal()}
      </Card>
    );
  }
}
