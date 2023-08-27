import React from "react";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { connect } from "@containers/appScreen";

import { orderType } from "../constants";

import { api } from "@src/boss/config";

import { pattern } from "@utils/lib/constants";

import creatArrayByLen from '@utils/lib/creatArrayByLen';

import { Button } from "antd";

const width = 200;

interface IState {
  symbolList: any[];
}

const multiple = (num) => {
  return creatArrayByLen(num).map((item) =>{
    return  { value: item, label: `${item} 倍` }
  })
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
        name: "multiple",
        type: "select",
        list: multiple(50),
        initialValue: 10,
        eleAttr: {
          style: {
            width,
          },
        },
      },


      
    ];

    return (
      <AppForm
        formItems={formData}
        labelCol={{ span: 3 }}
        submitButton={{
          text: "开多",
          type: "primary",
          style: { marginRight: 20 },
        }}
        onFinish={this.onFinish}
      >
        <Button danger htmlType="submit">
          开空
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
        <h4>开单</h4>
        {this.renderForm()}
      </div>
    );
  }
}
