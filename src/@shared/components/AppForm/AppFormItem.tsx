/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { memo } from "react";
import { getIn } from "@utils/index";
import {
  Input,
  Form,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  InputNumber,
  AutoComplete,
} from "antd";
import { FormInstance, Rule } from "antd/lib/form";

import {
  AppFormItemElementProps,
  AppFormItemChildProps,
  ItemFunctionKey,
  SelectListItem,
  ListFieldNames,
  Store,
  NamePath,
  FormInputAttr,
  FormItemType,
  // DOMFunction,
  // FormItemDOMFunctions,
  ItemBooleanFunction,
} from "./interface.d";
import { getRestProps, createNamePathKey } from "./utils";

import renderReadValue, {
  ignoreRenderReadValueTypes,
} from "./AppFormItemReadOnly";
import isObject from "@utils/lib/isObject";

const { TextArea, Password } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const itemInputComponents = {
  [FormItemType.radio]: RadioGroup,
  [FormItemType.checkbox]: CheckboxGroup,
  [FormItemType.select]: Select,
  [FormItemType.autoComplete]: AutoComplete,
  [FormItemType.password]: Password,

  input: Input,
  textArea: TextArea,
  datePicker: DatePicker,
  rangePicker: RangePicker,
  timePicker: TimePicker,
  timeRangePicker: TimeRangePicker,
  number: InputNumber,

  plainText: "span",
};

const FormItem = Form.Item;

function getSelectFromItem(
  item: SelectListItem,
  fieldNames?: ListFieldNames
): ListFieldNames {
  if (!fieldNames) {
    return item;
  }
  return {
    value: item.value !== undefined ? item.value : item[fieldNames.value],
    label: item.label || item[fieldNames.label],
  };
}

const keyMap = {
  list: "options",
};

// 添加，需要调用函数动态计算的值
function addDynamicValueToAttrs({
  props,
  eleAttr,
  formData,
}: {
  props: AppFormItemChildProps;
  eleAttr: FormInputAttr;
  formData: Store;
}) {
  const keyArr: ItemFunctionKey[] = ["disabled", "placeholder", "list"];

  keyArr.forEach((key) => {
    const curValue = props[key];
    const attrKey = keyMap[key] || key;

    if (typeof curValue === "function") {
      // eslint-disable-next-line no-param-reassign
      eleAttr[attrKey] = curValue(formData);
    } else if (typeof curValue !== "undefined") {
      // eslint-disable-next-line no-param-reassign
      if (key === "list" && isObject(curValue)) {
        eleAttr[attrKey] = Object.keys(curValue).map((key) => {
          return {
            value: key,
            label: curValue[key],
          };
        });
      } else {
        eleAttr[attrKey] = curValue;
      }
    }
  });
}

export function InputElement(
  formChildProps: AppFormItemElementProps
): JSX.Element {
  // 以下为 Antd Form.item 会为其直接子元素 添加 id, value, onChange 三个参数
  const newProps: AppFormItemChildProps = formChildProps as AppFormItemChildProps;
  const {
    render,
    form,
    eleAttr = {},
    fieldNames,
    type = "input",
    numberToString = true,

    // 以下为 Antd Form.item 新增加的属性
    onChange: onItemChange,
    value,
    id,
    editable,
  } = newProps;
  const formData: Store = form?.getFieldsValue(true) || {};
  const { onChange } = eleAttr;

  if (typeof render === "function") {
    return render(newProps, form);
  }

  // 存文本特殊处理
  if (type === "plainText") {
    return value || null;
  }

  // 只读模式渲染
  if (editable === false && !ignoreRenderReadValueTypes.includes(type)) {
    return <span>{renderReadValue(newProps, formData)}</span>;
  }

  // 注意 ant-design Form.Item 新增加的属性
  const commonProps = {
    onChange: (e: any) => {
      let needChangeValues: Store | void;

      // Antd 透传过来的 onChange 函数
      if (typeof onItemChange === "function") {
        onItemChange(e);
      }

      // 自定义的 change 函数
      if (typeof onChange === "function") {
        needChangeValues = onChange(e);
      }

      if (needChangeValues) {
        form.setFieldsValue(needChangeValues);
      }
    },
    value,
    id,
  };

  addDynamicValueToAttrs({ props: newProps, eleAttr, formData });

  const { options } = eleAttr;

  if (Array.isArray(options)) {
    options.forEach((option: ListFieldNames) => {
      const newOption = getSelectFromItem(option, fieldNames);
      const { value: val } = newOption;

      if (numberToString) {
        newOption.value = typeof val === "number" ? String(val) : val;
      }

      Object.assign(option, newOption);
    });
  }

  const ItemInput = itemInputComponents[type] || Input;

  // TODO: 类型定义比较复杂需要依据 type 类型获取具体定义，先禁用 ts检查考虑如何优化
  // @ts-ignore
  return <ItemInput {...eleAttr} {...commonProps} />;
}

function hasRequiredRule({
  rules,
  form,
}: {
  rules?: Rule[];
  form: FormInstance;
  name: NamePath;
}) {
  if (!rules) {
    return false;
  }
  const ret = rules.some((rule) => {
    if (typeof rule === "function") {
      return rule(form).required;
    }

    return rule.required;
  });

  return ret;
}

function getShowValue(isShow?: ItemBooleanFunction, formStore: Store = {}) {
  let curShow = isShow;

  if (typeof isShow === "function") {
    curShow = isShow(formStore);
  }

  return curShow;
}

export default function AppFormItem(
  props: AppFormItemElementProps
): React.ReactElement | null {
  const {
    beforeDOM,
    afterDOM,
    list,
    form,
    label,
    isShow,
    formItems = [],
    required,
    labelCol,
    wrapperCol,
    rules,
    name,
    initialValue,

    // 默认把数字转换成字符串
    numberToString = true,

    dependencies = [],
  } = props;

  // 要排除自定义的属性，避免不支持的属性传递到 antd 的 FormItem
  const restProps = getRestProps(props, [
    "title",
    "beforeDOM",
    "afterDOM",
    "required",
    "render",
    "isShow",
    "eleAttr",
    "numberToString",
    "updateTime",
  ]);
  const options = { form, formItem: props };
  const itemRequired = required || hasRequiredRule({ rules, form, name });
  const hasChild =
    typeof list === "function" ||
    beforeDOM ||
    afterDOM ||
    (formItems && formItems.length > 0);
  let isItemShow = isShow;

  // 把数组转换成字符串
  if (numberToString === true && typeof initialValue === "number") {
    // eslint-disable-next-line no-param-reassign
    restProps.initialValue = `${initialValue}`;
  }

  if (typeof isShow === "function") {
    isItemShow = isShow(form.getFieldsValue(true));
  }

  if (isItemShow === false) {
    return null;
  }

  // 如果有子元素需要动态渲染的
  const childShouldUpdate = (prev: Store, next: Store) => {
    const needCheckNames = [name, ...dependencies];
    const needUpdateResult = needCheckNames.some((curName) => {
      return getIn(prev, curName) !== getIn(next, curName);
    });

    return needUpdateResult;
  };

  return hasChild ? (
    <FormItem
      labelCol={labelCol}
      shouldUpdate={childShouldUpdate}
      wrapperCol={wrapperCol}
      label={label}
      required={itemRequired}
    >
      {({ getFieldsValue }) => {
        return [
          typeof beforeDOM === "function" ? beforeDOM(options) : beforeDOM,
          <FormItem {...restProps} key={createNamePathKey(name)} noStyle>
            <InputElement {...props} />
          </FormItem>,
          formItems
            ? formItems.map((formItem) => {
                // 把数组转换成字符串
                if (
                  formItem.numberToString === true &&
                  typeof formItem.initialValue === "number"
                ) {
                  // eslint-disable-next-line no-param-reassign
                  formItem.initialValue = String(formItem.initialValue);
                }

                return getShowValue(formItem.isShow, getFieldsValue(true)) ? (
                  <FormItem
                    {...formItem}
                    key={createNamePathKey(formItem.name)}
                    noStyle
                  >
                    <InputElement {...formItem} form={form} />
                  </FormItem>
                ) : null;
              })
            : null,
          typeof afterDOM === "function" ? afterDOM(options) : afterDOM,
        ];
      }}
    </FormItem>
  ) : (
    <FormItem {...restProps} required={itemRequired}>
      <InputElement {...props} />
    </FormItem>
  );
}

export const PureAppFormItem = memo(AppFormItem);
