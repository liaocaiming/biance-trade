import React, { useState, useEffect } from "react";

import OpenSet from "./OpenSet";

import StopProfitOrLoss from "./StopProfitOrLoss";

import Steps from "./Steps";

import { validatorParams } from "./utils";

import { api } from "@src/m-htrade/config/index";

import { fetch } from "@utils/index";

import "./index.less";

import IProps from "@typings/react.d";

import { Toast } from "antd-mobile";

import { pageUrlsMap } from "@src/m-htrade/config/routes";
import { SessionStorage } from "@utils/lib/Storage";

interface IComponent {
  detail: any;
  onFinish: (value: any) => void;
}

const components = [
  {
    step: 0,
    title: "开单设置",
    component: (props: IComponent) => <OpenSet {...props} />,
  },
  {
    step: 1,
    title: "止盈止损",
    component: (props: IComponent) => <StopProfitOrLoss {...props} />,
  },
];

export default (props: IProps) => {
  const [step, setStep] = useState(0);
  const detail: any = SessionStorage.getItem('post-detail') || {};
  const { symbol, entry, loss, dist_arr } = detail || {}
  const onTabsChange = (value) => {
    setStep(value);
  };

  const postData = (params: any) => {
    fetch.post(api.orderOpenSettingsUpdate, params).then((res) => {
      if (res.message) {
        Toast.success(res.message, 1, () => {
          const { history } = props;
          history.push(pageUrlsMap.home);
        });
      }
    });
  };

  const onSave = (values) => {
    if (step >= components.length - 1) {
      const params: any = validatorParams({ ...detail, ...values });
      if (params.is_limit_num === false) {
        params.max_follow_sum = -1;
      }
      postData({ ...params, set_type: 3 });
      return;
    }
    setStep(step + 1);
  };

  const renderSteps = () => {
    return (
      <div>
        <Steps current={step} onChange={onTabsChange} />
      </div>
    );
  };

  useEffect(() => {
    return () => {
      SessionStorage.removeItem('post-detail');
    }
  }, [])
  const renderTotalContent = () => {
    if (!symbol) {
      return null
    }
    return (
      <div className="total">
        <p className='order__symbol'>{symbol}</p>
        <p className="order__range"><span className="label">挂单区间：</span><span className='value'>{entry}</span></p>
        <p className="order__range"><span className="label">止损价格：</span><span className='value'>{loss}</span></p>
        <p className="order__range order_profit">
          <span className='label'>止盈目标：</span>
          {
            dist_arr.map((item, index) => {
              return <span className='value' key={String(index)}>{item}</span>
            })
          }
        </p>
      </div>
    )
  }


  const item = components[step];

  return (
    <div className="mb-order">
      {renderSteps()}
      {renderTotalContent()}
      <div className="form-container">
        <div className="line" />
        {item.component({
          detail,
          onFinish: onSave,
        })}
      </div>
    </div>
  );
};
