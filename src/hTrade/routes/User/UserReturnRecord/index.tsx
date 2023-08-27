import React, { memo, useState, useEffect } from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";

import { IActions } from "@containers/index.d";

import api from "@src/hTrade/config/api";

import { TableComponent } from "@components/index";

import RakeBackModal from "../RakeBackModal";

interface IProps extends ModalProps {
  detail: any; //
  actions: IActions;
}

export default memo((props: IProps) => {
  const { visible, actions, onCancel, detail } = props;

  const [list, setList] = useState({});
  const [show, setShow] = useState(false);
  const [obj, setObj] = useState({});

  const rowData = [
    {
      title: "邀请人邮箱",
      dataIndex: "email",
    },
    {
      title: "邀请人id",
      dataIndex: "user_id",
    },
    {
      title: "被邀请者的邮箱",
      dataIndex: "to_email",
    },
    {
      title: "被邀请者的id",
      dataIndex: "binance_user_id",
    },

    {
      title: "佣金",
      dataIndex: "commission",
    },
    {
      title: "佣金币种",
      dataIndex: "asset",
    },
    {
      title: "佣金发放时间",
      dataIndex: "commission_date",
    },

    {
      title: "操作",
      dataIndex: "operate",
      render: (value: string, record: any) => {
        if (parseFloat(record.commission) > 0) {
          return null;
        }

        return (
          <a
            onClick={() => {
              setShow(true);
              setObj(record);
            }}
          >
            添加返佣
          </a>
        );
      },
    },
  ];

  const getList = (params = {}) => {
    console.log(api.invite_records, "invite_records");
    actions
      .get(api.invite_records, { page: 1, user_id: detail.id, ...params })
      .then((res) => {
        setList(res);
      });
  };

  useEffect(() => {
    getList();
  }, [detail]);

  const { count, data = [] } = list as any;

  const renderModal = () => {
    if (!show) {
      return null;
    }
    return (
      <RakeBackModal
        detail={obj}
        onCancel={() => {
          setShow(false);
        }}
        actions={actions}
        onSuccess={() => {
          getList({ page: 1 });
          setShow(false);
        }}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={800}
      title="用户返佣详情"
      onOk={onCancel}
      destroyOnClose
      footer={null}
    >
      <TableComponent
        columns={rowData}
        dataSource={data}
        pagination={{
          total: count,
          // current: ,
          // pageSize: page.pageSize,
          pageSizeOptions: ["10", "20", "50", "100"],
          showQuickJumper: true,
          onChange: (pageNo: number, pageSize?: number) => {
            getList({ page: pageNo });
          },
          onShowSizeChange: (current: number, pageSize: number) => {
            getList({ page: 1, pageSize });
          },
        }}
      />
      {renderModal()}
    </Modal>
  );
});
