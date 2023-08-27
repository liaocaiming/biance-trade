import React, { memo, useState } from "react";

import { message, Modal } from "antd";

import { ModalProps } from "antd/lib/modal";

import { AppForm } from "@components/index";

import { FormInstance } from "antd/lib/form";

import { AppFormItemOptions } from "@components/AppForm/interface.d";

import { IActions } from "@shared/containers";
import { api } from "@src/hTrade/config";

const width = 200;

const dist = [1, 2, 3, 4];

const distFormItems = (dist: number[]): AppFormItemOptions[] => {
  return dist.map((item, index) => {
    return {
      name: ["dist", index],
      label: `第${item}目标`,
      rules: [
        {
          required: true,
          message: "请输入",
        },
      ],
      eleAttr: {
        placeholder: "请输入",
        style: {
          width,
        },
      },
    };
  });
};

interface IProps extends ModalProps {
  actions: IActions;
  detail: any;
}

export default memo((props: IProps) => {
  const [form, setForm] = useState<FormInstance>();
  const { actions, onCancel, detail } = props;
  const formItems: AppFormItemOptions[] = [
    {
      name: "name",
      label: "策略名称",
      initialValue: detail && detail.name,
      editable: false,
    },
    {
      name: "symbol",
      label: "币的名称",
      rules: [
        {
          required: true,
          message: "请输入",
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
      name: ["entry", 0],
      label: "最低价格",
      rules: [
        {
          required: true,
          message: "请输入",
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
      name: ["entry", 1],
      label: "最高价格",
      rules: [
        {
          required: true,
          message: "请输入",
        },
      ],
      eleAttr: {
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    ...distFormItems(dist),

    {
      name: "loss",
      label: "止损点位",
      rules: [
        {
          required: true,
          message: "请输入",
        },
      ],
      eleAttr: {
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },
  ];

  const onFinish = (params: any) => {
    actions
      .post(api.push_records, {
        ...params,
        dist: params.dist.join(","),
        entry: params.entry.join(","),
        signal_id: detail.id,
      })
      .then(() => {
        message.success("新增成功", 1, () => {
          const e: any = {};
          onCancel && onCancel(e);
        });
      });
  };

  const onOk = () => {
    form?.submit();
  };

  return (
    <Modal visible title="新增推送策略" {...props} onOk={onOk}>
      <AppForm
        labelCol={{ span: 4 }}
        formItems={formItems}
        onFinish={onFinish}
        submitButton={null}
        onReady={(form) => {
          setForm(form);
        }}
      />
    </Modal>
  );
});
