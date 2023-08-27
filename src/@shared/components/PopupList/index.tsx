import * as React from "react";

import { CloseOutlined } from "@ant-design/icons";

import { Button, message, Modal, Checkbox, Spin } from "antd";

import { TableComponent, Toggle } from "@components/index";

import { GroupSearch } from "@components/index";

import { IProps as IGroupSearchProps } from "@components/GroupSearch/interface";

import { ModalProps } from "antd/lib/modal";

import { TableProps } from "antd/lib/table";

import "./index.less";

import { reactClassNameJoin, listDataAddKey } from "@utils/lib/helpers";

import "core-js/features/object/entries";

interface ITable<T> extends TableProps<T> {
  hasPagination?: boolean;
  hasRowSelection?: boolean;
  isAllowNoSelect?: boolean;
}

export interface IProps {
  isShow: boolean;
  columns: any[];
  rowSelectionType?: "checkbox" | "radio";
  isShowSearch?: boolean;
  isShowStatistics?: boolean;
  errTips?: string; // 错误提示
  query?: any;
  url?: string;
  actions?: any;
  method?: "get" | "post"; // 列表的请求方式
  dataSource?: any[];
  changeQuery?: any;
  getResult?: (
    selectedRowKeys: string[],
    selectedRows?: any[],
    selectAllRows?: any[],
    isAll?: boolean,
    searchParams?: any
  ) => void; // 建议使用下的方法 selectedRowKeys: id的组合, selectedRows: 当前也的数据, selectAllRows: // 所有选中的数据, boolean: 是否全选, searchParams 搜索条件,
  getData?: (options: {
    selectedRowKeys?: string[];
    selectedRows?: any[];
    selectAllRows?: any[];
    isAll?: boolean;
    searchParams?: any;
  }) => void; // selectedRowKeys: id的组合, selectedRows: 当前也的数据, selectAllRows: // 所有选中的数据, boolean: 是否全选, searchParams 搜索条件
  onCancel?: () => void;
  defaultValue?: string[];
  isFirstGetData?: boolean; // 显示时是否请求接口
  search?: IGroupSearchProps;
  modal?: ModalProps;
  table?: ITable<any>;
  isShowClearSelectBtn?: boolean; // 是否显示清楚选择按钮;
  topTips?: string | JSX.Element; // 最顶部提示
  maxSelectNum?: number; // 最大可选择的值;
  disabledIds?: any[]; // 禁止选择的ID;
  disabledFn?: (item: any) => boolean; // 处理数据是否要禁用；
  isClearList?: boolean; // 是否清除搜索出来的数据；
  handleSearchClearSelected?: boolean; // 点击搜索是否清楚选中的选项; 默认: true, 当使用getResult获取结果时， 要用到第三个参数（selectAllRows）时， 此参数必须是true, 否则会有问题;
  showSelectedKeys?: string[]; // 要展示预览key的集合;
  selectAllRowsData?: any[]; // 选择的需要预览的数据;
  isSaveAutoCloseModal?: boolean; // 点击确定时是否自动关闭弹窗; 默认为true;
  getTableData?: (json: any) => void; // 获取列表接口返回的数据
  isShowAllSelect?: boolean; // 是否显示全部
  handleOk?: (options: {
    selectedRowKeys: string[];
    selectAllRows?: any[];
    isAll?: boolean;
    searchParams?: any;
    page?: any;
  }) => void; // searchParams 搜索条件
  onSelect?: (selectedRowKeys: string[], selectAllRowsData: any[]) => void; // 选择回调
  getInstance?: (that: any) => void; // 获取组件的实力
  isCheckRequestErrorNotShow?: boolean; // 是否检验接口返回失败时不展示弹窗
  [random: string]: any;
}

interface IState {
  list: any[];
  page: any;
  selectedRowKeys: any[];
  selectAllRowsData: any[];
  isAll: boolean;
  isRequestSuccess: boolean; // 请求是否成功
  loading: boolean;
}

export default class App extends React.PureComponent<IProps, IState> {
  public selectedData: any[] = [];

  public searchObj: any = {};

  public pageSize: any = 20;

  public selectAllRowsObj: any = {}; // 分页记住selectedRows的数据;

  private isPageChange = false; // 是否是page修改导致的;

  constructor(props: IProps) {
    super(props);
    this.state = {
      list: [],
      page: {
        page: 1,
      },
      selectedRowKeys: props.defaultValue || [],
      selectAllRowsData: props.selectAllRowsData || [],
      isAll: false, // 是否全选;
      isRequestSuccess: false,
      loading: false,
    };
  }

  public UNSAFE_componentWillMount() {
    const { getInstance } = this.props;
    getInstance && getInstance(this);
  }

  public UNSAFE_componentWillUpdate(nextProps: IProps, nextState: IState) {
    if (
      JSON.stringify(this.state.selectedRowKeys) !==
      JSON.stringify(nextState.selectedRowKeys)
    ) {
      const { onSelect } = this.props;
      onSelect &&
        onSelect(nextState.selectedRowKeys, nextState.selectAllRowsData);
    }
  }

  public initData = () => {
    this.setState({
      selectedRowKeys: [],
      selectAllRowsData: [],
      isAll: false,
    });
    this.selectedData = [];
  };

  public handleOk = () => {
    const {
      errTips,
      getResult,
      table = {},
      maxSelectNum,
      isSaveAutoCloseModal = true,
      handleOk,
      getData,
    } = this.props;
    const { selectedRowKeys, isAll, page } = this.state;
    if (
      selectedRowKeys.length === 0 &&
      (getResult || getData) &&
      !table.isAllowNoSelect
    ) {
      message.warning(`${errTips || "您还未选数据"}`);
      return;
    }
    if (maxSelectNum && selectedRowKeys.length > maxSelectNum) {
      message.warning(`不能超过${maxSelectNum}条哦`);
      return;
    }

    const { selectAllRowsData } = this.state;

    if (getResult) {
      getResult(
        selectedRowKeys,
        this.selectedData,
        selectAllRowsData,
        isAll,
        this.searchObj
      );
    }

    if (getData) {
      getData({
        selectedRowKeys,
        selectedRows: this.selectedData,
        selectAllRows: selectAllRowsData,
        isAll,
        searchParams: this.searchObj,
      });
    }

    if (handleOk) {
      handleOk({
        selectedRowKeys,
        selectAllRows: selectAllRowsData,
        isAll,
        searchParams: this.searchObj,
        page,
      });
    }

    // this.initData();
    // this.searchObj = {}; // 清空搜索条件;

    if (isSaveAutoCloseModal) {
      this.handleCancel();
    }
  };

  public handleCancel = () => {
    const { onCancel, modal, isClearList } = this.props;
    if (isClearList) {
      this.setState({
        list: [],
        page: {
          page: 1,
        },
      });
    }
    this.searchObj = {}; // 清空搜索条件
    if (onCancel) {
      onCancel();
    }

    if (modal && modal.onCancel) {
      const e: any = {};
      modal.onCancel(e);
    }
  };

  public handleSearch = (obj: any) => {
    const { handleSearchClearSelected = false } = this.props;
    this.searchObj = obj;
    this.getData(obj);
    this.isPageChange = true;
    if (handleSearchClearSelected) {
      this.initData();
    }
  };

  public getData(params: any = {}, nextProps?: IProps) {
    const { actions, url, query, method, getTableData, changeQuery } =
      nextProps || this.props;
    if (!actions || !url) {
      return;
    }

    let searchParams = {
      pageSize: 10,
      page: 1,
    };

    if (this.searchObj) {
      Object.assign(searchParams, this.searchObj);
    }

    if (query) {
      Object.assign(searchParams, query);
    }

    if (params) {
      Object.assign(searchParams, params);
    }

    if (this.pageSize) {
      Object.assign(searchParams, { pageSize: this.pageSize });
    }

    if (changeQuery) {
      searchParams = changeQuery(searchParams)();
    }

    const fetchType = method || "get";
    this.setState({
      loading: true,
    });
    actions[fetchType](url, searchParams, { showLoading: false })
      .then((json: any) => {
        this.setState({
          loading: false,
        });
        if (getTableData) {
          getTableData(json);
        }

        const { data, count, page = 1 } = json;
        if (data && Object.prototype.toString.call(data) === "[object Array]") {
          this.setState(
            {
              list: listDataAddKey(data),
              page: {
                page,
                totalCount: count,
              },
            },
            this.setSelectKeys
          );
          return;
        }

        const { isCheckRequestErrorNotShow } = this.props;
        if (isCheckRequestErrorNotShow) {
          this.setState({
            isRequestSuccess: json.success,
          });
        }
      })
      .catch(() => {
        this.setState(
          {
            list: [],
            page: {},
          },
          this.setSelectKeys
        );
        this.setState({
          loading: false,
        });
      });
  }

  // eslint-disable-next-line react/sort-comp
  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    const { isFirstGetData = true, isClearList } = nextProps;
    if (this.props.isShow !== nextProps.isShow && !nextProps.isShow) {
      // 关闭弹窗时重置数据
      this.initData();
      this.searchObj = {};
      this.isPageChange = false;
      if (isClearList) {
        this.setState({
          list: [],
          page: {},
        });
      }
      return;
    }

    if (
      this.props.isShow !== nextProps.isShow &&
      nextProps.isShow &&
      isFirstGetData
    ) {
      const { defaultValues = {}, map = {} } = nextProps.search || {};
      const params: any = {};
      Object.entries(defaultValues).forEach((item: any) => {
        const [key, value] = item;
        if (map[key] !== undefined) {
          params[map[key]] = value;
          return;
        }
        params[key] = value;
      });
      this.searchObj = params;
      this.getData(params, nextProps);
    }

    if (
      this.props !== nextProps &&
      nextProps.defaultValue &&
      !this.isPageChange
    ) {
      this.setState({
        selectedRowKeys: nextProps.defaultValue || [],
      });
    }

    if (
      this.props !== nextProps &&
      nextProps.selectAllRowsData &&
      !this.isPageChange
    ) {
      this.setState({
        selectAllRowsData: nextProps.selectAllRowsData || [],
      });
    }
  }

  public setSelectAllRowsData = (changeRows: any[], selected: boolean) => {
    let selectAllRowsData: any[] = this.state.selectAllRowsData.slice();
    if (selected) {
      selectAllRowsData = selectAllRowsData.concat(changeRows);
    } else {
      const { table = {} } = this.props;
      const rowKey: any = table.rowKey || "id";
      selectAllRowsData = selectAllRowsData.filter((item: any) => {
        return !changeRows.some((it: any) => {
          return item[rowKey] === it[rowKey];
        });
      });
    }

    const { rowSelectionType = "checkbox" } = this.props;

    if (rowSelectionType === "radio") {
      this.setState({
        selectAllRowsData: changeRows,
      });
    } else {
      this.setState({
        selectAllRowsData,
      });
    }
  };

  public rowSelection = () => {
    const {
      rowSelectionType,
      disabledIds = [],
      table = {},
      disabledFn,
      isShowAllSelect,
    } = this.props;
    const { list } = this.state;
    const params = {
      selectedRowKeys: this.state.selectedRowKeys,
      type: rowSelectionType || "checkbox",
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        this.selectedData = selectedRows;
        this.setState({
          selectedRowKeys,
        });

        if (selectedRowKeys.length !== list.length && isShowAllSelect) {
          this.setState({
            isAll: false,
          });
        }
      },

      getCheckboxProps: (item: any) => {
        let isDisabled = false;
        if (typeof disabledFn === "function") {
          isDisabled = disabledFn(item);
        }
        const { rowKey } = table;
        let id: any;
        if (typeof rowKey === "string") {
          id = item[rowKey];
        }

        if (disabledIds.length > 0) {
          isDisabled = disabledIds.some((val) => String(val) === String(id));
        }

        return {
          disabled: disabledIds.indexOf(id) !== -1 || isDisabled,
        };
      },

      onSelect: (record: any, selected: boolean) => {
        this.setSelectAllRowsData([record], selected);
      },
      onSelectAll: (
        selected: boolean,
        selectedRows: any[],
        changeRows: any[]
      ) => {
        this.setSelectAllRowsData(changeRows, selected);
      },
    };
    return params;
  };

  public deleteSelectedRow = (item: any) => {
    return () => {
      const { table = {} } = this.props;
      const rowKey: any = table.rowKey || "id";
      const value = item[rowKey];
      this.setState((PreState: IState) => {
        const selectedRowKeys = PreState.selectedRowKeys.slice();
        const selectAllRowsData = PreState.selectAllRowsData.slice();
        selectedRowKeys.splice(selectedRowKeys.indexOf(value), 1);
        selectAllRowsData.splice(selectAllRowsData.indexOf(item), 1);
        return {
          selectedRowKeys,
          selectAllRowsData,
        };
      });

      this.selectedData =
        this.selectedData &&
        this.selectedData.filter((it: any) => {
          return it[rowKey] !== value;
        });
    };
  };

  public renderSelectedPreViewContent(
    selectAllRowsData: any[],
    showSelectedKeys?: string[]
  ) {
    if (!Array.isArray(showSelectedKeys) || !Array.isArray(selectAllRowsData)) {
      return null;
    }

    return (
      <div className={selectAllRowsData.length > 0 ? "prevView-container" : ""}>
        {selectAllRowsData &&
          selectAllRowsData.map((item: any, index: number) => {
            return (
              <span key={String(index)} className="preview-item">
                <CloseOutlined
                  className="close"
                  onClick={this.deleteSelectedRow(item)}
                />
                {showSelectedKeys &&
                  showSelectedKeys.map((key: string, idx) => {
                    return (
                      <span
                        key={String(idx)}
                        className={
                          idx !== showSelectedKeys.length - 1
                            ? "margin_right_5"
                            : ""
                        }
                      >
                        {item[key]}
                      </span>
                    );
                  })}
              </span>
            );
          })}
      </div>
    );
  }

  public onAllSelect = (e: any) => {
    this.setState(
      (preState: IState) => {
        return { isAll: e.target.checked };
      },
      () => {
        if (!e.target.checked) {
          this.setState({
            selectAllRowsData: [],
            selectedRowKeys: [],
          });
          this.selectedData = [];
          return;
        }

        this.setSelectKeys();
      }
    );
  };

  public setSelectKeys = () => {
    const { isShowAllSelect, table = {} } = this.props;
    if (!isShowAllSelect) {
      return;
    }
    const { list, isAll } = this.state;
    if (!isAll) {
      return;
    }
    const rowKey: any = table.rowKey || "id";
    const selectedRowKeys = list.map((item: any) => item[rowKey]);
    this.setState({
      selectedRowKeys,
      selectAllRowsData: list,
    });
    this.selectedData = list;
  };

  public render() {
    const {
      query,
      modal = {},
      columns,
      search,
      table = {},
      isShowStatistics,
      isShowSearch,
      dataSource,
      isShow,
      isShowClearSelectBtn,
      topTips,
      showSelectedKeys,
      isShowAllSelect,
    } = this.props;
    const {
      page,
      list,
      selectedRowKeys,
      selectAllRowsData,
      isAll,
      loading,
    } = this.state;
    const pagination: any = {
      defaultCurrent: 1,
      current: page.page,
      defaultPageSize: (query && query.pageSize) || 20,
      showQuickJumper: true,
      total: page.totalCount,
      showSizeChanger: true,
      onChange: (pageNum: number) => {
        const params = {
          page: pageNum,
        };
        if (this.searchObj) {
          Object.assign(params, this.searchObj);
        }
        this.isPageChange = true;
        this.getData(params);
      },
      pageSizeOptions: ["10", "20", "50", "100"],
      onShowSizeChange: (current: number, size: number) => {
        this.pageSize = size;
        this.isPageChange = true;
        this.getData({
          page: 1,
        });
      },
    };
    const { isCheckRequestErrorNotShow } = this.props;
    const { isRequestSuccess } = this.state;
    const visible = isCheckRequestErrorNotShow
      ? isShow && isRequestSuccess
      : isShow;
    return (
      <Modal
        visible={visible}
        onOk={this.handleOk}
        okText="确认"
        cancelText="取消"
        title="商品列表"
        width={1200}
        wrapClassName="popupList"
        {...modal}
        onCancel={this.handleCancel}
      >
        <Toggle isShow={!!topTips}>
          <div className="topTips">{topTips}</div>
        </Toggle>

        <Spin spinning={loading}>
          <Toggle isShow={isShowSearch}>
            <div className="clearfix margin_bottom_20">
              <div style={{ float: "left" }}>
                <GroupSearch
                  rowData={(search && search.rowData) || columns}
                  handleSearch={this.handleSearch}
                  size="large"
                  {...search}
                >
                  <Toggle isShow={isShowAllSelect}>
                    <span className="margin_left_20">
                      <Checkbox checked={isAll} onChange={this.onAllSelect} />
                      <span className="margin_left_5">全选</span>
                    </span>
                  </Toggle>
                </GroupSearch>
              </div>
            </div>
          </Toggle>

          <Toggle isShow={!!showSelectedKeys}>
            {this.renderSelectedPreViewContent(
              selectAllRowsData,
              showSelectedKeys
            )}
          </Toggle>

          <div>
            <div className="productSelect">
              <TableComponent
                {...table}
                dataSource={dataSource || list}
                columns={columns}
                pagination={(table.hasPagination && pagination) || false}
                rowSelection={
                  (table.hasRowSelection && this.rowSelection()) || undefined
                }
                size="small"
              />

              <Toggle isShow={isShowStatistics}>
                <div
                  className={reactClassNameJoin([
                    table.hasPagination ? "statistics-info" : "",
                    page.totalCount <= 0 ? "statistics-noInfo" : "",
                  ])}
                >
                  <span className="margin_right_20">
                    合计&nbsp;
                    <span className="color_red" style={{ fontSize: "20px" }}>
                      {page.totalCount || list.length}
                    </span>
                    &nbsp;条
                  </span>
                  <span>
                    已选择&nbsp;
                    <span className="color_red" style={{ fontSize: "20px" }}>
                      {isAll
                        ? page.totalCount || list.length
                        : selectedRowKeys.length}
                    </span>
                    &nbsp;条
                  </span>
                </div>
              </Toggle>
            </div>
          </div>
        </Spin>

        <Toggle isShow={isShowClearSelectBtn}>
          <div className="btn--clear">
            <Button onClick={this.initData}>清空选择</Button>
          </div>
        </Toggle>
      </Modal>
    );
  }
}
