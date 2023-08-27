import React, { useState, useEffect } from "react";

import { Switch } from "antd-mobile";

import { Toggle } from "@components/index";

import "./index.less";

interface IProps {
  label?: (() => string | JSX.Element) | (string | JSX.Element);
  value: boolean;
  containerClassName?: string;
  children?: JSX.Element;
  onChange?: (value: boolean) => void;
}

export default (props: IProps) => {
  const [checked, setChecked] = useState(false);
  const {
    label,
    containerClassName,
    children,
    value = false,
    onChange,
  } = props;
  const onSwitchChange = (val: boolean) => {
    onChange && onChange(val);
  };

  useEffect(() => {
    setChecked(value);
  }, [value]);

  return (
    <div className={`mb-switch ${containerClassName || ""}`}>
      <Toggle isShow={!!label}>
        <span className="switch-label label">{label}</span>
      </Toggle>
      <Switch checked={checked} onChange={onSwitchChange} />
      {children}
    </div>
  );
};
