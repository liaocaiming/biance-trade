import React, { memo, useState, useEffect, useCallback } from 'react';
import './index.less';

const data = [
  {
    text: '下单',
    url: '/m-htrade/order',
    font: <p className='iconfont'>&#xe60e;</p>
  },
  {
    text: '信号',
    url: '/m-htrade/home',
    font: <p className='iconfont'>&#xe763;</p>
  },
  {
    text: '付费',
    url: '/m-htrade/pay',
    font: <p className='iconfont'>&#xe6c0;</p>

  }
]

interface Props {
  history: any;
  location: any;
}

export default memo((props: Props) => {
  const { history, location } = props;
  const [cur, setCur] = useState()
  useEffect(() => {
    const { pathname } = location;
    setCur(pathname);

  }, [history, location])

  const onChangeRoute = useCallback(
    (url) => {
      if (url === cur) {
        return;
      }
      setCur(url)
      history.push(url);
    },
    [cur, history],
  )

  return (
    <section className='bottom-nav'>
      {
        data.map((item) => {
          const isCur = cur === item.url
          return (
            <div className={`nav-item ${isCur ? 'active' : ''}`} key={item.url} onClick={() => { onChangeRoute(item.url)}}>
              {item.font}<p className='nav-item-text'>{item.text}</p>
            </div>
          )
        })
      }
    </section>
  )
})