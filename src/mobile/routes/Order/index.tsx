import React, { useEffect, useState } from "react";

import MulSet from "./MulSet";

import OpenSet from "./OpenSet";

import StopProfitOrLoss from "./StopProfitOrLoss";

import Steps from "./Steps";

import { validatorParams } from "./utils";

import { api } from "@src/mobile/config/index";

import { fetch, User } from "@utils/index";

import "./index.less";

import IProps from "@typings/react.d";

import { Toast } from "antd-mobile";

import { pageUrlsMap } from "@src/mobile/config/routes";

interface IComponent {
  detail: any;
  onFinish: (value: any) => void;
}

const components = [
  {
    step: 0,
    title: "杠杆倍数",
    component: (props: IComponent) => <MulSet {...props} />,
  },
  {
    step: 1,
    title: "开单设置",
    component: (props: IComponent) => <OpenSet {...props} />,
  },
  {
    step: 2,
    title: "止盈止损",
    component: (props: IComponent) => <StopProfitOrLoss {...props} />,
  },
];

export default (props: IProps) => {
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState({});
  const userInfo = User.getUserInfo();

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
    setDetail({ ...detail, ...values });
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

  const getData = () => {
    fetch
      .get(api.getOrderOpenSettingData, { user_id: userInfo.id, set_type: 3 })
      .then((res) => {
        if (res.data) {
          const [item] = res.data || [{}];
          setDetail(item);
        }
      });
  };

  const renderSteps = () => {
    return (
      <div>
        <Steps current={step} onChange={onTabsChange} />
      </div>
    );
  };

  useEffect(() => {
    getData();
  }, [userInfo.id]);

  const item = components[step];

  return (
    <div className="mb-order">
      {renderSteps()}
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
