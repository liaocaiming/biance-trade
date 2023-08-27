import React, { memo, useCallback, useMemo, useState } from 'react';
import { Toggle } from '@components/index';
import './listItem.less';
import starWhite from './images/icon-star-white.png'
import starYellow from './images/icon-star-yellow.png'
import statusImgYes from './images/icon-cir-yes.png';
import statusImgNo from './images/icon-cir-no.png';
import logo from './images/icon-logo-48.png';

import { fetch } from '@utils/index';

import { formatDetail, orderStatus, getLabel, formatStatus } from './utils';

import { api } from '@src/m-htrade/config';

import classnames from 'classnames';


interface Props {
  item: any
  host?: string | number;
  onSuccess?: (item: any) => void;
  onDrawerToggle: (item: any) => () => void;
}

const rowData = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '目标价位',
    dataIndex: 'target'
  },
  {
    title: '盈利率',
    dataIndex: 'pross'
  },
  {
    title: '触发耗时',
    dataIndex: 'time'
  },
  {
    title: '状态',
    dataIndex: 'status'
  }
]

const renderTable = (data: any) => {
  const { dist_profit_rate_arr = [], dist_arr = [], dist_index, spend_time_arr } = data || {}
  return (
    <div className='table'>
      <div className="th flex row">
        {
          rowData.map((item, index) => {
            return <div className={`td td-${index} `} key={item.dataIndex}>{item.title}</div>
          })
        }
      </div>

      {
        dist_arr.map((item, index) => {
          const img = dist_index - 1 >= index ? statusImgYes : statusImgNo;
          return (
            <div key={`${index}`} className={`tr flex row tr-${index}`} >
              <p className='td-0'><span className='sort'>{index + 1}</span></p>
              <p className='td-1'> {item}</p>
              <p className='td-2'>{dist_profit_rate_arr[index]}</p>
              <p className='td-3'>{spend_time_arr[index]}</p>
              <p className='status td-4'><img className='status-img' src={img} /></p>
            </div>
          )
        })
      }

    </div>
  )
}


export default memo((props: Props) => {
  const { onSuccess, host, onDrawerToggle } = props
  const item = formatDetail(props.item || {});
  const { leverage, created_at, updated_at, symbol, signal_type, p_type, loss, is_subscribe, entry, dist_profit_rate_arr, id, show_dist_profit_rate_arr = [] } = item;
  const statusLabel = getLabel(orderStatus, p_type);
  const statusClassName = formatStatus(p_type);
  const star = is_subscribe ? starYellow : starWhite;

  const onStarChange = useCallback(
    () => {
      let url = api.unsubscribe;
      if (!is_subscribe) {
        url = api.subscribe
      }

      fetch.post(url, { p_id: id }).then(() => {
        onSuccess && onSuccess(item)
      })

    },
    [item, onSuccess],
  )

  const formLogoUrl = useMemo(() => {
    // return `${system?.}`
    return `${host}/icon/${symbol.replace('USDT', '')}.png` || logo;
  }, [host])



  return (
    <section className={`home-list-item ${statusClassName}`}>
      <section className='symbol-container'>
        <div className="img"><img src={formLogoUrl} /></div>

        <div className='icon'>
          <div className='icon-name'>{symbol}</div>
          <div className="s_type"><Toggle isShow={leverage > 1}><span>合约</span></Toggle> {signal_type}</div>
        </div>

        <div className="time">
          <div className={classnames("star")}>
            <img src={star} onClick={onStarChange} />
          </div>
          <div className="stime">开始时间：{created_at}</div>
          <div className="update-time">最近更新：{updated_at}</div>
        </div>
      </section>

      <section className="list-item">
        <p className="mul list-item-label detail-first">
          <span>
            <Toggle isShow={leverage > 1}>
              <span className="label">方向/倍数：</span><span className="value leverage">做多/{leverage}倍</span>
            </Toggle>
          </span>
          <Toggle isShow={p_type == 1 && leverage <= 1}>
            <span className="flow-btn" onClick={onDrawerToggle(item)}>跟单</span>
          </Toggle>
        </p>
        <p className="mul list-item-label"><span className="label">挂单区间：</span><span className='value'>{entry}</span></p>
        <p className="mul list-item-label"><span className="label">利润空间：</span><span className='value'>{dist_profit_rate_arr[0]} ~ {dist_profit_rate_arr[dist_profit_rate_arr.length - 1]}</span><Toggle isShow={show_dist_profit_rate_arr.length > 0}><span>(已盈利+{show_dist_profit_rate_arr[show_dist_profit_rate_arr.length - 1]})</span></Toggle></p>
        <p className="mul list-item-label"><span className="label">止损点数：</span><span className='value loss'>{loss}</span><span>（{statusLabel}）</span></p>
      </section>

      <section className="table ">
        <div className="table-success">
          {renderTable({ ...item, created_at })}
        </div>
      </section>

    </section>
  )
})