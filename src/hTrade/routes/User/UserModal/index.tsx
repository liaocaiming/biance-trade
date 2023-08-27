import React, { memo, useState } from "react";
import { Modal } from "antd";
import moment from "moment";
import { ModalProps } from "antd/lib/modal";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { IActions } from "@containers/index.d";

import api from "@src/hTrade/config/api";

import { FormInstance } from "antd/lib/form";

import { getFormItems } from "../utils";
import { helpers } from "@utils/index";

interface IProps extends ModalProps {
  detail?: any;
  operateType?: "edit" | "add";
  actions: IActions;
  onSuccess: () => void;
}

const map = {
  edit: api.editUser,
  add: api.addUser,
};

export default memo((props: IProps) => {
  const { detail, visible, actions, onCancel, operateType, onSuccess } = props;
  const [form, setForm] = useState<FormInstance>();

  const formData: AppFormItemOptions[] = getFormItems({ operateType });

  const onFinish = (params: any) => {
    const url = map[operateType || "add"];
    actions
      .post(
        url,
        helpers.filterEmptyValue({
          ...params,
          expire_time: params.expire_time.format("YYYY-MM-DD"),
          id: detail.id,
        })
      )
      .then((res) => {
        onSuccess();
      });
  };

  const onOK = () => {
    form?.submit();
  };

  const values = { ...detail };

  if (values.expire_time) {
    values.expire_time = moment(values.expire_time);
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={600}
      title="新增用户"
      onOk={onOK}
      destroyOnClose
    >
      <AppForm
        formItems={formData}
        labelCol={{ span: 6 }}
        submitButton={null}
        onFinish={onFinish}
        updateStore={values}
        onReady={(form) => {
          setForm(form);
        }}
      />
    </Modal>
  );
});
