import React from "react";

import { AppForm } from "@src/mobile/components/index";

import { FormItemOptions } from "@src/mobile/components/Form/interface";

import { validatorParams } from "../utils";

import { calculate } from '@utils/index'

import { Toast } from 'antd-mobile'

interface IProps {
  detail?: any;
  onFinish?: (params: any) => void;
}

export default (props: IProps) => {
  const { detail = {}, onFinish } = props;
  const { take_profit_present = [] } = detail;
  const onMulSelectFinish = (params) => {
    const values: any = validatorParams(params);
    const { take_profit_present = [] } = values
    const sub = take_profit_present.reduce((total: number, num: number) => {
      return calculate.add(total, num)
    }, 0)

    if (parseFloat(sub) !== 100) {
      Toast.fail(`总和(${sub}%)不等于100%`)
      return
    }

    onFinish && onFinish(params);
  };

  const formData: FormItemOptions[] = [
    {
      label: "目标1",
      name: "take_profit_present@0",
      initialValue: take_profit_present[0],
      type: "input",
      eleAttr: {
        type: 'number',
        children: <span className="unit">%</span>,
      },
      rules: [
        // {
        //   required: true,
        //   message: "请输入目标一",
        // },
      ],
    },

    {
      label: "目标2",
      name: "take_profit_present@1",
      initialValue: take_profit_present[1],
      type: "input",
      eleAttr: {
        type: 'number',
        children: <span className="unit">%</span>,
      },
      rules: [
        // {
        //   required: true,
        //   message: "请输入目标一",
        // },
      ],
    },

    {
      label: "目标3",
      name: "take_profit_present@2",
      initialValue: take_profit_present[2],
      type: "input",
      eleAttr: {
        type: 'number',
        children: <span className="unit">%</span>,
      },
      rules: [
        // {
        //   required: true,
        //   message: "请输入目标一",
        // },
      ],
    },

    {
      label: "目标4",
      name: "take_profit_present@3",
      initialValue: take_profit_present[3],
      type: "input",
      eleAttr: {
        type: 'number',
        children: <span className="unit">%</span>,
      },
      rules: [
        // {
        //   required: true,
        //   message: "请输入目标一",
        // },
      ],
    },

    {
      label: "移动止盈",
      name: "move_take_profit",
      type: "switch",
    },

    {
      label: "跟随系统止损",
      name: "stop_order",
      type: "switch",
    },
  ];

  return (
    <AppForm
      formItems={formData}
      onFinish={onMulSelectFinish}
      initialValues={{ ...detail }}
      submitOptions={{
        text: "完成",
      }}
    />
  );
};
