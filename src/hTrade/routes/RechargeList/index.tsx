import React from "react";
import { PageList, Toggle } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { Button, message, Modal } from "antd";
import AuditModal from "./AuditModal";
import "./index.less";
import { helpers } from "@utils/index";
import { isOrNot } from '@utils/lib/constants'

interface IState {
  isShow?: boolean;
  [key: string]: any;
}

type OperateType = "edit" | "add";

type ModalType =
  | "isShow"
  | "isShowMoneyRecordModal"
  | "isShowErrorModal"
  | "isEdit";


@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem: any = {};

  private operateType: OperateType = "add";

  private row: any = [
    {
      title: "用户id",
      dataIndex: "user_id",
      isSearch: true,
    },

    {
      title: "用户邮箱",
      dataIndex: "email",
      // isSearch: true,
    },

    {
      title: "充值金额",
      dataIndex: "amount",
    },

    {
      title: "充值币种",
      dataIndex: "asset",
    },


    {
      title: "用户充值地址",
      dataIndex: "from_address",
    },

    {
      title: "收款地址",
      dataIndex: "address",
    },

    {
      title: "交易哈希（txid）",
      dataIndex: "txid",
    },

    {
      title: "充值时间",
      dataIndex: "deposit_time",
    },

    {
      title: "是否审核",
      dataIndex: "check",
      type: 'select',
      list: isOrNot,
      isSearch: true
    },



    {
      title: "操作",
      dataIndex: "remark",
      render: (val: string, item: any) => {
        const { check } = item;
        return (
          <div>
            <Toggle isShow={check === 2}>
              <Button
                type="link"
                className="margin_right_10"
                // onClick={this.toggle({ key: 'isShow', item, value: true })}
                onClick={this.deleteOrAudit({ record: item, type: 'audit' })}

              >
                审核
              </Button>
            </Toggle>
            <Button
              type="link"
              className="margin_right_10"
              onClick={this.deleteOrAudit({ record: item, type: 'delete' })}
            >
              删除
              </Button>
          </div>
        )
      },
    },
  ];

  constructor(props: IProps) {
    super(props);
    this.state = {
      isShow: false,
    };
  }


  private deleteOrAudit = (options: {
    record?: any;
    type: 'delete' | 'audit'
  }) => {
    return () => {
      const { record = {}, type = 'audit' } = options;
      const { actions } = this.props;
      const { id, txid } = record;

      const map = {
        delete: {
          content: `确定删除该充值记录(txid: ${txid})么`,
          url: linkPort.deposit_records_destroy,
        },
        audit: {
          content: `确定审核通过记录(txid: ${txid})么`,
          url: linkPort.deposit_records_update,
        }
      }

      const obj = map[type];

      Modal.confirm({
        title: "确认提示",
        content: obj.content,
        onOk: () => {
          actions
            .post(
              obj.url,
              helpers.filterEmptyValue({ id })
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
      <AuditModal
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

  render() {
    return (
      <div className="robotFollowList">

        <PageList
          {...this.props}
          url={linkPort.deposit_records}
          tableComponentProps={{ columns: this.row }}
          groupSearchProps={{
            isShowResetBtn: true,
            rowData: this.row as any,
          }}
        />
        {this.renderModal()}
      </div>
    );
  }
}
