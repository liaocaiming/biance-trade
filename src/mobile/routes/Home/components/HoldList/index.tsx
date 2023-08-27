import React from "react";
import { helpers, arrToObj } from "@utils/index";
import { mul } from "@utils/lib/calculate";
import "./index.less";
import { marginType } from "../../constants";
import { constants } from '@utils/index'
import { Toggle } from "@shared/components";
import { pageUrlsMap } from "@src/mobile/config/routes";

const ORDER_TYPE_MAP: any = arrToObj(constants.ORDER_TYPE);

interface IProps {
  data: object[];
  unbindRobot?: (id: string) => () => void;
  goDetail: (url: string, query: any) => () => void;
}

export default (props: IProps) => {
  const { data, unbindRobot, goDetail } = props;

  const renderItem = (detail: any) => {
    const {
      side,
      symbol,
      margin_type,
      leverage,
      goal_times,
      avg_price,
      liquidation_price,
      profit_loss,
      residue_entry_amount,
      id,
      current_quantity,
      order_type = 3,
      next_profit_price,
      next_loss_price
    } = detail;

    return (
      <div className="hold-item" key={detail.id}>
        <div onClick={goDetail(pageUrlsMap.orderDetail, { id })}>
          <div className="first-line row buy">
            <div className="left">
              <span
                className={helpers.reactClassNameJoin([
                  "margin_right_5 direction",
                  "direction",
                  side ? "buy" : "sale",
                ])}
              >
                {side ? "买" : "卖"}
              </span>
              <span className="icon margin_right_5">{symbol}</span>
              <span className='margin_right_5 orderType'>{ORDER_TYPE_MAP[order_type]}</span>
            </div>

            <div className="right">
              <span className="margin_right_5">{marginType[margin_type]}</span>
              <Toggle isShow={parseInt(leverage) > 0}>
                <span>{leverage}X</span>
              </Toggle>
            </div>
          </div>

          <div className="second-line row">
            <div className="col">
              <div className="title">买入价钱</div>
              <div className="value">{avg_price}u</div>
            </div>
            <div className="col">
              <div className="title">持有仓位</div>
              <div className="value">{current_quantity}张</div>
            </div>

            <div className="col">
              <div className="title">收益</div>
              <div className="value">{profit_loss}u</div>
            </div>
            {/* <div className="col">
            <div className="title">买入仓位</div>
            <div className="value">
              {mul(avg_price || 0, current_quantity || 0)}u
            </div>
          </div> */}
          </div>




          <div className="third-line row">
            <div className="col">
              <div className="title">止盈目标</div>
              <div className="value">{next_profit_price}u</div>
            </div>

            <div className="col">
              <div className="title">止损目标</div>
              <div className="value">{next_loss_price}u</div>
            </div>

            <div className="col">
              <div className="title">强平价钱</div>
              <div className="value">{liquidation_price}u</div>
            </div>
          </div>
        </div>


        <div className="unbind-btn">
          <span className="btn" onClick={unbindRobot && unbindRobot(id)}>
            解绑机器人
            </span>
        </div>
      </div>
    );
  };

  return (
    <div className="hold-list">
      {Array.isArray(data) &&
        data.map((item) => {
          return renderItem(item);
        })}
    </div>
  );
};
