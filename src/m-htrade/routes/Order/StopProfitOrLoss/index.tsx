import React, { useState } from "react";

import { AppForm } from "@src/m-htrade/components/index";

import { FormItemOptions } from "@src/m-htrade/components/Form/interface";

import { validatorParams } from "../utils";

import { calculate, constants } from '@utils/index'

import { Button, Toast } from 'antd-mobile'

import './index.less';

interface IProps {
  detail?: any;
  onFinish?: (params: any) => void;
}


const target = [1];

export default (props: IProps) => {
  const { detail = {}, onFinish } = props;
  const { take_profit_present = [] } = detail;

  const [targets, setTargets] = useState(target)


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

  let formData: FormItemOptions[] = [
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

    // {
    //   label: "移动止盈",
    //   name: "move_take_profit",
    //   type: "switch",
    // },

    // {
    //   label: "跟随系统止损",
    //   name: "stop_order",
    //   type: "switch",
    // },
  ];

  if (!detail.symbol) {
    formData = [];

    targets.map((item, index) => {
      const isFirst = index === 0;

      formData.push(
        {
          name: `entry_${index}`,
          label: isFirst ? '平仓价格' : '',
          rules: [
            {
              required: true,
              message: '请输入平仓价格'
            },
            {
              pattern: constants.pattern.number,
              message: '平仓价格必须是数字'
            }
          ],
          eleAttr: {
            placeholder: '平仓价格'
          }
        },
        {
          name: `take_profit_present@${index}`,
          label: isFirst ? '平仓百分比(%)' : '',
          rules: [
            {
              required: true,
              message: '请输入平仓百分比'
            },
            {
              pattern: constants.pattern.number,
              message: '平仓百分比必须是数字'
            }
          ],
          eleAttr: {
            placeholder: '平仓百分比'
          }
        },
      )
    })

  }

  const onAddBtnClick = () => {
    let arr = [...targets];
    let last = arr[arr.length - 1] + 1;
    arr.push(last);
    setTargets(arr);
  }


  const renderAfterDOM = () => {
    return (
      <div className='add_btn'>
        <Button size='small' inline type='ghost' onClick={onAddBtnClick}>添加+</Button>
      </div>
    )
  }



  return (
    <div className="stopProfit">
      <AppForm
        formItems={formData}
        onFinish={onMulSelectFinish}
        initialValues={{ ...detail }}
        afterDom={renderAfterDOM()}
        submitOptions={{
          text: "完成",
        }}
      />
    </div>
  );
};
