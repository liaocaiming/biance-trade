import React, { useState } from "react";

import "./index.less";
import IProps from "@typings/react.d";
import { Icon } from "antd-mobile";
import { pageUrlsMap } from "@src/m-htrade/config/routes";
import { Modal } from "antd-mobile";
import { ORDER_TYPE } from "@utils/lib/constants";
import { queryToParamsStr } from "@utils/index";

const { operation } = Modal;
interface IList {
  title: string;
  key: string;
}

const list: IList[] = [
  {
    title: "现执行策略",
    key: "1",
  },
  {
    title: "官方推荐策略",
    key: "2",
  },
  // {
  //   title: "自定义策略",
  //   key: "3",
  // },
];

interface IParams {
  key?: string;
  order_type?: string;
}

const params: IParams = {};

const style: React.CSSProperties = {
  color: "#0078ff",
};

export default (props: IProps) => {
  const { history } = props;
  const goTo = (url: string, params: object = {}) => {
    return () => {
      history.push({
        pathname: url,
        search: queryToParamsStr(params),
      });
    };
  };

  // const operationData = ORDER_TYPE.map((item) => {
  //   return {
  //     text: item.label,
  //     onPress: () => {
  //       console.log(item);
  //     },
  //     style: {
  //       color: "#0078ff",
  //     },
  //   };
  // });

  const showSelectOrderTye = (key: string) => {
    return () => {
      // 现货:1,杠杆:2,合约:3
      params.key = key;
      operation([
        {
          text: "现货",
          onPress: () => {
            params.order_type = "1";
            goTo(pageUrlsMap.strategyItem, params)();
          },
          style,
        },
        {
          text: "杠杆",
          onPress: () => {
            params.order_type = "2";
            goTo(pageUrlsMap.strategyItem, params)();
          },
          style,
        },
        {
          text: "合约",
          onPress: () => {
            params.order_type = "3";
            goTo(pageUrlsMap.strategyItem, params)();
          },
          style,
        },
      ]);
      // history.push({
      //   pathname: pageUrlsMap.strategyItem,
      //   key,
      // });
    };
  };

  return (
    <div className="strategy-list">
      <div>
        {list.map((item) => {
          return (
            <div
              className="list-item"
              key={item.key}
              onClick={showSelectOrderTye(item.key)}
            >
              <span className="item-label">{item.title}</span>
              <Icon type="right" />
            </div>
          );
        })}
      </div>
      <div className="goback" onClick={goTo(pageUrlsMap.home)}>
        返回
      </div>
    </div>
  );
};
