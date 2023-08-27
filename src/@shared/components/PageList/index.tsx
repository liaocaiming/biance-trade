import React from "react";

import TableComponent, {
  ITableComponentProps,
  IColumnProps,
} from "../TableComponent";

import GroupSearch from "../GroupSearch";

import { IProps as IGroupSearchProps } from "../GroupSearch/interface";

import { connect, AppScreen } from "@containers/appScreen";

import Toggle from "@components/Toggle";

import { Button, Card } from "antd";

import { filterEmptyValue } from "@utils/lib/helpers";

import { getSearchData } from "./utils";

import IAllProps from "@typings/react";

export interface IColumn extends IColumnProps {
  isSearch?: boolean; // 是否是搜索条件
}

export interface ITable extends ITableComponentProps {
  columns: IColumn[];
  isChangePageRequest?: boolean;
}

type IRefreshFn = (options?: {
  params?: any;
  pageNo?: number;
  pageSize?: number;
}) => void;
// export interface IProps extends IAllProps {
export interface IProps extends IAllProps {
  url: string; // 列表接口;
  method?: "get" | "post";
  initOption?: {
    isFirst?: boolean;
    params?: object;
    initType?: "actionQuery"; // 表示默认参数可以删除
  };
  tableComponentProps: ITable;
  groupSearchProps?: IGroupSearchProps;
  groupAfterDom?: JSX.Element;
  isShowBreadCrumbNav?: boolean;
  getInstance?: (that: any) => void; // that 获取列表实列
  actionDom?: ((data: any) => JSX.Element) | JSX.Element; // 在 GroupSearch 和 Table 之间的操作内容
  headerDom?: JSX.Element; // 在 GroupSearch 和 面包屑之间的内容
  searchCallBack?: (params: any) => void; // 查询回调
  getRefreshDataFn?: (refreshDataFn: IRefreshFn) => void; // 获取刷新列表数据的函数;
  showSearch?: boolean; // 是否显示搜索条件
  formatList?: (data: any[]) => any[]; // 列表数据;
  [k: string]: any; // 注意使用的时候一样要传 this.props
}

@connect()
export default class App extends React.Component<IProps> {
  private init: any = {};

  constructor(props: IProps) {
    super(props);
    this.init = {
      fetchUrl: props.url,
    };
    const { initOption } = props;
    if (initOption) {
      Object.assign(this.init, { ...initOption });
    }
  }

  public componentDidMount() {
    const { getInstance, getRefreshDataFn } = this.props;
    getInstance && getInstance(this);
    getRefreshDataFn && getRefreshDataFn(this.initData);
  }

  public handleSearch = (params: any) => {
    const options = { params, pageNo: 1 };

    this.initData(options);

    const { searchCallBack } = this.props;
    searchCallBack && searchCallBack(options);
  };

  public linkTo = (href: string) => {
    const { history } = this.props;
    history.push({
      pathname: href,
    });
  };

  public initData: IRefreshFn = (options?: {
    params?: any;
    pageNo?: number;
    pageSize?: number;
  }) => {
    const { params, pageNo, pageSize } = options || {};
    const { actions, method = "get" } = this.props;
    if (pageNo) {
      actions.changeScreenQuery({
        pageNo,
      });
    }

    if (pageSize) {
      actions.changeScreenQuery({
        pageSize,
      });
    }

    if (params) {
      actions.changeScreenActionQuery(filterEmptyValue(params));
    }
    actions.getScreenData({
      method,
    });
  };

  public downExcel = () => {
    const { downExcel, downProps = {} } = this.props;
    const page = this.props.$$screen.getIn(["data", "page"]).toJS();
    const query = this.props.$$screen.getIn(["actionQuery"]).toJS();
    const { isNeedParams = true, url, validatorDownParams } =
      (downProps as any) || {};
    let opt = { ...query };
    if (typeof validatorDownParams === "function") {
      const options = validatorDownParams(opt, page);
      if (options === false) {
        return;
      }

      if (
        typeof options !== "boolean" &&
        Object.prototype.toString.call(options) === "[object Object]"
      ) {
        opt = { ...opt, ...options };
      }
    }

    if (isNeedParams) {
      downExcel &&
        downExcel({
          url,
          params: opt,
          ...downProps,
        })();
      return;
    }
    downExcel &&
      downExcel({
        url,
        ...downProps,
      })();
  };

  public renderSearch() {
    const {
      groupSearchProps = {},
      groupAfterDom,
      downProps,
      rowData,
      tableComponentProps,
      actions,
      $$screen,
    } = this.props;
    const { btnTxt } = downProps || {};
    const { columns } = tableComponentProps;
    const rows = rowData || getSearchData(columns);
    const { config } = this.props.route;
    return (
      <GroupSearch
        rowData={rows}
        actions={actions}
        handleSearch={this.handleSearch}
        isSaveSearchParams
        $$screen={$$screen}
        {...groupSearchProps}
      >
        <Toggle isShow={!!downProps && config && config.export}>
          <Button
            className="margin_left_20"
            type="primary"
            onClick={this.downExcel}
          >
            {btnTxt ||
              (config && config.export && config.export.title) ||
              "下载excel"}
          </Button>
        </Toggle>
        {groupAfterDom}
      </GroupSearch>
    );
  }

  public renderTable() {
    const { tableComponentProps, formatList } = this.props;
    let data =
      (this.props.$$screen.getIn(["data", "list"]) &&
        this.props.$$screen.getIn(["data", "list"]).toJS()) ||
      [];
    const page =
      (this.props.$$screen.getIn(["data", "page"]) &&
        this.props.$$screen.getIn(["data", "page"]).toJS()) ||
      {};
    const { pagination = {}, isChangePageRequest = true } = tableComponentProps;

    if (formatList && typeof formatList === "function") {
      data = formatList(data);
    }

    return (
      <TableComponent
        dataSource={data}
        scroll={{ x: "max-content" }}
        pagination={{
          total: page.totalCount,
          current: page.pageNo,
          pageSize: page.pageSize,
          pageSizeOptions: ["10", "20", "50", "100"],
          showQuickJumper: true,
          ...pagination,
          onChange: (pageNo: number, pageSize?: number) => {
            if (!isChangePageRequest) {
              return;
            }
            this.initData({ pageNo });
          },
          onShowSizeChange: (current: number, pageSize: number) => {
            if (!isChangePageRequest) {
              return;
            }
            this.initData({ pageNo: 1, pageSize });
          },
        }}
        {...tableComponentProps}
      />
    );
  }

  public render() {
    let { headerDom, actionDom, showSearch = true } = this.props;
    const data =
      this.props.$$screen.getIn(["data"]) &&
      this.props.$$screen.getIn(["data"]).toJS();
    if (typeof actionDom === "function") {
      actionDom = actionDom(data);
    }

    return (
      <AppScreen {...this.props} initOption={this.init}>
        <Card>
          {headerDom}
          {showSearch ? this.renderSearch() : null}
          {actionDom}
          {this.renderTable()}
        </Card>
      </AppScreen>
    );
  }
}
