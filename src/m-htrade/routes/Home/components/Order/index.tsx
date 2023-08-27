import React, { memo, useState, useCallback, useMemo } from 'react';

import Drawer from '@components/Drawer';

import Form from '@src/m-htrade/components/Form';

import { FormItemOptions } from '@src/m-htrade/components/Form/interface.d';

import './index.less';

import { constants } from '@utils/index';
import history from '@utils/lib/history';
import { SessionStorage } from '@utils/lib/Storage';

interface OrderProps {
  visibility: boolean
  onClose?: () => void;
  detail: any;
}

const profitData = (dist_arr: string[]) => {
  return dist_arr.map((item, index) => {
    const value = index + 1
    return {
      value,
      label: `目标${value} ($${item})`
    }
  })
}

export default memo((props: OrderProps) => {
  const { visibility, onClose, detail } = props;

  const { symbol, entry, dist_arr = [], loss } = detail;

  const onDrawerClose = useCallback(
    () => {
      onClose && onClose();
    },
    [visibility],
  )

  const formItems: FormItemOptions[] = useMemo(() => {
    const formRowData: FormItemOptions[] = [
      {
        name: 'entry',
        label: '开单价格($)',
        rules: [
          {
            required: true,
            message: '请输入价格'
          },
          {
            pattern: constants.pattern.number,
            message: '开单价格必须是数字'
          }
        ],
        eleAttr: {
          placeholder: '开单价格'
        }
      },
      {
        name: `amount`,
        label: '成交额($)',
        rules: [
          {
            required: true,
            message: '请输入成交额'
          },
          {
            pattern: constants.pattern.number,
            message: '成交额必须是数字'
          }
        ],
        eleAttr: {
          placeholder: '成交额'
        }
      },

      {
        name: `profit`,
        type: 'checkbox',
        rules: [
          {
            required: true,
            message: '请输入选择止盈目标'
          },
        ],
        eleAttr: {
          mul: false
        },
        data: profitData(dist_arr)

      },
    ]

    return formRowData
  }, [detail])

  const onFinish = (values) => {
    console.log(values);
  }

  const goTo = () => {
    SessionStorage.setItem('post-detail', detail)
    history.push('/m-htrade/order')
  }

  return (
    <Drawer visibility={visibility} onClose={onDrawerClose}>
      <div className='order'>
        <p className='order__symbol'>{symbol}</p>
        <p className="order__range"><span className="label">挂单区间：</span><span className='value'>{entry}</span></p>
        <p className="order__range"><span className="label">止损价格：</span><span className='value'>{loss}</span></p>

        <div className="order_drawer_form ">
          <Form
            formItems={formItems}
            onFinish={onFinish}
          />

          <div className='more-btn-container'>
            <a className='more-btn' onClick={goTo}>更多设置</a>
          </div>
        </div>
      </div>
    </Drawer>
  )
})