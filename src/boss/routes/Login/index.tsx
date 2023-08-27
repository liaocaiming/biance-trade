import * as React from "react";

import { Form, Input, Button, Checkbox, message } from "antd";

import User from "@utils/lib/User";

import "./index.css";

import IProps from "@typings/react.d";

import { connect } from "@containers/app";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// const obj = {
//   username: "woshinidaye",
//   password: "woshidajiba",
// };

@connect()
export default class App extends React.PureComponent<IProps> {
  onFinish = (values) => {
    // const { actions } = this.props;
    // actions.post('v1/authentication', values).then((res) => {
    //   console.log(res);
    // })

    // if (values.username !== obj.username || values.password !== obj.password) {
    //   message.error("请输入正确的密码或用户名");
    //   return;
    // }
    User.saveUserInfo(values);
    const { history } = this.props;
    history.push("/boss/rate");
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const width = 300;

    return (
      <div className="boss-form">
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input style={{ width }} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password style={{ width }} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
