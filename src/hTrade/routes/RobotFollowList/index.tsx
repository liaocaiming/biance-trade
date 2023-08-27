import React from "react";
import { PageList, Toggle } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { Button, message, Modal } from "antd";
import UserModal from "./UserModal";
import "./index.less";
import { userType, transferStatus, bot_status } from "@src/hTrade/constants";
import { AppForm, PopupList } from "@components/index";
import api from "@src/hTrade/config/api";
import moment from "moment";
import { helpers, User } from "@utils/index";
import { sum } from "./utils";

interface IState {
  isShow?: boolean;
  isShowMoneyRecordModal: boolean;
  isEdit?: boolean;
  isShowErrorModal: boolean;
  [key: string]: any;
}

type OperateType = "edit" | "add";

type ModalType =
  | "isShow"
  | "isShowMoneyRecordModal"
  | "isShowErrorModal"
  | "isEdit";

const renderMoney = (key: string) => {
  return (value: string, record) => {
    return sum(record.bot_infos || [], key);
  };
};

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem: any = {};

  private operateType: OperateType = "add";

  private row: any = [
    {
      title: "邮箱名称",
      dataIndex: "email",
      isSearch: true,
      render: (value: string, record: any) => {
        if (record.exception_count > 0) {
          return <span className="error">{value}</span>;
        }

        return <span>{value}</span>;
      },
    },
    {
      title: "币安uid",
      dataIndex: "binance_user_id",
      isSearch: true,
    },

    // {
    //   title: "机器人创建时间",
    //   dataIndex: "created_at",
    // },

    {
      title: "机器人到期时间",
      dataIndex: "expire_time",
      // isSearch: true,
    },

    {
      title: "未处理异常数量",
      dataIndex: "exception_count",
      // type: "select",
      // list: [
      //   {
      //     value: "1",
      //     label: "资金转出",
      //   },
      //   {
      //     value: "2",
      //     label: "私自开单",
      //   },
      // ],
      // isSearch: true,
    },

    {
      title: "用户类型",
      dataIndex: "user_type",
      showList: true,
      isSearch: true,
      type: "select",
      list: userType,
    },

    {
      title: "本周期盈利金额",
      dataIndex: "profit_loss",
      render: renderMoney("profit_loss"),
    },
    {
      title: "盈利单数",
      dataIndex: "success_sum",
      render: renderMoney("success_sum"),
    },
    {
      title: "亏损单数",
      dataIndex: "loss_sum",
      render: renderMoney("loss_sum"),
    },

    // {
    //   title: "初始资金",
    //   dataIndex: "original_money",
    // },

    {
      title: "每单的U数量",
      dataIndex: "open_margin",
    },

    {
      title: "机器人状态",
      dataIndex: "start_bot",
      list: bot_status,
      type: "select",
      showList: true,
    },

    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      dataIndex: "remark",
      render: (val: string, item: any) => {
        const { route } = this.props;
        const { start_bot } = item;

        return (
          <div>
            <Button type="link" className="margin_right_10">
              <a
                // to={{ pathname: `${route.path}/show` }}
                // search={{ id: item.id }}
                onClick={this.goTo(`${route.path}/show`, item)}
              >
                查看
              </a>
            </Button>
            <Button
              type="link"
              onClick={this.toggle({
                key: "isShow",
                value: true,
                item,
                operateType: "edit",
              })}
            >
              编辑
            </Button>
            <Toggle isShow={start_bot == 1}>
              <Button
                type="link"
                className="margin_right_10"
                onClick={this.stopOrStart({ record: item, type: "2" })}
              >
                停止
              </Button>
            </Toggle>
            <Toggle isShow={start_bot == 2}>
              <Button
                type="link"
                className="margin_right_10"
                onClick={this.stopOrStart({ record: item, type: "1" })}
              >
                启动
              </Button>
            </Toggle>

            <Button
              type="link"
              className="margin_right_10"
              onClick={this.toggle({
                key: "isShowMoneyRecordModal",
                value: true,
                item,
              })}
            >
              资金记录
            </Button>

            <Button
              type="link"
              className="margin_right_10"
              onClick={this.toggle({
                key: "isShowErrorModal",
                item: item,
                value: true,
              })}
            >
              未处理的异常
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
      isEdit: false,
      isShowMoneyRecordModal: false,
      isShowErrorModal: false,
    };
  }

  private goTo = (path: string, item: any) => {
    return () => {
      const { history } = this.props;
      User.setListItem(item);
      history.push({
        pathname: path,
        search: `id=${item.id}`,
      });
    };
  };

  private renderBtn = () => {
    return (
      <Button
        type="primary"
        className="margin_left_20"
        onClick={this.toggle({
          key: "isShow",
          value: true,
          operateType: "add",
          item: {},
        })}
      >
        新增
      </Button>
    );
  };

  private stopOrStart = (options: {
    record?: any;
    type: "1" | "2" | "3" | "4";
  }) => {
    return () => {
      const { record = {}, type } = options;
      const { actions } = this.props;
      const map = {
        1: {
          content: "确定启动该用户么?",
          url: linkPort.bots_start_bot,
        },
        2: {
          content: "确定停止该用户么?",
          url: linkPort.bots_stop_bot,
        },
        3: {
          content: "确定启动所有用户么?",
          url: linkPort.bots_start_all_bot,
        },
        4: {
          content: "确定停止所有用户么?",
          url: linkPort.bots_stop_all_bot,
        },
      };

      Modal.confirm({
        title: "确认提示",
        content: map[type].content,
        onOk: () => {
          actions
            .post(
              map[type].url,
              helpers.filterEmptyValue({ user_id: record.id })
            )
            .then((res) => {
              message.success(res.message || "成功");
              actions.changeScreenQuery({
                pageNo: 1,
              });
              actions.getScreenData();
            });
        },
      });
    };
  };

  // 新增机器人
  private renderModal = () => {
    const { actions } = this.props;
    const { isShow } = this.state;
    if (!isShow) {
      return null;
    }

    return (
      <UserModal
        actions={actions}
        visible={isShow}
        onCancel={this.toggle({ key: "isShow", value: false })}
        operateType={this.operateType}
        detail={this.changeItem}
        onSuccess={() => {
          const { actions } = this.props;
          actions.changeScreenQuery({
            pageNo: 1,
          });
          actions.getScreenData();
          this.toggle({ key: "isShow", value: false })();
        }}
      />
    );
  };

  private toggle = (options: {
    key: ModalType;
    value;
    item?: any;
    operateType?: OperateType;
  }) => {
    return () => {
      const { key, value, item = {}, operateType } = options;
      if (item) {
        this.changeItem = item;
      }

      if (operateType) {
        this.operateType = operateType;
      }
      this.setState({
        [key]: value,
      });
    };
  };

  private renderAllBtnContent = () => {
    return (
      <div className="margin_bottom_20">
        <Button
          className="margin_right_20"
          type="primary"
          onClick={this.stopOrStart({ type: "3" })}
        >
          启用所有用户
        </Button>

        <Button type="ghost" danger onClick={this.stopOrStart({ type: "4" })}>
          停用所有用户
        </Button>
      </div>
    );
  };

  // private renderEveryAmount = (amount: number) => {
  //   const { isEdit } = this.state;
  //   let btnMap: any = {
  //     text: "保存",
  //     type: "text",
  //     style: {
  //       color: "blue",
  //       marginLeft: 5,
  //     },
  //   };

  //   if (!isEdit) {
  //     btnMap = null;
  //   }
  //   return (
  //     <div>
  //       <AppForm
  //         layout="horizontal"
  //         formItems={[
  //           {
  //             name: "amount",
  //             label: "体验用户每单金额",
  //             editable: isEdit,
  //             afterDOM: <span className="margin_left_5">USDT</span>,
  //             initialValue: amount,
  //             rules: [
  //               {
  //                 required: true,
  //                 message: "请输入",
  //               },
  //             ],
  //             eleAttr: {
  //               placeholder: "请输入",
  //               style: {
  //                 width: 120,
  //               },
  //             },
  //           },
  //         ]}
  //         submitButton={btnMap}
  //         onFinish={this.onFinish}
  //       >
  //         <Toggle isShow={!isEdit}>
  //           <Button
  //             type="text"
  //             style={{ marginLeft: 5, color: "blue" }}
  //             onClick={this.toggle({ key: "isEdit", value: true })}
  //           >
  //             编辑
  //           </Button>
  //         </Toggle>

  //         <Toggle isShow={isEdit}>
  //           <Button
  //             type="text"
  //             style={{ marginLeft: 5, color: "blue" }}
  //             onClick={this.toggle({ key: "isEdit", value: false })}
  //           >
  //             取消
  //           </Button>
  //         </Toggle>
  //       </AppForm>
  //     </div>
  //   );
  // };

  private onFinish = (params: any) => {
    const { actions } = this.props;

    actions.post(linkPort.bots_update, params).then(() => {
      message.success("修改成功");
      this.setState({
        isEdit: false,
      });
    });
  };

  private renderErrorModal = () => {
    const { isShowErrorModal } = this.state;
    const { actions } = this.props;
    const rowData = [
      {
        dataIndex: "message",
        title: "异常",
      },
      {
        dataIndex: "process",
        title: "是否处理",
        render: (value: number) => {
          return value == 1 ? "是" : "否";
        },
      },
    ];

    return (
      <PopupList
        isShow={isShowErrorModal}
        url={api.exception_records}
        query={{ user_id: this.changeItem.id }}
        columns={rowData}
        table={{
          hasRowSelection: true,
          isAllowNoSelect: false,
          rowKey: "id",
          hasPagination: true,
        }}
        getData={(options) => {
          actions
            .post(api.exception_records_update, {
              ids: options.selectedRowKeys,
            })
            .then((res) => {
              message.success(res.message || "成功");
              this.toggle({
                key: "isShowErrorModal",
                value: false,
              })();
            });
        }}
        isSaveAutoCloseModal={false}
        modal={{
          title: "异常详情",
          okText: "异常处理",
        }}
        rowSelectionType="checkbox"
        disabledFn={(item) => {
          return item.process == 1;
        }}
        onCancel={this.toggle({ key: "isShowErrorModal", value: false })}
        actions={actions}
      />
    );
  };

  private renderMoneyRecordModal = () => {
    const { isShowMoneyRecordModal } = this.state;
    const { actions } = this.props;
    const rowData = [
      {
        dataIndex: "t_type_message",
        title: "类型",
      },
      {
        dataIndex: "amount",
        title: "数量",
      },
      {
        dataIndex: "asset",
        title: "币种",
      },

      {
        dataIndex: "tran_id",
        title: "订单ID",
      },

      {
        dataIndex: "transaction_fee",
        title: "费用",
      },

      {
        dataIndex: "status",
        title: "订单状态",
        showList: true,
        type: "select",
        list: transferStatus,
      },

      {
        dataIndex: "timestamp",
        title: "时间",
        render: (value) => {
          if (!value) {
            return null;
          }
          return moment(parseInt(value)).format("YYYY-MM-DD hh:mm:ss");
        },
      },
    ];

    return (
      <PopupList
        isShow={isShowMoneyRecordModal}
        url={api.transfer_records}
        query={{ user_id: this.changeItem.id }}
        columns={rowData}
        getData={(options) => {
          actions
            .post(api.exception_records_update, options.selectedRowKeys)
            .then((res) => {
              message.success(res.message || "成功");
              this.toggle({
                key: "isShowErrorModal",
                value: false,
              })();
            });
        }}
        isSaveAutoCloseModal={false}
        table={{
          hasPagination: true,
        }}
        modal={{
          title: "资金记录",
          footer: null,
          destroyOnClose: true,
        }}
        disabledFn={(item) => {
          return item.process === true;
        }}
        onCancel={this.toggle({ key: "isShowMoneyRecordModal", value: false })}
        actions={actions}
      />
    );
  };

  render() {
    return (
      <div className="robotFollowList">
        {this.renderAllBtnContent()}
        {/* <div className='every-amount'>
          {this.renderEveryAmount(1)}
          {this.renderVipEveryAmount(2)}
        </div> */}
        <PageList
          {...this.props}
          url={linkPort.bots}
          tableComponentProps={{ columns: this.row }}
          groupAfterDom={this.renderBtn()}
          groupSearchProps={{
            isShowResetBtn: true,
            rowData: this.row as any,
          }}
        />
        {this.renderModal()}
        {this.renderErrorModal()}
        {this.renderMoneyRecordModal()}
      </div>
    );
  }
}
