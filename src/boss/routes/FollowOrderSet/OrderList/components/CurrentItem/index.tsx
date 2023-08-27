import { Button } from "antd";
import React, { memo } from "react";
import "./index.less";
import { reactClassNameJoin } from '@utils/lib/helpers'
const colorMap = {
  1: 'buy',
  2: 'sale'
}

interface IOptions {
  cancelFn: (item: any) => () => void;
  [key: string]: any;
}


const CurrentItem = (item: IOptions) => {
  const { direction, cancelFn } = item;

  return (
    <div className='current-item' >
      <div>
        <span className={reactClassNameJoin(['direction-name', 'margin_right_5', colorMap[direction] ])}>{item.directionName}</span>
        <span>{item.coin}</span>
      </div>

      <div>
        <span className='margin_right_5'>{item.isAllName}</span>
        <span>{item.multiple}X</span>
      </div>

      <div>
        <span className='margin_right_20'>
          <span className='margin_right_5'>持仓数（{item.coin}）:</span> <span>{item.number}</span>
        </span>

        <span className='margin_right_20'>
          <span className='margin_right_5'>未实现盈亏:</span>{" "}
          <span>
            {item.profitAndLossPrice}({item.profitAndLossperc})
          </span>
        </span>

        <span>
          <span className='margin_right_5'>保证金:</span> <span>{item.bond}</span>
        </span>
      </div>

      <div>
        <span className='margin_right_20' >
          <span className='margin_right_5'>开仓价格:</span> <span>{item.openPrice}</span>
        </span>

        <span className='margin_right_20' >
          <span className='margin_right_5'>标记价格:</span> <span>{item.signPrice}</span>
        </span>

        <span>
          <span className='margin_right_5'>强平价格:</span> <span>{item.forcePrice}</span>
        </span>
      </div>

      <div>
        <Button className='cancel-btn' size='small' danger type='dashed' onClick={cancelFn(item)}>取消跟单</Button>
      </div>
    </div>
  );
};

export default memo(CurrentItem, (prevProps: any, nextProps: any) => {
  return prevProps !== nextProps;
});
