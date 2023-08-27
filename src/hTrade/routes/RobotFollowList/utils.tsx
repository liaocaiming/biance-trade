
import moment from "moment";

import { calculate } from '@utils/index'

export const getRangeTime = (): any[] => {
  const curDay = moment().get("date");
  if (curDay <= 15) {
    return [moment().date(1), moment()];
  }
  return [moment().date(15), moment()];
};


export const sum = (data: any[], key: string) => {
  if (!Array.isArray(data) || data.length === 0) {
    return 0
  }
  return data.reduce((total, item) => {
    return calculate.add(total, item[key] || 0)
  }, 0)
}

sum([{ age: 1 }, { age: 1 }, { age: 1 }], 'age')