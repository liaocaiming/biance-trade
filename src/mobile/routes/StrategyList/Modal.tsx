import React from "react";

import { Modal } from "antd-mobile";

import { constants } from "@utils/index";

interface IList {
  value: string;
  label: string;
}

interface IProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  getResult: (item: IList) => void;
}

export default (props: IProps) => {
  const { visible, setVisible } = props;
  const onClose = () => {
    setVisible(false);
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      popup={true}
      transparent={true}
      closable={true}
      maskClosable={true}
      onClose={onClose}
    >
      <div>
        {constants.ORDER_TYPE.map((item) => {
          return <div key={item.value}>{item.label}</div>;
        })}
      </div>
    </Modal>
  );
};
