import React from 'react';
import { PageList } from '@components/index';
import linkPort from '@src/hTrade/config/api'; // 注意: 不是boss项目的请修改路径
import { connect } from '@containers/appScreen';
import IProps from '@typings/react.d';
import { Link } from '@components/index';
import { Button } from 'antd';

@connect()
export default class App extends React.PureComponent<IProps> {
private row: any[] = [
  {
    title: '预警内容',
    dataIndex: 'message',
    showPop: true
  },
  {
    title: '预警图片',
    dataIndex: 'warn_url',
    render: (value: string) => {
      return <img src={value} height='20'/>
    }
  },
  {
    title: '推送时间',
    dataIndex: 'created_at',
    isSearch: true,
    type: 'rangePicker'
  },
  // {
  //   title: '操作',
  //   dataIndex: 'operate',
  //   render: (value: string, record: any) => {
  //     const { route } = this.props;
  //     return <Link to={{ pathname: `${route.path}/show` }} search={record}>查看</Link>
  //   }

  // }
];

private renderAdd = () => {
  const { route } = this.props;
  return <Button type='primary' className='margin_left_20'><Link to={{ pathname: `${route.path}/add`}}>新增</Link></Button>
}

public render() {
 return (
     <PageList
       {...this.props}
       initOption={{
        params: {
          n_type: 12
        }
       }}
       url={linkPort.users_notifications}
       tableComponentProps={{ columns: this.row }}
       groupAfterDom={this.renderAdd()}
       groupSearchProps={{
         isShowResetBtn: true,
       }}
     />
   );
  }
}