import React from "react";
import { PageList } from "@components/index";
import linkPort from "@src/hTrade/config/api"; // 注意: 不是boss项目的请修改路径
import { connect } from "@containers/appScreen";
import IProps from "@typings/react.d";
import { Button, message } from "antd";
import UserModal from "./UserModal";
import { userType } from "@src/hTrade/constants/index";
import UserReturnRecord from "./UserReturnRecord";

interface IState {
  isShow?: boolean;
  isShowReturn?: boolean;
  [key: string]: any;
}

type OperateType = "edit" | "add";

type ModalKey = "isShow" | "isShowReturn";

@connect()
export default class App extends React.PureComponent<IProps, IState> {
  private changeItem = {};

  private operateType: OperateType = "add";

  private row: any = [
    {
      title: "邮箱名称",
      dataIndex: "email",
      isSearch: true,
    },
    {
      title: "用户名称",
      dataIndex: "name",
      isSearch: true,
    },

    {
      title: "用户类型",
      dataIndex: "user_type",
      type: "select",
      list: userType,
      isSearch: true,
      showList: true,
    },

    {
      title: "币安UID",
      dataIndex: "binance_user_id",
      isSearch: true,
    },

    // {
    //   title: '注册时间',
    //   dataIndex: 'addTime',
    //   isSearch: true,
    //   type: 'datePicker',
    // },
    {
      title: "邀请码",
      dataIndex: "invite_code",
      isSearch: true,
    },

    {
      title: "返佣人数",
      dataIndex: "invite_count",
    },

    {
      title: "到期时间",
      dataIndex: "expire_time",
      type: "datePicker",
    },

    // {
    //   title: '是否自动机器人',
    //   dataIndex: 'is_open_robot',
    //   isSearch: true,
    //   type: 'select',
    //   list: constants.isOrNot
    // },

    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      dataIndex: "remark",
      render: (val: string, item: any) => {
        return (
          <div>
            {/* <Button type='link' className='margin_right_10'>查看</Button> */}
            <Button
              className="margin_right_5"
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
            {/* <Button className="margin_right_5" type="link">
              用户操作记录
            </Button> */}
            <Button
              type="link"
              onClick={this.toggle({ key: "isShowReturn", value: true, item })}
            >
              用户返佣详情
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
      isShowReturn: false,
    };
  }
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
          message.success("成功");
          const { actions } = this.props;
          this.setState({
            isShow: false,
          });

          actions.changeScreenQuery({
            pageNo: 1,
          });
          actions.getScreenData({
            method: "get",
          });
        }}
      />
    );
  };

  private renderUserReturnRecord = () => {
    const { actions } = this.props;
    const { isShowReturn } = this.state;
    if (!isShowReturn) {
      return null;
    }

    return (
      <UserReturnRecord
        actions={actions}
        visible={isShowReturn}
        onCancel={this.toggle({ key: "isShowReturn", value: false })}
        detail={this.changeItem}
      />
    );
  };

  private toggle = (options: {
    key: ModalKey;
    value;
    item?: any;
    operateType?: OperateType;
  }) => {
    return () => {
      const { key, value, item, operateType } = options;
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

  public render() {
    return (
      <div>
        <PageList
          {...this.props}
          url={linkPort.userList}
          tableComponentProps={{ columns: this.row }}
          groupAfterDom={this.renderBtn()}
          groupSearchProps={{
            isShowResetBtn: true,
            rowData: this.row as any,
          }}
        />
        {this.renderModal()}
        {this.renderUserReturnRecord()}
      </div>
    );
  }
}
