import React, { memo, useState } from "react";

import { Toggle } from "@components/index";

import { Checkbox } from 'antd-mobile';


import "./index.less";

interface IList {
  value: string | number;
  label: string;
}

const { CheckboxItem } = Checkbox;

interface IProps {
  label?: string | JSX.Element;
  containerClassName?: string;
  data?: IList[];
  value?: string[] | number[];
  onChange?: (values: any) => void;
  mul?: boolean; // 是否多选
}

export default (props: IProps) => {
  const { label, containerClassName, data = [], onChange, mul = true } = props;
  const [values, setValues] = useState<any>('')

  const onCheckBoxChange = (item: any) => {
    return () => {
      let arr = values && values.slice() || [];
      if (mul) {
        if (arr.includes(item.value)) {
          arr.splice(arr.indexOf(item.value), 1);
        } else {
          arr.push(item.value);
        }
      } else {
        arr = String(item.value)
      }
      setValues(arr);
      onChange && onChange(arr);
    }
  }

  return (
    <div className={`mb-checkbox ${containerClassName || ""}`}>
      <Toggle isShow={!!label}>
        <div className="label">{label}</div>
      </Toggle>
      <div>
        {
          data.map((item) => {
            item.value = String(item.value);
            return (
              <CheckboxItem checked={values.indexOf(item.value) >= 0} key={item.value} onChange={onCheckBoxChange(item)}>
                {item.label}
              </CheckboxItem>
            )
          })
        }
      </div>
    </div>
  );
};
