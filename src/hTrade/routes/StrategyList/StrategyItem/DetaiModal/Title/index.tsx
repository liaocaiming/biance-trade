import React from "react";
import { constants, arrToObj } from "@utils/index";
import { Toggle } from "@shared/components";
import moment from "moment";
import './index.less'

const ORDER_TYPE_MAP: any = arrToObj(constants.ORDER_TYPE);

interface IProps {
  detail: any;
}

const formatDetail = (detail: any) => {
  const { dist_profit_rate, dist, entry: entry_price, dist_time = '' } = detail;
  const dist_profit_rate_arr =
    (dist_profit_rate && dist_profit_rate.split(",")) || [];
  const dist_arr = (dist && dist.split(",")) || [];
  const entry = entry_price && entry_price.replace(",", "-");
  const dist_time_arr = dist_time.split(',') || [];
  const profit_arr =
    Array.isArray(dist_arr) &&
    dist_arr.map((value: string, index: any) => {
      return `${value} (${dist_profit_rate_arr[index]})`;
    });

  return { ...detail, entry, profit_arr, dist_time_arr };
};

export default (props: IProps) => {
  const { detail = {} } = props;

  const obj = formatDetail(detail) || {};

  const { profit_arr, entry, set_type, signal_type, loss, symbol, dist_time_arr } = obj;

  return (
    <div className="strategyItem-title">
      <div className="title">
        <div>
          {signal_type}
          {ORDER_TYPE_MAP[set_type]}
        </div>
        <h3>{symbol}</h3>
        {/* <p>利润空间: 50% - 60%</p> */}
      </div>

      <div className="open-space margin_bottom_30">
        <span className="margin_right_10">挂单区间</span>
        <span>{entry}</span>
      </div>
      <div className="target">
        {profit_arr.map((value: string, index: number) => {
          const time = dist_time_arr[index]

          return (
            <p className={time ? 'done' : ''}>
              <span>第{index + 1}目标 <span>{value}</span></span>
              <Toggle isShow={time}>
                <span className='margin_left_10'>完成时间: <span>{moment(Number(time)).format('YYYY-MM-DD hh:mm:ss')}</span></span>
              </Toggle>
            </p>
          );
        })}
      </div>
      <div className="los">
        <p>止损点位: {loss}</p>
      </div>
    </div>
  );
};
