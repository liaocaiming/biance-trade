import * as React from 'react';

import { AppForm } from '@components/index';

import { AppFormItemOptions } from '@components/AppForm/interface';

import User from '@utils/lib/User';

import './index.less';

import IProps from '@typings/react.d';

import { connect } from '@containers/app';

import { api } from '@src/hTrade/config';

@connect()
export default class App extends React.PureComponent<IProps> {
  onFinish = values => {
    const { actions, history } = this.props;
    actions.post(api.authentication, values).then(res => {
      User.saveUserInfo(res.data);
      history.push('/hTrade/user');
    });
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  renderForm = () => {
    const width = 200;
    const formItems: AppFormItemOptions[] = [
      {
        label: '邮箱',
        name: 'email',
        rules: [
          {
            required: true,
            message: '请输入邮箱',
            whitespace: true,
          },
        ],
        eleAttr: {
          placeholder: '请输入邮箱',
          style: {
            width,
          },
        },
      },
      {
        label: '密码',
        name: 'password',
        type: 'password',

        rules: [
          {
            required: true,
            message: '请输入密码',
            whitespace: true,
          },
        ],
        eleAttr: {
          placeholder: '请输入密码',
          style: {
            width,
          },
        },
      },
    ];

    return (
      <AppForm
        formItems={formItems}
        labelCol={{ span: 8 }}
        submitButton={{ text: '登录', type: 'primary' }}
        onFinish={this.onFinish}
        footerStyle={{
          marginTop: 20,
          textIndent: 134,
        }}
      />
    );
  };

  render() {
    const { companyConfig } = this.props;
    const { title } = companyConfig || {};
    return (
      <div className="Htrade-form">
        <h4 className="title">{title || 'H-Trade'}</h4>
        {this.renderForm()}
      </div>
    );
  }
}
