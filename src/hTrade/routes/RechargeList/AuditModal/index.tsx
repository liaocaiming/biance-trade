import React, { memo, useState } from "react";

import { Modal } from "antd";

import { ModalProps } from "antd/lib/modal";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { IActions } from "@containers/index.d";

import api from "@src/hTrade/config/api";

import { FormInstance } from "antd/lib/form";

interface IOptions {
  width?: number;
  disabled?: boolean;
}

interface IProps extends ModalProps {
  detail?: any;
  actions: IActions;
  operateType?: "edit" | "add";
  onSuccess: () => void;
}

export default memo((props: IProps) => {
  const { detail = {}, visible, actions, onCancel, onSuccess } = props;
  const [form, setForm] = useState<FormInstance>();

  const getFormItems = (options?: IOptions) => {
    const { width = 300 } = options || {};

    const formData: AppFormItemOptions[] = [
      {
        name: "id",
        label: "充值记录ID",
        editable: false
      },

      {
        name: "email",
        label: "邮箱",
        editable: false
      },
      {
        label: '用户充值地址',
        name: 'from_address',
        rules: [
          {
            required: true,
            message: '请输入'
          }
        ],
        eleAttr: {
          placeholder: '请输入',
          style: {
            width
          }
        }
      },

      {
        label: '充值时间',
        name: 'deposit_time',
        type: 'datePicker',
        rules: [
          {
            required: true,
            message: '请选择'
          }
        ],
        eleAttr: {
          showTime: true,
          style: {
            width
          }
        }
      }


    ];

    return formData;
  };

  const formData: AppFormItemOptions[] = getFormItems();

  const onFinish = (params: any) => {

    const { deposit_time } = params;

    actions
      .post(api.deposit_records_update, {
        user_id: detail.id,
        ...params,
        deposit_time: deposit_time && deposit_time.format('YYYY-MM-DD hh:mm:ss')
      })
      .then(() => {
        onSuccess();
      });
  };

  const onOK = () => {
    form?.submit();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={600}
      title="新增用户"
      onOk={onOK}
    >
      <AppForm
        formItems={formData}
        labelCol={{ span: 6 }}
        submitButton={null}
        onFinish={onFinish}
        updateStore={detail}
        onReady={(form) => {
          setForm(form);
        }}
      />
    </Modal>
  );
});
