import React, { memo, useEffect, useState } from 'react';
import './index.less';

import SearachItem from './SearachItem';

interface Props {
  value?: any;
  onChange?: (values: any) => void;
}


const items: any[] = [
  {
    name: 'p_type',
    options: [
      { 'label': '全部信号', 'value': null },
      { 'label': '开单信号', 'value': 1 },
      { 'label': '止盈信号', 'value': 2 },
      { 'label': '止损信号', 'value': 3 },
      { 'label': '交易超时', 'value': 4 },
    ]
  },
  {
    name: 'period_type',
    options: [
      { 'label': '全部周期', 'value': null },
      { 'label': '短线', 'value': 1 },
      { 'label': '中线', 'value': 2 },
      { 'label': '长线', 'value': 3 },
    ]
  }
]

export default memo((props: Props) => {
  const [searchparams, setSearchparams] = useState({});
  const { value, onChange } = props;

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(searchparams)) {
      setSearchparams(value || {});
    }
  }, [value])

  const onSearch = (values: any) => {
    const params = {
      ...searchparams,
      ...values
    }
    setSearchparams(params)
    onChange && onChange(params);
  }

  console.log();
  

  return (
    <div className='m-search'>
      {
        items.map((item) => {
          const v = searchparams[item.name];

          return <SearachItem value={v} key={item.name} {...item} onChange={onSearch}></SearachItem>
        })
      }
    </div>
  )
})