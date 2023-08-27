import React from "react";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { connect } from "@containers/appScreen";

import { orderType } from "../constants";

import { api } from "@src/boss/config";

import { pattern } from "@utils/lib/constants";

import { Button } from "antd";
import { constants } from "os";

const width = 200;

interface IState {
  symbolList: any[];
}

@connect()
export default class App extends React.PureComponent<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      symbolList: [],
    };
  }

  public componentDidMount() {
    this.getData();
  }

  public renderForm = () => {
    const { symbolList } = this.state;

    const formData: AppFormItemOptions[] = [
      {
        name: "coin",
        type: "select",
        list: symbolList,
        initialValue: "BTCUSDT",
        fieldNames: { value: "symbol", label: "symbol" },
        eleAttr: {
          onChange: () => {
            return {
              price: undefined,
            };
          },
          style: {
            width,
          },
        },
      },

      {
        name: "orderType",
        type: "select",
        list: orderType,
        initialValue: "1",
        eleAttr: {
          style: {
            width,
          },
        },
      },

      {
        name: "price",
        rules: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: pattern.number,
            message: "请数字",
          },
        ],
        isShow: (formData) => {
          return formData.orderType === "1";
        },
        eleAttr: {
          placeholder: "价格(USDT)",
          style: {
            width,
          },
        },
      },

      {
        name: "triggerPrice",
        isShow: (formData) => {
          const arr = ["3", "4"];
          return arr.includes(formData.orderType);
        },
        eleAttr: {
          placeholder: "触发价(USDT)",
          style: {
            width,
          },
        },
      },

      {
        name: "currentPrice",
        initialValue: "市价",
        isShow: (formData) => {
          const arr = ["2", "4"];
          return arr.includes(formData.orderType);
        },
        eleAttr: {
          disabled: true,
          style: {
            width,
          },
        },
      },

      {
        name: "commissionPrice",
        isShow: (formData) => {
          const arr = ["3"];
          return arr.includes(formData.orderType);
        },
        eleAttr: {
          placeholder: "委托(USDT)",
          style: {
            width,
          },
        },
      },

      {
        name: "number",
        rules: [
          {
            required: true,
            message: "请输入",
          },
        ],
        eleAttr: {
          placeholder: "数量",
          style: {
            width,
          },
        },
      },

      {
        name: "isDelayed",
        type: 'checkbox',
        list: [
          {
            value: '1',
            label: '延时止损'
          }
        ],
        eleAttr: {
          style: {
            width,
          },
        },
      },

      {
        name: "delayedTime",
        rules: [
          {
            required: true,
            message: '请输入'
          },
          {
            pattern: pattern.positiveNum,
            message: '请输入正整数'
          }
        ],
        isShow: (formData) => {
          console.log(formData);
          return formData.isDelayed && formData.isDelayed.length > 0;
        },

        eleAttr: {
          placeholder: '请输入',
          style: {
            width: 100,
          },
        },
        afterDOM: <span style={{ marginLeft: 10 }}>min</span>,
      },


    ];

    return (
      <AppForm
        formItems={formData}
        labelCol={{ span: 3 }}
        submitButton={{
          text: "平多",
          type: "primary",
          style: { marginRight: 20 },
        }}
        onFinish={this.onFinish}
      >
        <Button danger htmlType="submit">
          平空
        </Button>
      </AppForm>
    );
  };

  public getData = () => {
    const { actions } = this.props;
    actions.get(api.realtime, {}, { showLoading: false }).then((res: any) => {
      if (res) {
        this.setState({
          symbolList: res,
        });
      }
    });
  };

  public onFinish = (params: any) => {
    console.log(params);
  };

  public render() {
    return (
      <div style={{ width: 800 }}>
        <h4>止损</h4>
        {this.renderForm()}
      </div>
    );
  }
}
