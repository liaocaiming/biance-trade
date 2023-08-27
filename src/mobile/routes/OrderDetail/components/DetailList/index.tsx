import React from 'react';

import { Steps } from 'antd-mobile';

const { Step } = Steps;

import './index.less';

interface IProps {
  list: any[];

}
export default (props: IProps) => {
  const icon = (
    <span className='cir'></span>
  )

  const { list = [] } = props;

  const description = (item: any) => {
    const { message } = item;

    return (
      <div className='description'>
        <div>{message}</div>
      </div>
    )
  }

  const title = (item: any) => {
    const { created_at } = item;
    return <span>{created_at}</span>
  }

  if (!Array.isArray(list) || list.length === 0) {
    return null
  }

  return (
    <div className='orderDetail-detailList'>
      <h1 className='title'>最新操作</h1>
      <Steps size="small">
        {
          list.map((item: any) => {
            const { side, id } = item;
            return <Step key={id} title={title(item)} description={description(item)} icon={icon} />
          })
        }
      </Steps>
    </div>
  )
}