import { Button } from "antd";
import React from "react";

export default (item: any) => {
  return (
    <div>
      <div>
        <span>{item.directionName}</span>
        <span>{item.coin}</span>
      </div>

      <div>
        <span>{item.isAllName}</span>
        <span>{item.multiple}X</span>
      </div>

      <div>
        <span>
          <span>持仓数（{item.coin}）:</span> <span>{item.number}</span>
        </span>
        <span>
          <span>未实现盈亏:</span>{" "}
          <span>
            {item.profitAndLossPrice}({item.profitAndLossperc})
          </span>
        </span>
        <span>
          <span>保证金:</span> <span>{item.bond}</span>
        </span>
      </div>

      <div>
        <span>
          <span>开仓价格:</span> <span>{item.openPrice}</span>
        </span>
        <span>
          <span>标记价格:</span> <span>{item.signPrice}</span>
        </span>
        <span>
          <span>强平价格:</span> <span>{item.forcePrice}</span>
        </span>
      </div>

      <div>
        <Button>取消跟单</Button>
      </div>
    </div>
  );
};
