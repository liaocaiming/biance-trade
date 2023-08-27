import React from "react";

import { filterObjAttr } from "@utils/index";

import { Toggle } from "@components/index";

import "./index.less";

export interface InputProps extends React.InputHTMLAttributes<any> {
  label?: string | JSX.Element;
  containerClassName?: string;
  children?: JSX.Element;
  [k: string]: any;
}

export default (props: InputProps) => {
  const { label, containerClassName, children } = props;

  return (
    <div className={`mb-input ${containerClassName || ""}`}>
      <Toggle isShow={!!label}>
        <div className="label">{label}</div>
      </Toggle>
      <input
        className="input"
        type="text"
        placeholder="请输入"
        {...filterObjAttr(props, ["containerClassName", "label", "children", 'rules'])}
      />

      <div className='children'>{children}</div>
    </div>
  );
};
