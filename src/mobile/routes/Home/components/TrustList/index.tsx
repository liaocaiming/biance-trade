import React from "react";
import { helpers } from "@utils/index";
import "./index.less";
import { marginType } from "../../constants";
import { Toggle } from "@shared/components";

interface IProps {
  data: object[];
  unbindRobot?: (id: string) => () => void;
}

export default (props: IProps) => {
  const { unbindRobot, data } = props;

  const renderItem = (detail: any) => {
    const {
      side,
      symbol,
      margin_type,
      leverage,
      avg_price,
      quantity,
      id,
    } = detail

    return (
      <div className="trust-item">
        <div className="first-line row buy">
          <div className="left">
            <span
              className={helpers.reactClassNameJoin([
                "margin_right_5 direction",
                "direction",
                side ? "buy" : "sale",
              ])}
            >
              {side ? '买' : '卖'}
            </span>
            <span className="icon">{symbol}</span>
          </div>

          <div className="right">
            <span className="margin_right_5">{marginType[margin_type]}</span>
            <Toggle isShow={parseInt(leverage) > 0}>
              <span>{leverage}X</span>
            </Toggle>
          </div>
        </div>

        <div className="third-line row">
          <div className="col">
            <div className="title">买入仓位</div>
            <div className="value">{quantity}</div>
          </div>

          <div className="col">
            <div className="title">买入价钱</div>
            <div className="value">{avg_price}</div>
          </div>

          <div className="unbind-btn">
            <span className="btn" onClick={unbindRobot && unbindRobot(id)}>
              解绑机器人
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="trust-list">
      {Array.isArray(data) &&
        data.map((item) => {
          return renderItem(item);
        })}
    </div>
  );
};
