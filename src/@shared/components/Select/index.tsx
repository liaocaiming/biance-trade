import React, { useState, memo, useEffect } from "react";

import { Select } from "antd";

import { SelectProps } from "antd/lib/select";

import { valueOnSearch, filterAttr } from "./utils";

interface IList {
  value: string;
  label: string;
}

interface IProps extends SelectProps<any> {
  actions: any;
  method?: "post" | "get";
  url: string; // 接口请求路径
  query?: Object; // 接口请求初始化参数
  searchKey?: string; // 输入搜索请求时用的key
  fieldNames?: { value: string; label: string };
  validatorList?: (data: any[]) => IList[];
}

export default memo((props: IProps) => {
  const {
    query,
    method = "get",
    actions,
    url,
    validatorList,
    fieldNames,
    searchKey = "key",
  } = props;
  const [list, setList] = useState([]);

  const getList = (params: any) => {
    actions[method](url, params).then((res: any) => {
      if (res.data) {
        let data: any = res.data;
        if (validatorList) {
          data = validatorList(data);
        }
        if (fieldNames) {
          data = data.map((item: any) => {
            return {
              value: item[fieldNames.value],
              label: item[fieldNames.value],
            };
          });
        }
        setList(data);
      }
    });
  };

  useEffect(() => {
    if (query && Object.keys(query).length > 0) {
      getList(query);
    }
  }, [query]);

  const selectProps = filterAttr(props, [
    "query",
    "actions",
    "url",
    "validatorList",
    "fieldNames",
    "searchKey",
  ]);
  return (
    <Select
      options={list}
      showSearch
      onSearch={valueOnSearch({
        searchFn: getList,
        searchKey,
      })}
      {...selectProps}
    />
  );
});
