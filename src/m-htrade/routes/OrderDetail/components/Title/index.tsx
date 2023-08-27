import { helpers } from '@utils/index';
import React from 'react';
import { constants, arrToObj } from '@utils/index'
import { Toggle } from "@shared/components";
import './index.less';
import { Detail } from '@src/m-htrade/components/index';
import { IRow } from '@src/m-htrade/components/Detail/interface';


const ORDER_TYPE_MAP: any = arrToObj(constants.ORDER_TYPE);

interface IProps {
  detail: any;
}

export default (props: IProps) => {
  const { detail = {} } = props;
  const { follow_record_infos = [], status } = detail;

  const renderTitle = (detail: any) => {
    const {
      side,
      symbol,
      leverage,
      order_type = 3,
    } = detail;


    return (
      <div className='orderDetail-symbol'>
        <span
          className={helpers.reactClassNameJoin([
            "margin_right_5 direction",
            "direction",
            side ? "buy" : "sale",
          ])}
        >
          <span>{side ? "买" : "卖"}</span>
          <Toggle isShow={leverage}>
            <span>{leverage}倍</span>
          </Toggle>
        </span>
        <span className="icon">{symbol}</span>
        <span className='margin_right_5 orderType'>{ORDER_TYPE_MAP[order_type]}</span>

        <Toggle isShow={status != 2}>
          <span className='status'><span className='text'>平</span></span>
        </Toggle>
        <Toggle isShow={status == 2}>
          <span className='status'><span className='hold text'>持</span></span>
        </Toggle>
      </div>

    )
  }

  const renderEndTotal = (detail: any) => {
    const rowData: IRow[] = [
      {
        label: '总收益',
        name: 'profit_loss',
        afterDOM: 'usdt'
      },
      {
        label: '持仓量',
        name: 'quantity',
        afterDOM: '张'
      },
      {
        label: '保证金',
        name: 'quantity',
        afterDOM: 'usdt'
      }
    ]


    return (
      <div className='end-total'>
        <Detail detail={detail} rowData={rowData} />
      </div>
    )
  }

  const renderHoldingTotal = (detail: any) => {
    const rowData1: IRow[] = [
      {
        name: 'avg_price',
        label: '开仓均价',
      },
      {
        label: '收益',
        name: 'profit_loss',
        afterDOM: 'usdt'
      },
    ]

    const rowData2: IRow[] = [
      {
        name: 'current_quantity',
        label: '持仓量',
        afterDOM: '张'
      },
      {
        name: 'residue_entry_amount',
        label: '持仓价值',
        afterDOM: 'usdt'
      },
      {
        name: 'current_margin',
        label: '保证金',
        afterDOM: 'usdt'
      },
      {
        name: 'next_profit_price',
        label: '止盈目标',
        afterDOM: 'usdt'
      },
      {
        name: 'next_loss_price',
        label: '止损目标',
        afterDOM: 'usdt'
      }
    ]
    return (
      <div className='holding'>
        <div className='holding-profits'><Detail rowData={rowData1} detail={detail} nameAndLabelAllRow col={2} /></div>
        <div className='holding-profits-detail'><Detail rowData={rowData2} detail={detail} /></div>
      </div>
    )
  }

  const renderSise = (side: boolean) => {
    if (side) {
      return <span className='buy'>买</span>
    }
    return <span className='sale'>卖</span>
  }


  const renderList = (data: any[]) => {
    const rowData1: IRow[] = [
      {
        name: 'created_at',
        render: (detail: any) => {
          const { side, created_at } = detail;

          return <span>{renderSise(side)}<span className='margin_left_5'>{created_at}</span></span>
        }
      },
      {
        name: 'price',
        beforeDOM: '$',
      },

      {
        name: 'profit_loss',
        placeholder: '--'
      },


      {
        name: 'quantity',
        afterDOM: '张'
      },

    ]

    return (
      <div className='list'>
        {
          data.map((item) => {
            return <Detail key={item.id} rowData={rowData1} detail={item} col={4} />
          })
        }
      </div>
    )
  }



  return (
    <div className="orderDetail-detail">
      {renderTitle(detail)}
      <div className='total-info'>
        <Toggle isShow={status == 2}>
          {renderHoldingTotal(detail)}
        </Toggle>
        <Toggle isShow={status !== 2}>
          {renderEndTotal(detail)}
        </Toggle>

      </div>

      {renderList(follow_record_infos)}
    </div>
  )
}