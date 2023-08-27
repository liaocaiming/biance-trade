import React from "react";

import { openType } from "../constants";

import { AppForm } from "@src/mobile/components/index";

import { FormItemOptions } from "@src/mobile/components/Form/interface";

import { validatorParams } from "../utils";

import { calculate } from "@utils/index";

import { Toast } from "antd-mobile";

interface IProps {
  detail?: any;
  onFinish?: (params: any) => void;
}

export default (props: IProps) => {
  const { detail = {}, onFinish } = props;

  const { entry_present = [] } = detail;

  const formData: FormItemOptions[] = [
    {
      label: "开单方式",
      name: "entry_type",
      type: "select",
      data: openType,
      rules: [
        {
          required: true,
          message: "请选择开单方式",
        },
      ],
    },

    {
      label: "第一批",
      name: "entry_present@0",
      initialValue: entry_present[0],
      type: "input",
      eleAttr: {
        type: "number",
        children: <span className="unit">$</span>,
      },
    },

    {
      label: "第二批",
      name: "entry_present@1",
      initialValue: entry_present[1],
      type: "input",
      eleAttr: {
        type: "number",
        children: <span className="unit">$</span>,
      },
    },

    {
      label: "第三批",
      name: "entry_present@2",
      initialValue: entry_present[2],
      type: "input",
      eleAttr: {
        type: "number",
        children: <span className="unit">$</span>,
      },
    },
  ];

  const onMulSelectFinish = (params) => {
    const values: any = validatorParams(params);
    const { open_margin } = detail;
    const { entry_present = [] } = values;
    const sub = entry_present.reduce((total: number, num: number) => {
      return calculate.add(total, num);
    }, 0);

    if (parseFloat(open_margin) !== sub) {
      Toast.fail(`总和(${sub})不等于每单保证金(${open_margin})`);
      return;
    }
    onFinish && onFinish(params);
  };

  return (
    <AppForm
      formItems={formData}
      onFinish={onMulSelectFinish}
      initialValues={{ ...detail, entry_type: "1" }}
      submitOptions={{
        text: "下一步",
      }}
    />
  );
};
