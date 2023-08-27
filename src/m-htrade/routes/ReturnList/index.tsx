import React, { memo, useState, useCallback, useEffect } from 'react';

import classnames from 'classnames';

import arrow from './images/arrow-left.png';

import pay from './images/icon-pay.png';

import send from './images/icon-send.png';

import user from './images/icon-user.png';

import './index.less';

import { fetch } from '@utils/index'

import { api } from '@src/m-htrade/config';

import { Toggle } from '@shared/components';

interface Total {
  total: number;
  amount?: number;
  onTabChange: (type: Type) => void;
}

type Type = 'add' | 'reward';

const Header = memo(() => {
  return (
    <section className="header">
      <div className="send header-item">
        <div><img src={send} /></div>
        <div className="text">发送邀请给好友</div>
      </div>
      <div className="arrow">
        <img src={arrow} />
      </div>
      <div className="member header-item">
        <div><img src={user} /></div>
        <div className="text">好友注册后购买会员</div>
      </div>
      <div className="arrow">
        <img src={arrow} />
      </div>
      <div className="member header-item">
        <div><img src={pay} /></div>
        <div className="text">获得相应比例奖励</div>
      </div>
    </section>
  )
})

const Total = memo((props: Total) => {
  const { total, amount } = props;
  const [type, setType] = useState<Type>('add');

  const onTabChange = useCallback(
    (operateType: Type) => {
      return () => {
        if (type === operateType) {
          return;
        }
        setType(operateType)
      }
    },
    [type],
  )

  return (
    <section className="heade-total">
      <div className='total'>
        <div className="title">好友奖励</div>
        <div className='total-detail'>
          <span className='number'>
            <span className="label">人数：</span>
            <span className="value">{total || 2}</span>
          </span>
          {/* <span className='amount'>
            <span className="label">金额(USTD)：</span>
            <span className="value">{amount || 122}</span>
          </span> */}
        </div>
      </div>

      <div className="tab">
        <div className={classnames("left", type == 'add' ? 'active' : '')} onClick={onTabChange('add')}>
          <div>添加记录</div>
          <div className='bar' />
        </div>
        <div className={classnames("right", type == 'reward' ? 'active' : '')} onClick={onTabChange('reward')}>
          <div>奖励记录</div>
          <div className='bar' />
        </div>
      </div>

    </section>
  )
})


const map  = {
  add: 0,
  reward: 1
}

export default memo(() => {
  const [list, setList] = useState<any[]>([]);
  const [type, setType] = useState<Type>('add')
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const getList = useCallback((pageNo: number = 1) => {
    fetch.get(api.invite_records, { page: pageNo, is_vip: map[type] }).then((res) => {
      setList(res.data || []);
      setCount(res.count || 0);
    })
  }, [type, page])

  useEffect(() => {
    getList()
  }, [])

  const onTabChange = useCallback((type: Type) => {
    setType(type);
    getList();
  }, [])

  return (
    <section className='return-list'>
      <Header />

      <section className="content">
        <Total total={count}  onTabChange={onTabChange} />

        <section className="list">
          <div className="th flex">
            <div className='td'>好友帐号</div>
            <div className='td'>添加时间</div>
          </div>

          <Toggle isShow={list.length > 0}>
            <ul className='list-content'>
              {
                list.map((item, index) => {
                  return (
                    <li key={String(index)} className='tr flex'>
                      <div>{item.to_email}</div>
                      <div>{item.created_at}</div>
                    </li>
                  )
                })
              }
            </ul>
          </Toggle>

          <Toggle isShow={list.length == 0}>
            <div className='no-data'>暂无数据</div>
          </Toggle>
        </section>
      </section>

      <section className='btn-container'>
        <div className="left-btn btn">
          <div>
            <div>复制邀请码</div>
            <div>3gla68</div>
          </div>
        </div>

        <div className="right-btn btn">
          生成邀请海报
        </div>
      </section>

    </section>
  )
})