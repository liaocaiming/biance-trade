import React, { memo, useState } from "react";

import { Toggle } from "@components/index";

import { Radio } from 'antd-mobile';


import "./index.less";

interface IList {
  value: string | number;
  label: string;
}

interface IProps {
  label?: string | JSX.Element;
  containerClassName?: string;
  data?: IList[];
  value?: string[] | number[];
  onChange?: (values: string[] | number[]) => void;
}

export default (props: IProps) => {
  const { label, containerClassName, data = [], onChange } = props;
  const [value, setValues] = useState<any[]>([])

  const onCheckBoxChange = (item: any) => {
    return () => {
      console.log(value);
      setValues(item.value);
      onChange && onChange(item.value);
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
            return (
              <div key={item.value}>
                <Radio onChange={onCheckBoxChange(item)}>
                  {item.label}
                </Radio>
              </div>
            )
          })
        }
      </div>
    </div >
  );
};
