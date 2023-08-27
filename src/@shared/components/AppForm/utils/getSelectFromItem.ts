import {
  SelectListItem,
  ListFieldNames,
} from '../interface.d';

export default function getSelectFromItem(item: SelectListItem, fieldNames?: ListFieldNames): ListFieldNames {
  if (!fieldNames) {
    return item;
  }
  return {
    value: item.value !== undefined ? item.value : item[fieldNames.value],
    label: item.label || item[fieldNames.label],
  };
}
