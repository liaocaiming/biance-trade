import React from "react";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { connect } from "@containers/appScreen";


import { api } from "@src/boss/config";

import { isOrNot, pattern } from "@utils/lib/constants";

const width = 200;
@connect()
export default class App extends React.PureComponent<any> {

  public componentDidMount() {
    this.getData();
  }

  public renderForm = () => {
    
    const formData: AppFormItemOptions[] = [
      {
        name: "loss",
        label: '跟随系统',
        type: 'radio',
        list: isOrNot,
        rules: [
          {
            required: true,
            message: '请选择'
          }
        ]
      },

      {
        name: "isDelayed",
        label: '延时止损',
        isShow: (data) => {
          return data.loss === '1'
        },
        type: 'radio',
        list: isOrNot,
        eleAttr: {
          style: {
            width,
          },
        },
      },

      {
        name: "delayedTime",
        label: '延时时间',
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

        isShow: (data) => {
          return data.isDelayed === '1'
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
          text: "确定",
          type: "primary",
          style: { marginRight: 20 },
        }}
        onFinish={this.onFinish}
      >
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
