import React from "react";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { connect } from "@containers/appScreen";

// import { api } from "@src/boss/config";

import { isOrNot, pattern } from "@utils/lib/constants";

import { Button, Tooltip } from "antd";

import { QuestionCircleOutlined } from '@ant-design/icons';

interface ITarget {
  name: string;
  label: string;
}


const targeData: ITarget[] = [
  {
    name: 'target1',
    label: '目标一'
  },
  {
    name: 'target2',
    label: '目标二'
  },
  {
    name: 'target3',
    label: '目标三'
  },
  {
    name: 'target4',
    label: '目标四'
  }
]
@connect()
export default class App extends React.PureComponent {

  public getTargetFormData = (targeData: ITarget[]): AppFormItemOptions[] => {
    const formData: AppFormItemOptions[] = targeData.map((item) => {
      return {
        ...item,
        eleAttr: {
          placeholder: '0~100, 总数不超过100',
          style: {
            width: 200
          }
        },
        rules: [
          {
            pattern: pattern.positiveNum,
            message: '请输入正整数'
          }
        ],
        afterDOM: <span className='margin_left_10'>%</span>
      }
    })

    return formData;
  }

  public renderForm = () => {
    const formData: AppFormItemOptions[] = [
      ... this.getTargetFormData(targeData),
      {
        name: 'upProfit',
        label: '移动止盈',
        type: 'radio',
        list: isOrNot,
        afterDOM: <span className='margin_left_20'> <Tooltip placement="topRight" title='第一目标到后, 会把止损设置在开单价, 第二目标到了后, 会把止盈设置在第一目标, 以此类推...'><QuestionCircleOutlined /></Tooltip></span>,
        rules: [
          {
            required: true,
            message: '请选择'
          }
        ]
      }
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


  public onFinish = (params: any) => {
    console.log(params);
  };

  public render() {
    return (
      <div style={{ width: 800 }}>
        <h4>止盈</h4>
        {this.renderForm()}
      </div>
    );
  }
}
