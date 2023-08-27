import React, { memo, useState } from "react";

import { Modal } from "antd";

import { ModalProps } from "antd/lib/modal";

import { AppForm } from "@components/index";

import { AppFormItemOptions } from "@components/AppForm/interface";

import { IActions } from "@containers/index.d";

import api from "@src/hTrade/config/api";

import { FormInstance } from "antd/lib/form";

import { constants } from "@utils/index";
import { userType } from "@src/hTrade/constants";

interface IOptions {
  width?: number;
  disabled?: boolean;
  operateType?: "edit" | "add";
}

interface IProps extends ModalProps {
  detail?: any;
  actions: IActions;
  operateType?: "edit" | "add";
  onSuccess: () => void;
}

export default memo((props: IProps) => {
  const { detail = {}, visible, actions, onCancel, onSuccess, operateType } = props;
  const [form, setForm] = useState<FormInstance>();

  const [userInfo, setUserInfo] = useState<any>({});

  const getFormItems = (options?: IOptions) => {
    const { width = 300, operateType } = options || {};
    const disabled = operateType === "edit";

    const formData: AppFormItemOptions[] = [
      {
        name: "email",
        label: "邮箱",
        editable: !disabled,
        rules: [
          {
            required: true,
            message: "请输入",
            whitespace: true,
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          onBlur: () => {
            form?.validateFields(["email"]).then((values: any) => {
              actions.get(api.userList, values).then((json) => {
                const [item = {}] = json.data || [];
                setUserInfo(item);
              });
            });
          },
          disabled,
          style: {
            width,
          },
        },
      },

      {
        name: "biance_user_id",
        label: "币安uid",
        editable: false,
        render: () => {
          return <span>{userInfo.binance_user_id || detail.binance_user_id}</span>
        }
      },

      {
        name: "user_type",
        label: "用户类型",
        editable: false,
        type: 'select',
        initialValue: userInfo.user_type || detail.user_type,
        list: userType
      },


      {
        name: "binance_key",
        label: "API Key",
        // isShow: !disabled,
        rules: [
          {
            required: !disabled,
            message: "请输入",
            whitespace: true,
          },
        ],
        eleAttr: {
          placeholder: "请输入API Key",
          style: {
            width,
          },
        },
      },
      {
        name: "binance_secret",
        label: "Secret Key",
        // isShow: !disabled,
        rules: [
          {
            required: !disabled,
            message: "请输入",
            whitespace: true,
          },
        ],
        eleAttr: {
          placeholder: "请输入Secret Key",
          style: {
            width,
          },
        },
      },

      {
        name: "amount",
        label: "每单金额",
        rules: [
          {
            required: true,
            message: "请输入",
            whitespace: true,
          },
          {
            pattern: constants.pattern.positiveNum,
            message: "请输入正整数",
          },
        ],
        eleAttr: {
          placeholder: "请输入",
          style: {
            width,
          },
        },
      },

      // {
      //   name: "remark",
      //   label: "备注",
      //   type: "textArea",
      //   eleAttr: {
      //     placeholder: "请输入",
      //     style: {
      //       width,
      //     },
      //   },
      // },
    ];

    return formData;
  };

  const formData: AppFormItemOptions[] = getFormItems({
    operateType,
  });

  const onFinish = (params: any) => {
    const { operateType } = props;
    const map = {
      add: api.bots,
      edit: api.bots_update,
    };

    actions
      .post(map[operateType || "add"], {
        user_id: detail.id || userInfo.id,
        ...params,
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
        updateStore={{ ...detail, ...userInfo, }}
        onReady={(form) => {
          setForm(form);
        }}
      />
    </Modal>
  );
});
