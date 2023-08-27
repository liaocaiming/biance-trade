import React, { useEffect, useState } from 'react';

import IProps from '@typings/react.d'

import { query, fetch } from '@utils/index'

import './index.less';

import { Title, DetailList } from './components/index'

import { api } from '@src/mobile/config/index';

export default (props: IProps) => {
  const [detail, setDetail] = useState({});
  const search = query.getUrlQuery();

  const getData = (query: any) => {
    fetch.get(api.orderDetail, query).then((res) => {
      if (res.data) {
        setDetail(res.data)
      }
    })
  }

  useEffect(() => {
    getData(search)
  }, [])

  const { follow_record_messages = [] } = detail as any;

  return (
    <div className='page-orderDetail'>
      <Title detail={detail} />
      <DetailList list={follow_record_messages} />
    </div>
  )
}