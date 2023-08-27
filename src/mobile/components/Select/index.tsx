import React, { useEffect, useState } from "react";

import { filterObjAttr, findItem } from "@utils/index";

import { Toggle } from "@components/index";

import "./index.less";

import { Picker, Icon } from "antd-mobile";

import { AbstractPickerProps } from "antd-mobile/lib/picker/AbstractPicker.d";

interface IList {
  value: string | number;
  label: string;
}

interface IProps {
  label?: string | JSX.Element;
  containerClassName?: string;
  data: IList[];
  value?: string | number;
  children?: JSX.Element;
  pickerProps?: AbstractPickerProps;
  onChange?: (val: string) => void;
}

export default (props: IProps) => {
  const [val, setVal] = useState([]);
  const [txt, setTxt] = useState();

  const {
    label,
    containerClassName,
    children,
    value = "",
    data = [],
    onChange,
  } = props;

  useEffect(() => {
    if (value && data && data.length > 0) {
      const item = findItem(data, value);
      setTxt(item.label);
    }
    if (value) {
      const arr: any = [value]
      setVal(arr);
    } else {
      setVal([])
    }
  }, [value, data]);

  const onPickerChange = (value: any) => {
    const v = value && value[0];
    const item = findItem(data, v);
    setTxt(item.label);
    setVal(value);
    onChange && onChange(v);
  };

  return (
    <span className={`mb-select ${containerClassName || ""}`}>
      <Toggle isShow={!!label}>
        <div className="label">{label}</div>
      </Toggle>
      <Picker data={data} cols={1} value={val} onChange={onPickerChange}>
        <span className="select-show">
          <span className="txt">{txt}</span>
          <Icon type="right" className="icon" />
        </span>
      </Picker>
      {children}
    </span>
  );
};
