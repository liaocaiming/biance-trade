import { Card } from "antd";

import React from "react";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { UploadImage } from "@components/index";

const width = 300;

export default class App extends React.PureComponent {
  public renderForm = () => {
    const formData: AppFormItemOptions[] = [
      {
        label: "客服微信号",
        name: "weChat",
        rules: [
          {
            required: true,
            message: "请输入",
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          style: {
            width,
          },
        },
      },

      {
        label: "客服微信二维码",
        name: "weChatUrl",
        rules: [
          {
            required: true,
            message: "请上传",
          },
        ],
        render: () => {
          return <UploadImage />;
        },
      },

      {
        label: "会员收费二维码",
        name: "getUrl",
        rules: [
          {
            required: true,
            message: "请上传",
          },
        ],
        render: () => {
          return <UploadImage />;
        },
      },

      {
        label: "会员收费价格",
        name: "price",
        rules: [
          {
            required: true,
            message: "请输入",
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          style: {
            width,
          },
        },
      },

      {
        label: "邀请分享图片",
        name: "invite_url",
        rules: [
          {
            required: true,
            message: "请上传",
          },
        ],
        render: () => {
          return <UploadImage />;
        },
      },
    ];

    return (
      <AppForm
        formItems={formData}
        labelCol={{ span: 6 }}
        submitButton={{ text: "保存", type: "primary" }}
        onFinish={this.onFinish}
      />
    );
  };

  public onFinish = (params: any) => {
    console.log(params);
  };

  public render() {
    console.log(22222);

    return (
      <Card title="系统设置" bordered={false}>
        <div style={{ width: 800 }}>{this.renderForm()}</div>
      </Card>
    );
  }
}
