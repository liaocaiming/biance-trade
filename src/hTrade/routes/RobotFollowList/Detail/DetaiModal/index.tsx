import React, { useEffect, useState } from "react";

import Title from "./Title";

import DetailList from "./DetailList";

import { api } from "@src/hTrade/config/index";

import { IAppActions } from "@shared/containers";

import { ModalProps } from "antd/lib/modal/Modal";

import { Modal } from "antd";

import { filterAttr } from "@utils/index";

interface IProps extends ModalProps {
  actions: IAppActions;
  query: object;
  isShow: boolean;
}

export default (props: IProps) => {
  const [detail, setDetail] = useState({});
  const { query, actions, isShow } = props;

  const getData = (query: any) => {
    actions.get(api.follow_records_Show, query).then((res) => {
      if (res.data) {
        setDetail(res.data);
      }
    });
  };

  useEffect(() => {
    getData(query);
  }, [query]);

  const { follow_record_messages = [] } = detail as any;
  const modalProps = filterAttr(props, ["actions", "query", "isShow"]);
  return (
    <Modal visible={isShow} title="订单详情" footer={null} {...modalProps}>
      <div className="page-orderDetail">
        <Title detail={detail} />
        <DetailList list={follow_record_messages} />
      </div>
    </Modal>
  );
};
