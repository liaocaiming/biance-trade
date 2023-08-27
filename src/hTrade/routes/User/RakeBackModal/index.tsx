import React, { memo, useState } from "react";
import { message, Modal } from "antd";
import moment from "moment";
import { ModalProps } from "antd/lib/modal";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { IActions } from "@containers/index.d";

import api from "@src/hTrade/config/api";

import { FormInstance } from "antd/lib/form";

import { constants } from "@utils/index";

interface IProps extends ModalProps {
  detail?: any;
  actions: IActions;
  onSuccess: () => void;
  onCancel: () => void;
}

export default memo((props: IProps) => {
  const { detail, actions, onCancel, onSuccess } = props;
  const [form, setForm] = useState<FormInstance>();

  const onSave = (params: any) => {
    actions
      .post(api.invite_records_update, { id: detail.id, ...params })
      .then(() => {
        message.success("添加成功", 1, () => {
          onSuccess();
        });
      });
  };

  const onOK = () => {
    form?.submit();
  };

  const values = { ...detail };

  if (values.expire_time) {
    values.expire_time = moment(values.expire_time);
  }

  const renderForm = () => {
    const width = 200;
    const formItems: AppFormItemOptions[] = [
      {
        name: "commission",
        label: "佣金",
        rules: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: constants.pattern.positiveNumFloat,
            message: "请输入正数",
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          style: {
            width,
          },
        },
      },

      {
        name: "asset",
        label: "佣金币种",
        rules: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: constants.pattern.alphabetOrNumber,
            message: "请输入正确的币种",
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          style: {
            width,
          },
        },
      },

      {
        name: "commission_date",
        label: "返佣时间",
        type: "datePicker",
        rules: [
          {
            required: true,
            message: "请选择",
          },
        ],
        eleAttr: {
          placeholder: "请选择",
          showTime: true,
          style: {
            width,
          },
        },
      },
    ];
    return (
      <AppForm
        formItems={formItems}
        submitButton={{
          type: "primary",
          text: "保存",
          style: { marginLeft: 50 },
        }}
        onFinish={onSave}
        labelCol={{ span: 6 }}
        onReady={(form) => {
          setForm(form);
        }}
      />
    );
  };

  return (
    <Modal
      visible
      onCancel={onCancel}
      width={600}
      title="添加返佣"
      onOk={onOK}
      destroyOnClose
      footer={null}
    >
      {renderForm()}
    </Modal>
  );
});
