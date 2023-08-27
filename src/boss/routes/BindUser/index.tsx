import { Card } from 'antd';

import React from 'react';

import { AppForm } from '@components/index';

import { AppFormItemOptions} from '@components/AppForm/interface'

const width = 300;

export default class App extends React.PureComponent {

  public renderForm = () => {
    const formData: AppFormItemOptions[] = [
      {
        name: 'API',
        label: 'API Key',
        rules: [
          {
            required: true,
            message: '请输入'
          }
        ],
        eleAttr: {
          placeholder:'请输入API Key',
          style: {
            width
          }
        }
      },
      {
        name: 'Secret',
        label: 'Secret Key',
        rules: [
          {
            required: true,
            message: '请输入'
          }
        ],
        eleAttr: {
          placeholder:'请输入API Key',
          style: {
            width
          }
        }
      }
    ]

    return (
      <AppForm formItems={formData} labelCol={{ span: 3}} submitButton={{ text: '保存', type: 'primary'}} onFinish={this.onFinish}/>
    )
  }


  public onFinish = (params: any) => {
    console.log(params);
  }

  public render() {
    return (
      <Card title="账户绑定" bordered={false}>
       <div style={{ width: 800 }}>
         {this.renderForm()}
       </div>
      </Card>
    )
  }
}