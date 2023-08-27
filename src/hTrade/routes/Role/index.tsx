import React from 'react';
import { PageList } from '@components/index';
import linkPort from '@src/hTrade/config/api'; // 注意: 不是boss项目的请修改路径
import { connect } from '@containers/appScreen';
import IProps from '@typings/react.d';
import { Button } from 'antd';
@connect()
export default class App extends React.PureComponent<IProps> {
  private row = [
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      isSearch: true,
      type: 'rangePicker'
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '操作',
      dataIndex: 'remark',
      render: () => {
        return (
          <div>
            <Button type='text' className='margin_right_10'>查看</Button>
            <Button type='text'>编辑</Button>
          </div>
        )
      }
    }
  ];


  private renderBtn = () => {
    return (
      <Button type='primary' className='margin_left_20'>新增</Button>
    )
  }

  public render() {
    return (
      <PageList
        {...this.props}
        url={linkPort.role}
        tableComponentProps={{ columns: this.row }}
        groupAfterDom={this.renderBtn()}
        groupSearchProps={{
          isShowResetBtn: true,
          rowData: this.row as any
        }}
      />
    );
  }
}