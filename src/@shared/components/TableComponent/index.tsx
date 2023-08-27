import * as React from 'react';

import { Table, Popover } from 'antd';

import './index.less';

import { TableProps, ColumnProps } from 'antd/lib/table';

import Toggle from '../Toggle';
import isObject from '@utils/lib/isObject';

export enum ItemType {
  // 下拉选择框
  select = 'select',

  // input 输入框
  input = 'input',
  // 数组类输入框
  number = 'number',
  datePicker = 'datePicker',
  rangePicker = 'rangePicker',
  timePicker = 'timePicker',
  timeRangePicker = 'timeRangePicker',
  cascader = 'cascader',
  // 数字范围
  numberRanger = 'numberRanger',
}

export type Type = keyof typeof ItemType;

interface IList {
  value: string | number;
  label: string;
}

export interface IColumnProps extends ColumnProps<any> {
  emptyPlaceholder?: string; // 空数据占位符;
  currency?: string; // 是否货币;
  showPop?: boolean; // 是否需要悬浮提示
  isShow?: boolean | (() => boolean); // 是否显示
  type?: Type; // 类型;
  showList?: boolean; // s是否使用自动匹配下拉框;
  list?: IList[]; // 下拉框
  [random: string]: any;
}

export interface ITableComponentProps extends TableProps<any> {
  columns: any[];
  isShowStatistics?: boolean; // 是否显示统计数据
  selectedNum?: number; // 选中的数量
  dataSource?: any[];
  pagination?: any;
  rowKey?: any;
  isFixed?: boolean; // 默认是false,是否两边需要固定;
  align?: 'left' | 'center' | 'right';
  [random: string]: any;
}

interface ITableComponentState {
  selectKeys: string[];
}

export default class TableComponent extends React.Component<
  ITableComponentProps,
  ITableComponentState
> {
  private columnWidth: number = 150;
  private selectKeys: any[] = [];

  private isFirst: boolean = false;

  constructor(props: ITableComponentProps) {
    super(props);
    this.state = {
      selectKeys: [],
    };
  }

  public UNSAFE_componentWillMount() {
    this.modifyColData(this.props);
  }

  public componentDidMount() {
    const { rowSelection = {} } = this.props;
    const { selectedRowKeys = [] } = rowSelection;
    this.selectKeys = selectedRowKeys;
  }

  public UNSAFE_componentWillReceiveProps(nextProps: ITableComponentProps) {
    const { selectedRowKeys = [] } = nextProps.rowSelection || {};

    if (
      JSON.stringify(this.props.rowSelection?.selectedRowKeys) !==
      JSON.stringify(nextProps.rowSelection?.selectedRowKeys)
    ) {
      const { selectedRowKeys = [] } = nextProps.rowSelection || {};
      if (selectedRowKeys.length === 0) {
        this.selectKeys = [];
      }
    }

    if (selectedRowKeys.length > 0 && !this.isFirst) {
      this.isFirst = true;
      this.selectKeys = selectedRowKeys;
    }

    this.modifyColData(nextProps);
  }

  // 修改列数据
  public modifyColData = (nextProps: ITableComponentProps) => {
    let { columns, align } = nextProps;
    columns.map(item => {
      if (align && !item.align) {
        item.align = align;
      }

      if (item.render) {
        return true;
      }
      const { showList = true } = item;
      if (item.type === 'select' && showList && item.list) {
        let list: IList[] = item.list;
        if (isObject(list)) {
          list = Object.keys(list).map(key => {
            return {
              value: key,
              label: list[key],
            };
          });
        }
        item.render = (val: any) => {
          if (typeof val === 'string' || typeof val === 'number') {
            return list.find(it => it.value == val)?.label || val;
          }

          if (Array.isArray(val)) {
            let labels: any[] = [];
            list.forEach(item => {
              const is = val.some(v => v == item.value);
              if (is) {
                labels.push(item.label);
              }
            });

            return labels.join(',') || (val && val.join(','));
          }

          return null;
        };
      }

      if (item.showPop) {
        item.render = (text: any) => {
          let txt = text;
          if (txt === undefined && item.emptyPlaceholder) {
            return item.emptyPlaceholder;
          }

          if (Array.isArray(text)) {
            txt = text.join('、');
          }
          return (
            <Popover
              content={<div className="table-popover">{txt}</div>}
              trigger="hover"
              overlayClassName="authName-popover"
            >
              <div
                style={{ maxWidth: item.width || '150px' }}
                className="txt_ellipsis"
              >
                {txt}
              </div>
            </Popover>
          );
        };
      }
      return true;
    });
  };

  // // 修改组件状态
  // public changeState(nextState: ITableComponentState) {
  //   this.setState(nextState);
  // }

  // table底部统计信息
  public renderStatisticsInfo = (totalCount: number, selected: number) => {
    const { rowSelection = {} } = this.props;
    const { selectedRowKeys = [] } = rowSelection;

    return (
      <div className="statistics-info">
        <span className="margin_right_20">
          合计&nbsp;
          <span className="color_red" style={{ fontSize: '20px' }}>
            {totalCount}
          </span>
          &nbsp;条
        </span>
        <span>
          已选择&nbsp;
          <span className="color_red" style={{ fontSize: '20px' }}>
            {selected || selectedRowKeys.length}
          </span>
          &nbsp;条
        </span>
      </div>
    );
  };

  public filterRowData = (rowData: IColumnProps[]) => {
    return rowData.filter((item: IColumnProps) => {
      let is: any = item.isShow;
      if (typeof is === 'function') {
        is = is();
      }
      return !(is === false);
    });
  };

  public setSelectAllRowsData = (
    changeRows: any[],
    selected: boolean,
    rowSelectionType: 'checkbox' | 'radio',
  ) => {
    let selectKeys: any[] = this.selectKeys.slice();
    const { rowKey = 'id' } = this.props;
    if (selected) {
      const keys = changeRows.map((row: any) => {
        return row[rowKey];
      });
      selectKeys = selectKeys.concat(keys);
    } else {
      selectKeys = selectKeys.filter((value: any) => {
        return !changeRows.some((it: any) => {
          return value === it[rowKey];
        });
      });
    }

    if (rowSelectionType === 'radio') {
      this.selectKeys = changeRows.map((row: any) => {
        return row[rowKey];
      });
    } else {
      this.selectKeys = selectKeys;
    }
  };

  public getSelectedRows = (data: any[], selectedKeys: string[]): any[] => {
    if (!Array.isArray(data) || !Array.isArray(selectedKeys)) {
      return [];
    }
    const { rowKey = 'id' } = this.props;
    return data.filter((item: any) => {
      return selectedKeys.indexOf(item[rowKey]) >= 0;
    });
  };

  public rowSelection = () => {
    const { rowSelection, dataSource = [] } = this.props;
    if (!rowSelection) {
      return;
    }
    const { onChange, type = 'checkbox', onSelect, onSelectAll } = rowSelection;

    const params = {
      ...rowSelection,
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        console.log(selectedRowKeys);
      },

      onSelect: (
        record: any,
        selected: boolean,
        selectedRows: any[],
        nativeEvent: Event,
      ) => {
        this.setSelectAllRowsData([record], selected, type);
        if (onSelect) {
          onSelect(record, selected, selectedRows, nativeEvent);
        }
        if (onChange) {
          onChange(
            this.selectKeys,
            this.getSelectedRows(dataSource, this.selectKeys),
          );
        }
      },

      onSelectAll: (
        selected: boolean,
        selectedRows: any[],
        changeRows: any[],
      ) => {
        this.setSelectAllRowsData(changeRows, selected, type);
        if (onChange) {
          onChange(
            this.selectKeys,
            this.getSelectedRows(dataSource, this.selectKeys),
          );
        }

        if (onSelectAll) {
          onSelectAll(selected, selectedRows, changeRows);
        }
      },
    };
    return params;
  };

  // 处理表头传进来的数据
  /*
   * columns: 表头数据;
   * isFixed: 是否要fixed
   * min: 表头超过多少时要处理;
   */
  public handleColumns = (columns: any[], isFixed: boolean): any[] => {
    let res: any[] = columns && columns.slice();
    if (!isFixed) {
      return res;
    }

    let firstIsKey = false;

    res = res.map((column: any, index: number) => {
      const width = column.width || this.columnWidth;
      if (index === 0) {
        if (column.dataIndex === 'key') {
          firstIsKey = true;
          return Object.assign({}, column, {
            fixed: 'left',
            width: column.width || 50,
          });
        }
        return Object.assign({}, column, { fixed: 'left', width });
      } else if (index === 1 && firstIsKey) {
        return Object.assign({}, column, { fixed: 'left', width });
      } else if (index === res.length - 1) {
        return Object.assign({}, column, { fixed: 'right', width });
      } else {
        return Object.assign({}, column, { width });
      }
    });

    return res;
  };

  public calculateFixedWidthSum = (
    data: any[],
    key: string,
    min: number = 0,
  ): number => {
    let sum: number = min;
    if (!Array.isArray(data)) {
      return 1000;
    }
    data.forEach((column: any) => {
      if (typeof column[key] === 'number') {
        sum += column[key];
      }
    });
    return sum;
  };

  public render() {
    const {
      columns,
      pagination,
      children,
      isFixed = false,
      isShowStatistics,
      selectedNum = 0,
      dataSource = [],
    } = this.props;
    const scroll = {};
    const rows = this.filterRowData(columns);
    const rowData = this.handleColumns(rows, isFixed);
    if (isFixed) {
      const width = this.calculateFixedWidthSum(rowData, 'width', 50);
      Object.assign(scroll, { x: width });
    }
    const newDataSource = dataSource.slice();

    if (pagination && pagination.align === 'left') {
      return (
        <div className={'tableComponent left'}>
          <Table
            scroll={scroll}
            {...this.props}
            dataSource={newDataSource}
            rowSelection={this.rowSelection()}
            columns={rowData}
          />
          <div className={'tableComponent-children clearfix'}>
            {children}{' '}
            <Toggle isShow={isShowStatistics}>
              {this.renderStatisticsInfo(
                pagination && pagination.total,
                selectedNum,
              )}
            </Toggle>
          </div>
        </div>
      );
    }

    return (
      <div className={'tableComponent'}>
        <Table
          scroll={scroll}
          {...this.props}
          dataSource={newDataSource}
          rowSelection={this.rowSelection()}
          columns={rowData}
        />
        <div className={'tableComponent-children clearfix'}>
          {children}{' '}
          <Toggle isShow={isShowStatistics}>
            {this.renderStatisticsInfo(
              pagination && pagination.total,
              selectedNum,
            )}
          </Toggle>
        </div>
      </div>
    );
  }
}
