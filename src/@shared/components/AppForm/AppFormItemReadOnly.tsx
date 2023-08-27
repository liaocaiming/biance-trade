import React from "react";
import { SwapRightOutlined } from "@ant-design/icons";

import { getSelectFromItem } from "./utils";
import {
  AppFormItemChildProps,
  ListFieldNames,
  FormItemType,
  Store,
} from "./interface.d";

import "./readonly.less";
import isObject from "@utils/lib/isObject";

type FormType = keyof typeof FormItemType;

/**
 * 时间范围的组件类型
 */
const rangePickerTypes: FormType[] = ["rangePicker", "timeRangePicker"];

/**
 * 以下组件类型渲染组件本身
 * 由样式去控制只读模式
 */
export const ignoreRenderReadValueTypes: FormType[] = ["radio", "checkbox"];

function renderReadonlyTextarea(value: unknown) {
  return (
    <div className="textarea-readonly">
      {String(value)
        .split("\n")
        .map((line) => (
          <p>{line}</p>
        ))}
    </div>
  );
}

function renderReadonlySelect(
  formChildProps: AppFormItemChildProps,
  formStore: Store
) {
  const { value, list, fieldNames, emptyContent = "" } = formChildProps;
  const notFoundItemInSelectText = emptyContent;

  let actualList: unknown[] = [];

  if (typeof list === "function") {
    actualList = list(formStore);
  } else if (Array.isArray(list)) {
    actualList = list;
  } else if (isObject(list)) {
    actualList = Object.keys(list as any).map((key) => {
      return {
        value: key,
        label: (list as any)[key],
      };
    });
  }

  const coverList = actualList.map((item: unknown) =>
    getSelectFromItem(item as ListFieldNames, fieldNames)
  );

  // 判断 value 是否是数组，数组代表 select 是多选模式
  if (Array.isArray(value)) {
    return coverList
      .filter((item) => value.includes(item.value))
      .map((item) => item.label)
      .join("、");
  }

  const findItem = coverList.find((item) => item.value == value);
  return findItem ? findItem.label : notFoundItemInSelectText;
}

/**
 * 是否可格式，主要用于 dayjs 或 moment 对象
 *
 * @param value
 */
function canFormatValue(value: any) {
  return value && typeof value.format === "function";
}

function formatValue(value: any, format: string): string {
  let ret = "";

  if (canFormatValue(value)) {
    ret = value.format(format);
  }

  return ret;
}

function renderReadonlyRangePicker(formChildProps: AppFormItemChildProps) {
  const { eleAttr = {}, type = "input", value } = formChildProps;
  const firstValue = value[0];
  const secondValue = value[1];

  if (canFormatValue(firstValue)) {
    const { format, use12Hours } = eleAttr;
    let formatStr = "YYYY-MM-DD HH:mm:ss";
    const formatStrMap = {
      rangePicker: "YYYY-MM-DD HH:mm:ss",
      timeRangePicker: use12Hours ? "h:mm:ss a" : "HH:mm:ss",
    };
    formatStr = format || formatStrMap[type] || formatStr;
    return (
      <span>
        <span>{formatValue(firstValue, formatStr)}</span>
        <SwapRightOutlined className="readonly-range-separator" />
        <span>{formatValue(secondValue, formatStr)}</span>
      </span>
    );
  }
  return "";
}

const DEFAULT_DATE_FORMAT_STR = "YYYY-MM-DD";

function renderReadonlyPicker(formChildProps: AppFormItemChildProps) {
  const { eleAttr = {}, type = "input", value } = formChildProps;
  const { format } = eleAttr;
  const formatStrMap = {
    datePicker: DEFAULT_DATE_FORMAT_STR,
    timePicker: "HH:mm:ss",
  };
  const { picker } = eleAttr || {};
  let formatStr: string =
    format || formatStrMap[type] || DEFAULT_DATE_FORMAT_STR;

  if (picker) {
    const pickerFormat = {
      week: "YYYY-W周",
      month: "YYYY-MM",
      // eslint-disable-next-line no-useless-escape
      quarter: `YYYY-\QQ`,
      year: "YYYY",
    };
    formatStr = pickerFormat[picker] || formatStr;
  }
  return formatValue(value, formatStr);
}

export default function renderReadValue(
  formChildProps: AppFormItemChildProps,
  formStore: Store
): string | React.ReactNode {
  const { type = "input", value, list, emptyContent = "" } = formChildProps;

  if (value === undefined || value === null) {
    return emptyContent;
  }

  // 下拉框
  if (typeof list === "function" || Array.isArray(list) || isObject(list)) {
    return renderReadonlySelect(formChildProps, formStore);
  }

  // 文本域
  if (type === "textArea") {
    return renderReadonlyTextarea(value);
  }

  // 时间范围处理
  if (
    rangePickerTypes.includes(type) &&
    Array.isArray(value) &&
    value.length > 0
  ) {
    return renderReadonlyRangePicker(formChildProps);
  }

  // 时间格式化处理
  if (canFormatValue(value)) {
    return renderReadonlyPicker(formChildProps);
  }

  // 字符串和数字类型的value直接展示
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return emptyContent;
}
