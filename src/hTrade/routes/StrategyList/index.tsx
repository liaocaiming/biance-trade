import React from 'react';
import { PageList, Toggle } from '@components/index';
import linkPort from '@src/hTrade/config/api'; // 注意: 不是boss项目的请修改路径
import { connect } from '@containers/appScreen';
import IProps from '@typings/react.d';
import { Button, message, Modal } from 'antd';
import { Link } from '@components/index';
import AddModal from './AddModal';
import EditModal from './EditModal';

import { s_type, period_type, set_type } from '@src/hTrade/constants';

// import { rowObj } from "./constants";

import { isOrNot } from '@utils/lib/constants';

interface IState {
  isShow?: boolean;
  isShowAddModal?: boolean;
  isShowEditModal?: boolean;
  [key: string]: any;
}

const renderItemOrNot = value => {
  const label = isOrNot.find(item => item.value == value)?.label;

  return <span className={`${value == '1' ? 'green' : 'red'}`}>{label}</span>;
};

const renderRate = value => {
  return <span>{value && Number(value) * 100}</span>;
};
@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem: any = {};

  private row: any = [
    {
      title: '策略名称',
      dataIndex: 'name',
      align: 'center',
      fixed: true,
    },

    {
      title: '交易类型',
      dataIndex: 'set_type',
      showList: true,
      type: 'select',
      list: set_type,
    },

    {
      title: '推送类型',
      dataIndex: 's_type',
      showList: true,
      type: 'select',
      list: s_type,
    },

    {
      title: '周期',
      dataIndex: 'period_type',
      showList: true,
      type: 'select',
      list: period_type,
    },

    {
      title: '止损数量',
      dataIndex: 'loss_sum',
    },

    {
      title: '止盈数量',
      dataIndex: 'success_sum',
    },

    {
      title: '杠杆倍数',
      dataIndex: 'leverage',
    },
    {
      title: 'k线周期',
      dataIndex: 'interval',
    },

    {
      title: '涨跌幅%',
      dataIndex: 'change_rate',
      render: renderRate,
    },
    {
      title: '100EMA和200EMA的距离%',
      dataIndex: 'entry_distance_rate',
      width: 150,
      render: renderRate,
    },
    {
      title: '止损百分比%',
      dataIndex: 'loss_rate',
      render: renderRate,
    },
    {
      title: '最小交易量',
      dataIndex: 'min_volume',
    },

    {
      title: '涨幅周期',
      dataIndex: 'kline_day',
    },

    {
      title: '菲波指数',
      dataIndex: 'feibo',
      render: (value: string) => {
        const arr = (value && value.split(',')) || [];
        return (
          <div>
            {arr.map((it: string) => {
              return (
                <span
                  style={{
                    padding: '5px 10px',
                    marginRight: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                  }}
                >
                  {it}
                </span>
              );
            })}
          </div>
        );
      },
    },

    {
      title: '是否推送企业微信',
      dataIndex: 'start',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },
    {
      title: '是否推送至机器人',
      dataIndex: 'push_bot',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },

    {
      title: '是否推送至soso',
      dataIndex: 'push_soso',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },

    {
      title: '是否推送至币多分',
      dataIndex: 'push_biduofeng',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },

    {
      title: '是否推送到app',
      dataIndex: 'push_app',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },

    {
      title: '是否程序全程控制',
      dataIndex: 'bot_control',
      width: 150,
      showList: true,
      type: 'select',
      list: isOrNot,
      render: renderItemOrNot,
    },

    {
      title: '操作',
      dataIndex: 'remark',
      fixed: 'right',
      render: (value: string, record: any) => {
        const { route } = this.props;
        const { s_type } = record;

        return (
          <div>
            <Button type="link" className="margin_right_10">
              <Link
                to={{ pathname: `${route.path}/show` }}
                search={{ id: record.id }}
              >
                查看
              </Link>
            </Button>

            {/* <Toggle isShow={s_type != 2}> */}
            <Button
              type="link"
              className="margin_right_10"
              onClick={this.toggle('isShowEditModal', true, record)}
            >
              编辑
            </Button>
            {/* </Toggle> */}

            <Toggle isShow={s_type == 2}>
              <Button
                type="link"
                className="margin_right_10"
                onClick={this.toggle('isShowAddModal', true, record)}
              >
                新增手动推单
              </Button>
            </Toggle>

            <Button
              type="link"
              className="margin_right_10"
              onClick={this.stopOrStart({ record, type: '1' })}
            >
              启动
            </Button>
            <Button
              type="link"
              className="margin_right_10"
              onClick={this.stopOrStart({ record, type: '2' })}
            >
              停止
            </Button>
          </div>
        );
      },
    },
  ];

  constructor(props: IProps) {
    super(props);
    this.state = {
      isShow: false,
      isShowAddModal: false,
      isShowEditModal: false,
    };
  }

  private stopOrStart = (options: { record: any; type: '1' | '2' }) => {
    return () => {
      const { record, type } = options;
      const { actions } = this.props;
      const { name, id } = record;
      const map = {
        1: {
          content: `确定启动${name}策略么?`,
          url: linkPort.trade_signals_update,
        },
        2: {
          content: `确定停止${name}策略么?`,
          url: linkPort.trade_signals_update,
        },
      };

      Modal.confirm({
        title: '确认提示',
        content: map[type].content,
        onOk: async () => {
          const status = type;

          const res = await actions.post(map[type].url, {
            id,
            start: status,
            push_bot: status,
            push_app: status,
            push_soso: status,
          });
          message.success(res.message || '成功');
          actions.changeScreenQuery({
            page: 1,
          });
          actions.getScreenData();
        },
      });
    };
  };

  private toggle = (
    key: 'isShow' | 'isShowAddModal' | 'isShowEditModal',
    value = false,
    item: any = {},
  ) => {
    return () => {
      this.changeItem = item;
      this.setState({
        [key]: value,
      });
    };
  };

  private renderAddModal = () => {
    const { isShowAddModal } = this.state;
    if (!isShowAddModal) {
      return null;
    }
    return (
      <AddModal
        onCancel={this.toggle('isShowAddModal', false)}
        actions={this.props.actions}
        detail={this.changeItem}
      />
    );
  };

  private renderEditModal = () => {
    const { isShowEditModal } = this.state;
    const { actions } = this.props;
    if (!isShowEditModal) {
      return null;
    }
    return (
      <EditModal
        onCancel={this.toggle('isShowEditModal', false)}
        actions={actions}
        detail={this.changeItem}
        onSuccess={() => {
          actions.changeScreenQuery({
            page: 1,
          });
          actions.getScreenData();
          this.toggle('isShowEditModal', false)();
        }}
      />
    );
  };

  public render() {
    return (
      <div>
        <PageList
          {...this.props}
          url={linkPort.trade_signals}
          tableComponentProps={{
            columns: this.row,
            align: 'center',
            scroll: { x: 'max-content', y: '60vh' },
          }}
          formatList={(data: any[]) => {
            let list =
              data &&
              data.map((item: any) => {
                const { configuration_list = [] } = item;
                configuration_list.map((it: any) => {
                  const { key, value } = it;
                  item[key] = value;

                  return {
                    [key]: value,
                  };
                });

                return { ...item };
              });

            return list;
          }}
          showSearch={false}
        />

        {this.renderAddModal()}
        {this.renderEditModal()}
      </div>
    );
  }
}
