import React from "react";

import { marginType } from "../constants";

import { creatArrayByLen } from "@utils/index";

import { AppForm } from "@src/mobile/components/index";

import { FormItemOptions } from "@src/mobile/components/Form/interface";

import { constants } from "@utils/index";

const leverageArr = creatArrayByLen(125).map((value) => {
  return { value: `${value}`, label: `${value}X` };
});

interface IProps {
  detail?: any;
  onFinish?: (params: any) => void;
}

export default (props: IProps) => {
  const { detail = {}, onFinish } = props;

  const formData: FormItemOptions[] = [
    {
      label: "开仓模式",
      name: "margin_type",
      type: "select",
      data: marginType,
      rules: [
        {
          required: true,
          message: "请选择开仓模式",
        },
      ],
    },
    {
      label: "开仓倍数",
      name: "leverage",
      type: "select",
      data: leverageArr,
      rules: [
        {
          required: true,
          message: "请选择开仓倍数",
        },
      ],
    },

    {
      label: "每单保证金",
      name: "open_margin",
      type: "input",
      eleAttr: {
        type: "number",
        children: <span className="unit">$</span>,
      },
      rules: [
        {
          required: true,
          message: "请输入全仓每单保证金",
        },
        {
          pattern: constants.pattern.positiveNum,
          message: "每单保证金请输入正整数",
        },
      ],
    },

    {
      label: "逐仓每单开仓保证金",
      name: "isolated_max_margin",
      type: "input",
      isShow: (data) => {
        return data.margin_type == "ISOLATED";
      },
      eleAttr: {
        type: "number",
        children: <span className="unit">$</span>,
      },
      rules: [
        {
          required: true,
          message: "请输入全仓每单保证金",
        },
        {
          pattern: constants.pattern.positiveNum,
          message: "逐仓每单开仓保证金请输入正整数",
        },
      ],
    },
    {
      label: "是否限制开单数量",
      name: "is_limit_num",
      type: "switch",
    },
    {
      label: "限制开单数量",
      isShow: (data: any) => {
        return data.is_limit_num;
      },
      name: "max_follow_sum",
      type: "input",
      rules: [
        {
          pattern: constants.pattern.positiveNum,
          message: "限制开单数量请输入正整数",
        },
      ],
      eleAttr: {
        type: "number",
      },
    },
  ];

  const onMulSelectFinish = (params) => {
    onFinish && onFinish(params);
  };

  return (
    <AppForm
      formItems={formData}
      onFinish={onMulSelectFinish}
      initialValues={{
        is_limit_num: detail.max_follow_sum == -1,
        max_follow_sum:
          detail.max_follow_sum == -1 ? "" : detail.max_follow_sum,
        ...detail,
      }}
      submitOptions={{
        text: "下一步",
      }}
    />
  );
};
