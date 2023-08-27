import React, { useEffect, useReducer, memo, useMemo, useCallback } from "react";

import { FormOptions, FormItemOptions, FormType } from "./interface.d";

import { Input, Select } from "@src/m-htrade/components/index";

import reducer, { init, initValue } from "./reducer";

import { filterFormItems } from "./utils";

import { filterObjAttr, validator } from "@utils/index";

import { Toggle } from "@components/index";

import { Toast } from "antd-mobile";

import Switch from "@src/m-htrade/components/Switch";

import { Store } from './interface'

import Checkbox from '../CheckBox';

import Radio from '../Radio';

import "./index.less";

const obj = {
  autocomplete: 'off'
}

const ItemComponents = {
  [FormType.input]: Input,
  [FormType.select]: Select,
  [FormType.switch]: Switch,
  [FormType.checkbox]: Checkbox,
  [FormType.radio]: Radio,

};

const Form = (props: FormOptions) => {
  const [state, dispatch] = useReducer(reducer, initValue, init);
  let {
    formItems,
    initialValues,
    onError,
    onFinish,
    onValuesChange,
    submitOptions = { text: "确定" },
    getRef,
    afterDom: formAfterDOM
  } = props;
  const formRowData = useMemo(() => filterFormItems(formItems, state), [
    formItems,
    state,
  ]);
  const { btnAttr = {} } = submitOptions;

  const getFieldValue = useCallback((key: string) => {
    return state[key]
  }, [state]);

  const setFieldsValue = useCallback((values: Store) => {
    dispatch({
      type: "all",
      payload: values || {},
    });
  }, [state]);

  const getFieldsValue = useCallback(() => {
    return state
  }, [state])


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


  useEffect(() => {
    if (typeof getRef === 'function') {
      getRef({
        getFieldValue,
        getFieldsValue,
        setFieldsValue
      })
    }
  }, [state])
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

  if (typeof formAfterDOM === 'function') {
    formAfterDOM = formAfterDOM(state)
  }

  return (
    <div className="mb-form">
      <div className="mb-form-container">
        {formRowData.map((formItem) => {
          let { type = "input", eleAttr = {}, name = "", afterDom, render } = formItem;
          if (typeof afterDom === "function") {
            afterDom = afterDom(state);
          }

          const ItemElement = ItemComponents[type] || Input;

          if (typeof render === 'function') {
            return render({
              form: {
                getFieldValue,
                getFieldsValue,
                setFieldsValue
              }
            })
          }
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
                  id={name}
                  value={state[name]}
                  onChange={onItemChange(formItem)}
                  {...obj}
                  {...options}
                  {...eleAttr}
                />
              </div>
              <div>{afterDom}</div>
            </div>
          );
        })}
      </div>
      <div>
        {formAfterDOM}
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
