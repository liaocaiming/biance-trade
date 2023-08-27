import React, { memo } from "react";

import {
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Cascader,
} from "antd";

import { ItemType, IRow } from "./interface.d";

const { RangePicker } = DatePicker;

const { RangePicker: TimeRangePicker } = TimePicker;

const itemInputComponents = {
  [ItemType.select]: Select,

  [ItemType.input]: Input,
  [ItemType.datePicker]: DatePicker,
  [ItemType.rangePicker]: RangePicker,
  [ItemType.timePicker]: TimePicker,
  [ItemType.timeRangePicker]: TimeRangePicker,
  [ItemType.number]: InputNumber,
  [ItemType.cascader]: Cascader,
};

function InputElement(props: IRow): JSX.Element {
  const { type = "input", eleAttr = {} } = props;

  const ItemInput = itemInputComponents[type] || Input;

  return <ItemInput {...eleAttr} />;
}

export default memo(InputElement);
