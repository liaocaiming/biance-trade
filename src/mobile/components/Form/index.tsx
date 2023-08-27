import React, { useEffect, useReducer, memo, useMemo } from "react";

import { FormOptions, FormItemOptions, FormType } from "./interface.d";

import { Input, Select } from "@src/mobile/components/index";

import reducer, { init, initValue } from "./reducer";

import { filterFormItems } from "./utils";

import { filterObjAttr, validator } from "@utils/index";

import { Toggle } from "@components/index";

import { Toast } from "antd-mobile";

import Switch from "@src/mobile/components/Switch";

import "./index.less";

const ItemComponents = {
  [FormType.input]: Input,
  [FormType.select]: Select,
  [FormType.switch]: Switch,
};

const Form = (props: FormOptions) => {
  const [state, dispatch] = useReducer(reducer, initValue, init);
  const {
    formItems,
    initialValues,
    onError,
    onFinish,
    onValuesChange,
    submitOptions = { text: "确定" },
  } = props;
  const formRowData = useMemo(() => filterFormItems(formItems, state), [
    formItems,
    state,
  ]);
  const { btnAttr = {} } = submitOptions;

  useEffect(() => {
    const res = Object.assign({}, initialValues, state);
    formItems.forEach((formItem) => {
      const { name, initialValue } = formItem;
      if (initialValue) {
        res[name] = initialValue;
      }
      let { isShow } = formItem;
      if (typeof isShow === "function") {
        isShow = isShow(state);
      }

      if (isShow === false) {
        delete res[name];
      }
    });

    dispatch({
      type: "all",
      payload: res,
    });
  }, [initialValues, formItems]);

  const onItemChange = (item: FormItemOptions) => {
    return (value) => {
      let val = value;
      if (val.target) {
        val = val.target.value;
      }
      const values = { [item.name]: val };
      dispatch({
        payload: values,
      });
      onValuesChange && onValuesChange({ ...state, ...values }, item);
    };
  };

  const onSubmit = () => {
    validator(state, formRowData).then((rule) => {
      if (rule) {
        if (onError) {
          onError(rule);
        } else {
          Toast.fail(rule.message);
        }
        return;
      }
      onFinish && onFinish(state);
    });
  };

  return (
    <div className="mb-form">
      <div className="mb-form-container">
        {formRowData.map((formItem) => {
          let { type = "input", eleAttr = {}, name = "", afterDom } = formItem;
          if (typeof afterDom === "function") {
            afterDom = afterDom(state);
          }

          const ItemElement = ItemComponents[type] || Input;
          const options: any = filterObjAttr(formItem, [
            "type",
            "isShow",
            "eleAttr",
            "rules",
            "initValue",
          ]);

          return (
            <div
              className={`form-item-container form-item-${name}`}
              key={formItem.name}
            >
              <div className="form-item-ele">
                <ItemElement
                  value={state[name]}
                  onChange={onItemChange(formItem)}
                  {...options}
                  {...eleAttr}
                />
              </div>
              <div>{afterDom}</div>
            </div>
          );
        })}
      </div>
      <Toggle isShow={!!submitOptions}>
        <div
          className={`form-btn-container ${submitOptions.containerClassName ||
            ""}`}
          onClick={onSubmit}
        >
          <span {...btnAttr}>{submitOptions.text}</span>
        </div>
      </Toggle>
    </div>
  );
};

export default memo(Form);
