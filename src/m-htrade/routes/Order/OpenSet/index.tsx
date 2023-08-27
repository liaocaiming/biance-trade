import React, { useMemo, useState } from "react";

import { AppForm } from "@src/m-htrade/components/index";

import { FormItemOptions } from "@src/m-htrade/components/Form/interface";

import { validatorParams } from "../utils";

import { constants } from "@utils/index";

import { Button } from 'antd-mobile';

import './index.less';

interface IProps {
  detail?: any;
  onFinish?: (params: any) => void;
}

const open = [1, 2, 3];

export default (props: IProps) => {
  const { detail = {}, onFinish } = props;

  const [opens, setOpens] = useState(open)



  const formData: FormItemOptions[] = useMemo(() => {
    const formItems: FormItemOptions[] = [
      {
        label: "币",
        name: "symbol",
        isShow: !detail.symbol,
        rules: [
          {
            required: true,
            message: "请输入",
          },
        ],
        eleAttr: {
          placeholder: '请输入币名称（如 BTCUSDT）'
        }
      },
    ];

    opens.map((item, index) => {
      const isFirst = index === 0;

      formItems.push(
        {
          name: `entry_${index}`,
          label: isFirst ? '开单价格' : '',
          rules: [
            {
              required: true,
              message: '请输入开单价格'
            },
            {
              pattern: constants.pattern.number,
              message: '开单价格必须是数字'
            }
          ],
          eleAttr: {
            placeholder: '开单价格'
          }
        },
        {
          name: `amount_${index}`,
          label: isFirst ? '成交额($)' : '',
          rules: [
            {
              required: true,
              message: '请输入成交额'
            },
            {
              pattern: constants.pattern.number,
              message: '成交额必须是数字'
            }
          ],
          eleAttr: {
            placeholder: '成交额'
          }
        },
      )
    })

    return formItems;

  }, [opens])

  const onMulSelectFinish = (params) => {
    const values: any = validatorParams(params);
    onFinish && onFinish(values);
  };

  const onAddBtnClick = () => {
    let arr = [...opens];
    let last = arr[arr.length - 1] + 1;
    arr.push(last);
    setOpens(arr);
  }

  const renderAfterDOM = () => {
    return (
      <div className='add_btn'>
        <Button size='small' inline type='ghost' onClick={onAddBtnClick}>添加+</Button>
      </div>
    )
  }

  return (
    <div className="open-set">
      <AppForm
        formItems={formData}
        onFinish={onMulSelectFinish}
        initialValues={{ ...detail, entry_type: "1" }}
        afterDom={renderAfterDOM}
        submitOptions={{
          text: "下一步",
        }}
      />
    </div>
  );
};
