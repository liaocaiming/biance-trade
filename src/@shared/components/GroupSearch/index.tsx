import React from "react";

import { Button } from "antd";

import moment from "moment";

import "./index.less";

import { helpers, trim } from "@utils/index";

import Toggle from "@components/Toggle";

import NumberRanger from "./NumberRanger";

import SizeContext from "antd/lib/config-provider/SizeContext";

import SessionStorage from "@utils/lib/SessionStorage";

import {
  dateFormat,
  monthFormat,
  sizeClassNameMap,
  widthMap,
  placeholderMap,
} from "./constants";

import {
  filterRowData,
  deleteHiddenSearchValue,
  initSelectData,
  getPopupContainer,
  handleOldData,
  findItem,
  disabledDate,
} from "./utils";

import ItemElement from "./ItemElement";

import { IRow, IProps, IObject, IState } from "./interface";

import isObject from "@utils/lib/isObject";

export default class GroupSearch extends React.Component<IProps, IState> {
  static contextType = SizeContext;

  private areaList: any[] = [];
  // 处理搜索参数, 保存搜索参数;
  private Search = {
    url: window.location.hash.split("#")[1].split("?")[0],
    searchParams: {}, // 保存搜索原数据;
    is: false, // 是否需求保存搜索数据;
    init: (props: IProps) => {
      const {
        isSaveSearchParams = true,
        actions,
        $$screen,
        defaultValues = {},
      } = props;
      const { href } = window.location;
      if (isSaveSearchParams && actions && $$screen && href.indexOf("?") < 0) {
        this.Search.is = true;
        this.Search.searchParams = defaultValues;
      }
    },
    save: (props: IProps) => {
      if (!this.Search.is) {
        return;
      }
      const { $$screen } = props;
      const page =
        ($$screen.getIn(["query"]) && $$screen.getIn(["query"]).toJS()) || {};
      const actionQuery =
        ($$screen.getIn(["actionQuery"]) &&
          $$screen.getIn(["actionQuery"]).toJS()) ||
        {};
      SessionStorage.setItem("groupSearch-params", {
        ...this.Search.get(),
        [this.Search.url]: { actionQuery, page },
      });
    },
    set: (props: IProps) => {
      if (!this.Search.is) {
        return;
      }
      const {
        actions,
        dateKeys = [], // 选择时间的字段
        rangePickerKeys = [], // 时间区域的字段
        monthPicker = [],
        map = {}, // map字段转换;
      } = props;
      const options = this.Search.get()[this.Search.url];
      if (!options) {
        return;
      }

      const { searchParams = {}, actionQuery = {}, page = {} } = options;
      if (Object.keys(actionQuery).length > 0) {
        actions.changeScreenActionQuery(actionQuery);
      }

      if (Object.keys(page).length > 0) {
        actions.changeScreenQuery(page);
      }
      const params = {
        ...searchParams,
        ...actionQuery,
      };
      if (Object.keys(params).length > 0) {
        const keys = dateKeys.concat(rangePickerKeys).concat(monthPicker);
        this.Search.searchParams = this.Search.formatData(params, keys, map);
        this.setState({
          searchParams: this.Search.searchParams,
        });
      }
    },

    get: (): IObject => {
      return SessionStorage.getItem("groupSearch-params") || {};
    },

    formatData: (options: any, keys: string[], map: any): any => {
      const res: any = Object.create(null);
      // 处理时间日期
      Object.keys(options).forEach((key: string) => {
        const value = options[key];
        if (keys.indexOf(key) !== -1) {
          if (Array.isArray(value)) {
            res[key] = [moment(value[0]), moment(value[1])];
          } else {
            res[key] = moment(value);
          }
        } else {
          res[key] = value;
        }
      });

      // 处理日期时间段
      keys.filter((key: string) => {
        if (key.indexOf("&") !== -1) {
          const [k1, k2] = key.split("&");
          if (options[k1] && options[k2]) {
            Object.assign(res, {
              [key]: [moment(options[k1]), moment(options[k2])],
            });
          }
        } else if (options[key]) {
          Object.assign(res, { [key]: moment(options[key]) });
        }
      });

      // 处理map数据
      const mapKeys = Object.keys(map);
      if (mapKeys.length) {
        mapKeys.forEach((key: string) => {
          const k = map[key];
          if (options[k]) {
            Object.assign(options, { [key]: options[k] });
          }
        });
      }

      return { ...options, ...res };
    },
  };

  constructor(props: IProps) {
    super(props);
    const { defaultValues = {}, isFilterRegion = false } = props;
    this.state = {
      searchParams: defaultValues,
      selectData: initSelectData(props),
      fetchSelectData: {},
    };
    this.Search.init(props);
  }

  componentDidMount() {
    this.getSelectData();
    const { getInstance, rowData = [] } = this.props;
    getInstance && getInstance(this);
    this.Search.set(this.props);
    this.getFetchConfigsData(rowData);
  }

  UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    const { props } = this;

    if (
      (props !== nextProps && props.selectMap !== nextProps.selectMap) ||
      props.multipleSelectMap !== nextProps.multipleSelectMap
    ) {
      this.setState((preState: IState) => {
        const params = { ...preState.selectData, ...initSelectData(nextProps) };
        return { selectData: params };
      });
    }

    if (
      props !== nextProps &&
      props.defaultValues !== nextProps.defaultValues &&
      nextProps.defaultValues &&
      JSON.stringify(props.defaultValues) !==
        JSON.stringify(nextProps.defaultValues)
    ) {
      this.setState({
        searchParams: nextProps.defaultValues,
      });
      this.Search.searchParams = nextProps.defaultValues;
    }

    if (
      props !== nextProps &&
      props.selectKeys !== nextProps.selectKeys &&
      JSON.stringify(props.selectKeys) !== JSON.stringify(nextProps.selectKeys)
    ) {
      // 如果a个组件引用了这个组件，那么a组件被b组件多次引用，从b传到a的数据字典key,就更新一次，这里要监听更新一下。
      this.getSelectData(nextProps);
    }
  }

  componentWillUnmount() {
    this.Search.save(this.props);
  }

  private getFetchConfigsData = (rowData: IRow[]) => {
    if (!Array.isArray(rowData) || rowData.length === 0) {
      return;
    }
    return rowData.forEach((row: IRow) => {
      const { fetchConfig } = row;
      if (fetchConfig && fetchConfig.lazy !== true) {
        this.onDropdownVisibleChange(true, row);
      }
    });
  };

  private getSelectData(nextProps?: IProps) {
    const { actions, selectKeys = [], mulSelectKeys = [], rowData = [] } =
      nextProps || this.props;
    let keys = selectKeys.concat(mulSelectKeys);
    if (!actions) {
      return;
    }

    // 记录数据字典要转换的字段
    let map = {};
    rowData.forEach((row) => {
      const { dict, searchDataIndex, dataIndex, name } = row;
      const key = searchDataIndex || dataIndex || name;

      if (dict) {
        keys.push(dict);
        if (dict !== key) {
          map[dict] = key;
        }
      }
    });

    if (keys.length <= 0) {
      return;
    }

    actions
      .get("dict/getDicItemsByCode", { code: keys.join(",") })
      .then((json: any) => {
        if (json.success && json.data) {
          const { data } = json;
          const options = helpers.changeObjKey(data, map);
          this.setState((preState: IState) => {
            const params = { ...preState.selectData, ...options };
            return { selectData: params };
          });
        }
      });
  }

  private search: any = (isReset?: boolean) => {
    return () => {
      const {
        handleSearch,
        map,
        validateSearchParams,
        rowData = [],
      } = this.props;
      const { searchParams: res } = this.state;
      const searchParams = deleteHiddenSearchValue(rowData, res);

      let params: any = Object.create(null);
      Object.keys(searchParams).forEach((key: string) => {
        const item = findItem(rowData, key) as IRow;
        let { type, eleAttr } = handleOldData(this.props, item);
        if (item.type) {
          type = item.type;
        }

        if (key.indexOf("@") !== -1) {
          // 数据字典有冲突时,加前缀, 后面的时用搜索的字段
          const k = key.split("@")[1];
          params[k] = searchParams[key];
        } else if (key.indexOf("&") !== -1) {
          // 处理时间选择区间的问题, 太多地方用了, 不想自定义了, 好烦, dataIndex: startDate&endData, 用&连接
          const keys = key.split("&");
          const values = searchParams[key];
          const format =
            (item && item.eleAttr && item.eleAttr.format) || dateFormat;
          if (values && Array.isArray(values) && values.length > 1) {
            params[keys[0]] = values[0].format(format);
            params[keys[1]] = values[1].format(format);
          }
        } else if (type === "datePicker") {
          let format = dateFormat;
          if (eleAttr && eleAttr.picker === "month") {
            format = monthFormat;
          }
          Object.assign(params, {
            [key]: searchParams[key] && searchParams[key].format(format),
          });
        } else {
          params[key] = searchParams[key];
        }
      });

      if (map) {
        params = helpers.changeObjKey(params, map);
      }

      if (validateSearchParams && typeof validateSearchParams === "function") {
        const options = validateSearchParams(
          helpers.filterEmptyValue(trim(params)),
          isReset
        );
        if (options === false) {
          return;
        }
        if (
          typeof options !== "boolean" &&
          Object.prototype.toString.call(options) === "[object Object]"
        ) {
          params = { ...params, ...options };
        }
      }

      if (handleSearch) {
        const newRes = helpers.filterEmptyValue(trim(params));
        const isSave = handleSearch(newRes, isReset);
        if (isSave && this.Search.is) {
          this.Search.searchParams = newRes;
        }
      }
    };
  };

  private clearSearch = () => {
    const { defaultValues = {} } = this.props;
    this.setState(
      {
        searchParams: defaultValues,
      },
      this.search(true)
    );
  };

  private changeSearchValue = (item: any) => {
    return (e: any, others?: any) => {
      const { onValuesChange } = this.props;
      const dataIndex: string =
        item.searchDataIndex || item.dataIndex || item.name;
      let value: any;
      let onValuesChangeReturnObj = {};

      if (e && e.target) {
        value = e.target.value;
      } else {
        value = e;
      }

      this.setState((preState: IState) => {
        const params = { ...preState.searchParams, [dataIndex]: value };
        if (onValuesChange && typeof onValuesChange === "function") {
          const returnObj = onValuesChange(params, dataIndex, e, others);
          if (typeof returnObj === "object") {
            onValuesChangeReturnObj = returnObj;
          }
        }
        return { searchParams: { ...params, ...onValuesChangeReturnObj } };
      });
    };
  };

  private onDropdownVisibleChange = (open: boolean, item: IRow) => {
    if (!open) return;
    const { fetchSelectData } = this.state;
    const dataIndex: string =
      item.searchDataIndex || item.dataIndex || item.name || "";
    // 如果是异步的 Select
    if (item.fetchConfig) {
      const { url, method = "get", params, resultKey } = item.fetchConfig;
      let selectData = fetchSelectData[dataIndex];
      if (!selectData) {
        selectData = {
          loading: false,
          data: [],
          hasLoad: false,
        };
        fetchSelectData[dataIndex] = selectData;
      }
      const { loading, hasLoad } = selectData;
      if (loading || hasLoad) return;
      selectData.loading = true;
      this.setState({
        fetchSelectData,
      });
      // 开始加载
      const { actions } = this.props;
      actions[method](url, params || {}, { showLoading: false })
        .then((json: any) => {
          if (json && json.success && json.data) {
            const list = (resultKey ? json.data[resultKey] : json.data) || [];
            selectData.data = list;
          }
          selectData.loading = false;
          selectData.hasLoad = true;
          this.setState({
            fetchSelectData,
          });
        })
        .catch(() => {
          selectData.loading = false;
          this.setState({
            fetchSelectData,
          });
        });
    }
  };

  private renderSearchItem = (item: IRow) => {
    const { searchParams } = this.state;

    const dataIndex = item.searchDataIndex || item.dataIndex || item.name || "";

    // 处理历史接口
    const { eleAttr: attr = {}, type: eleType = "input" } = handleOldData(
      this.props,
      item
    );

    let { eleAttr = attr, fieldNames, type = eleType } = item;

    if (item.renderSearch && typeof item.renderSearch === "function") {
      return item.renderSearch(item, this.state, this.changeSearchValue);
    }

    // 处理数字范围输入
    if (type === "numberRanger") {
      return (
        <NumberRanger
          row={{ dataIndex }}
          searchParams={this.state.searchParams}
          onChange={this.changeSearchValue}
        />
      );
    }

    // 处理省市区选择
    if (type === "cascader") {
      eleAttr = { ...eleAttr, options: this.areaList };
    }

    if (type === "select") {
      const { selectData } = this.state;
      const { listFilters = {}, list } = item;
      let options = list || selectData[dataIndex] || [];
      if (isObject(options)) {
        options = Object.keys(options).map((key) => {
          return {
            value: key,
            label: options[key],
          };
        });
      }

      const { values = [], opposite = false } = listFilters as any;
      if (values.length > 0) {
        options = helpers.getDic(options, values, opposite);
      }
      // 异步数据
      const { fetchSelectData } = this.state;
      const asyncSelectData = fetchSelectData[dataIndex];
      let loading = false;
      if (asyncSelectData) {
        loading = asyncSelectData.loading;
        options = asyncSelectData.data || [];
        eleAttr = {
          loading,
          ...eleAttr,
        };
      }

      if (fieldNames && options) {
        options = options.map((item) => {
          return {
            value: item[fieldNames?.value || ""],
            label: item[fieldNames?.label || ""],
          };
        });
      }

      eleAttr = {
        options,
        getPopupContainer,
        onDropdownVisibleChange: (open: boolean) =>
          this.onDropdownVisibleChange(open, item),
        allowClear: true,
        ...eleAttr,
      };
    }

    if (["datePicker", "rangePicker"].includes(type)) {
      eleAttr = { disabledDate, ...eleAttr };
    }

    eleAttr = {
      placeholder: placeholderMap[type],
      value: searchParams[dataIndex],
      onChange: this.changeSearchValue(item),
      style: {
        width: "100%",
      },
      ...eleAttr,
    };

    return <ItemElement type={type} eleAttr={eleAttr} />;
  };

  private renderResetBnt = () => {
    const { isShowResetBtn } = this.props;
    if (isShowResetBtn) {
      return (
        <Button onClick={this.clearSearch} className="fl margin_left_20">
          重置
        </Button>
      );
    }
    return null;
  };

  private renderSearchContent() {
    const { rowData, btnAfterSearch } = this.props;
    const { searchParams } = this.state;

    const rowArr = filterRowData(rowData || [], searchParams);

    if (btnAfterSearch) {
      rowArr.push({
        dataIndex: "btn",
        renderSearch: () => {
          return this.renderBtn("fl");
        },
      });
    }

    return (
      <div
        className={helpers.reactClassNameJoin([
          "group-search-container",
          "clearfix",
        ])}
      >
        {rowArr &&
          rowArr.map((item: IRow) => {
            const dataIndex = item.searchDataIndex || item.dataIndex;
            return (
              <div
                key={dataIndex}
                className={helpers.reactClassNameJoin([
                  `row-item-${dataIndex}`,
                  "row-item",
                  "fl",
                ])}
              >
                <Toggle isShow={!!item.title}>
                  <div className="row-item-label fl">{item.title}:</div>
                </Toggle>
                <div
                  className={helpers.reactClassNameJoin(["fl", "input"])}
                  style={{ minWidth: item.InputWidth || 180 }}
                >
                  {this.renderSearchItem(item)}
                </div>
              </div>
            );
          })}

        {!btnAfterSearch ? this.renderBtn("fl") : null}
      </div>
    );
  }

  private renderFlexSearchContent() {
    const {
      rowData,
      colSpan = 1,
      colMargin,
      containerMinWidth,
      btnAfterSearch,
    } = this.props;
    const { searchParams } = this.state;

    const rowArr = filterRowData(rowData || [], searchParams);

    if (btnAfterSearch) {
      rowArr.push({
        dataIndex: "btn",
        renderSearch: () => {
          return this.renderBtn("fl");
        },
      });
    }

    const rows = helpers.dyadicArray(rowArr, colSpan);

    return (
      <div
        style={{ minWidth: containerMinWidth || widthMap[colSpan] }}
        className={helpers.reactClassNameJoin(["group-search-container"])}
      >
        {rows &&
          rows.map((arr: any, index: number) => {
            return (
              <div
                key={index}
                className="group-search-row group-search-row-flex clearfix"
              >
                {arr.map((item: IRow) => {
                  const dataIndex = item.searchDataIndex || item.dataIndex;
                  const { labelWith = 80 } = item;
                  return (
                    <div
                      key={dataIndex}
                      className={helpers.reactClassNameJoin([
                        `row-item-${dataIndex}`,
                        "row-item",
                        "fl",
                      ])}
                      style={{
                        width: colMargin,
                      }}
                    >
                      <Toggle isShow={!!item.title}>
                        <div
                          className="row-item-label fl"
                          style={{ minWidth: labelWith }}
                        >
                          {item.title}:
                        </div>
                      </Toggle>
                      <div
                        className={helpers.reactClassNameJoin([
                          "fl",
                          "row-item-input",
                        ])}
                        style={{ minWidth: item.InputWidth || 180 }}
                      >
                        {this.renderSearchItem(item)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

        {!btnAfterSearch ? this.renderBtn() : null}
      </div>
    );
  }

  private renderBtn = (className = "") => {
    const { showSearchBtn = true } = this.props;
    if (!showSearchBtn) {
      return <span />;
    }

    return (
      <div
        className={helpers.reactClassNameJoin([
          className,
          "groupSearch-btn-container",
        ])}
      >
        <Button
          type="primary"
          onClick={this.search()}
          className={helpers.reactClassNameJoin(["groupSearch-btn", "fl"])}
        >
          查询
        </Button>

        {this.renderResetBnt()}

        <div className="fl">{this.props.children}</div>
      </div>
    );
  };

  private renderContent() {
    const { colSpan } = this.props;
    if (colSpan) {
      return this.renderFlexSearchContent();
    }
    return this.renderSearchContent();
  }

  render() {
    const size = this.context;

    return (
      <div
        className={helpers.reactClassNameJoin([
          "fezs-group-search-new-container",
          sizeClassNameMap[size || "large"],
        ])}
      >
        {this.renderContent()}
      </div>
    );
  }
}
