import React, { memo, useState, useEffect } from 'react'

import { Timeline } from 'antd';

import './index.less';

import { fetch } from '@utils/index';
import { api } from '@src/m-htrade/config';

const { Item } = Timeline;

interface IList {
  created_at: string;
  id: number;
  message: string;
  n_type: number;
  notification: boolean;
  status: number;
}

export default memo(() => {
  const [list, setList] = useState<IList[]>([]);

  useEffect(() => {
    fetch.get(api.notifications, { page: 1 }).then((res) => {
      console.log(res, 'res');
      setList(res.data)
    })
  }, [])
  return (
    <section className="m-notice">
      <Timeline mode='left'>
        {
          list.map((item) => {
            return (
              <Item key={item.id} label={<span className='time'>{item.created_at}</span>}>
                <div className='notice-content'>
                  <div className='title'><span className='iconfont font'>&#xe60e;</span> 系统通知</div>
                  <p className='content'>{item.message}</p>
                </div>
              </Item>
            )
          })
        }
      </Timeline>
    </section>
  )
})