import React from "react";

import { Steps } from "antd-mobile";

const { Step } = Steps;

import "./index.less";

interface IProps {
  current: number;
  onChange?: (step: number) => void;
}

const data = [
  {
    key: "openSet",
    title: "开单设置",
  },
  {
    key: "profitOrLost",
    title: "止盈止损",
  },
];

export default (props: IProps) => {
  const { current, onChange } = props;
  const onStepChange = (index: number) => {
    return () => {
      onChange && onChange(index);
    };
  };
  return (
    <div className="mb-steps">
      <Steps direction="horizontal" size="small" current={current}>
        {data.map((item, index: number) => {
          return (
            <Step
              description={item.title}
              key={item.key}
              onClick={onStepChange(index)}
            />
          );
        })}
      </Steps>
    </div>
  );
};
