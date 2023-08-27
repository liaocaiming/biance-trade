import React from "react";
import { PageList, Toggle } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { Button, Card, message, Modal } from "antd";
import DetaiModal from "./DetaiModal";
import { orderStatus } from "@src/hTrade/constants/index";
import { query } from "@utils/index";
import "./index.less";
import { isOrNot } from "@utils/lib/constants";

interface IState {
  isShow: boolean;
  selectIds: string[]
}

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem = {};

  private row: any[] = [

    {
      dataIndex: "symbol",
      title: "币种",
    },
    {
      dataIndex: "signal_type",
      title: "策略编码",
      isSearch: true,
      searchDataIndex: 'trade_signal_id'
    },

    {
      dataIndex: "push",
      title: "是否推送",
      type: 'select',
      list: isOrNot
    },


    {
      dataIndex: "operate",
      title: "操作",
      render: (val: string, item: any) => {
        const { push, id } = item;
        return (
          <div>
            <Toggle isShow={push === 2}>
              <a onClick={() => {
                this.startOrStop({
                  ids: [id],
                  push: 1
                })
              }}>
                开启推送
              </a>
            </Toggle>

            <Toggle isShow={push === 1}>
              <a onClick={() => {
                this.startOrStop({
                  ids: [id],
                  push: 2
                })
              }}>
                关闭推送
              </a>
            </Toggle>

          </div>

        );
      },
    },
  ];

  constructor(props: IProps) {
    super(props);
    this.state = {
      isShow: false,
      selectIds: []
    };
  }

  private startOrStop = (params: { ids?: string[], push: 1 | 2 }) => {
    const { push } = params;
    const map = {
      1: {
        content: '确定开启推送么？',
      },
      2: {
        content: '确定关闭推送么？'
      }
    }
    Modal.confirm({
      title: '确认提示',
      content: map[push].content,
      onOk: async () => {
        const { actions } = this.props;
        const res = await actions.post(linkPort.trade_signals_set_symbol, params);
        message.success(res.message || '成功')
        actions.changeScreenQuery({
          page: 1,
        });
        actions.getScreenData();
        this.setState({
          selectIds: []
        })
      }
    })
  }

  private toggle = (options: { key: "isShow"; value; item?: any }) => {
    return () => {
      const { key, value, item } = options;
      if (item) {
        this.changeItem = item;
      }

      this.setState({
        [key]: value,
      });
    };
  };

  private renderDetaiModal = () => {
    const { actions } = this.props;
    const { isShow } = this.state;

    return (
      <DetaiModal
        actions={actions}
        query={this.changeItem}
        isShow={isShow}
        title="订单详情"
        onCancel={this.toggle({ key: "isShow", value: false })}
      />
    );
  };

  private renderBtn = () => {
    return (
      <div className='margin_bottom_20 btn-container'>
        <div className='margin_right_20 btn'>
          <Button type='primary' className='margin_right_20' onClick={this.onBatchChange(1)}>批量开启推送</Button>
          <Button type='primary' danger onClick={this.onBatchChange(2)}>批量关闭推送</Button>
        </div>

        <div className='btn'>
          <Button type='primary' className='margin_right_20' onClick={this.onAllChange(1)}>开启所有推送</Button>
          <Button type='primary' danger onClick={this.onAllChange(2)}>关闭所有推送</Button>
        </div>

      </div>
    )
  }

  // 1: 开器， 2: 关闭
  private onBatchChange = (type: 1 | 2) => {
    return () => {
      const { selectIds = [] } = this.state;
      if (selectIds.length === 0) {
        message.warn('请先选择数据')
        return;
      }
      this.startOrStop({
        ids: selectIds,
        push: type
      })
    }
  }

  // 1: 开器， 2: 关闭
  private onAllChange = (type: 1 | 2) => {
    return () => {
      this.startOrStop({
        push: type
      })
    }
  }

  render() {

    return (
      <Card title="手动推送列表" className="strategyItem">
        <PageList
          initOption={{
            params: {
              signal_id: query.getUrlQuery().id,
            },
          }}
          {...this.props}
          url={linkPort.trade_signals_symbol_info}
          tableComponentProps={{
            columns: this.row,
            rowKey: 'id',
            rowSelection: {
              selectedRowKeys: this.state.selectIds,
              onChange: (ids: string[]) => {
                this.setState({
                  selectIds: ids
                })
              }
            }
          }}
          actionDom={this.renderBtn}
          groupSearchProps={{
            isShowResetBtn: true,
          }}
        />

        {this.renderDetaiModal()}
      </Card>
    );
  }
}
