import { AppFormItemOptions } from "@components/AppForm/interface";

import { constants } from "@utils/index";

import { userType } from "@src/hTrade/constants/index";

interface IOptions {
  width?: number;
  disabled?: boolean;
  operateType?: "edit" | "add";
}

export const getFormItems = (options?: IOptions) => {
  const { width = 300, operateType = "add" } = options || {};
  const disabled = operateType === "edit";

  const formData: AppFormItemOptions[] = [
    {
      name: "email",
      label: "邮箱",
      rules: [
        {
          required: true,
          message: "请输入",
          whitespace: true,
        },
      ],
      eleAttr: {
        disabled,
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    {
      name: "name",
      label: "用户名称",
      rules: [
        {
          required: true,
          message: "请输入",
          whitespace: true,
        },
      ],
      eleAttr: {
        // disabled,
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    {
      name: "password",
      label: "密码",
      isShow: !disabled,
      rules: [
        {
          required: true,
          message: "请输入",
          whitespace: true,
        },
      ],
      eleAttr: {
        disabled,
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    {
      name: "binance_user_id",
      label: "币安UID",
      // rules: [
      //   {
      //     required: true,
      //     message: "请输入",
      //     whitespace: true,
      //   },
      // ],
      eleAttr: {
        // disabled,
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    // {
    //   name: 'addTime',
    //   label: '注册时间',
    //   type: 'datePicker',
    //   rules: [
    //     {
    //       required: true,
    //       message: '请选择',
    //     }
    //   ],
    //   eleAttr: {
    //     disabled,
    //     placeholder: '请选择',
    //     style: {
    //       width
    //     }
    //   }
    // },

    {
      name: "invite_code",
      label: " 邀请码",
      eleAttr: {
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },

    {
      name: "user_type",
      label: " 用户类型",
      type: "select",
      list: userType,

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
      name: "expire_time",
      label: "到期时间",
      type: "datePicker",
      rules: [
        {
          required: true,
          message: "请选择",
        },
      ],
      eleAttr: {
        placeholder: "请选择",
        style: {
          width,
        },
      },
    },

    {
      name: "pay_type",
      label: " 付费类型",
      type: "select",
      initialValue: "1",
      isShow: (data) => {
        return data.member_type == 2;
      },
      list: [
        {
          value: "1",
          label: "年付费,",
        },
      ],

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

    // {
    //   name: 'robot_limit',
    //   label: ' 机器人权限',
    //   type: 'select',
    //   isShow: (data) => {
    //     return data.member_type == 2
    //   },
    //   list: [
    //     {
    //       value: '1',
    //       label: '机器人体验权限'
    //     },
    //     {
    //       value: '2',
    //       label: '自动机器人权限'
    //     }
    //   ],

    //   rules: [
    //     {
    //       required: true,
    //       message: '请输入',
    //     }
    //   ],
    //   eleAttr: {
    //     placeholder: '请输入',
    //     style: {
    //       width
    //     }
    //   }
    // },

    // {
    //   name: 'is_robot',
    //   label: ' 是否自动机器人',
    //   type: 'select',
    //   list: constants.isOrNot,
    //   rules: [
    //     {
    //       required: true,
    //       message: '请选择',
    //     }
    //   ],
    //   eleAttr: {
    //     placeholder: '请选择',
    //     style: {
    //       width
    //     }
    //   }
    // },

    // {
    //   name: 'api',
    //   label: 'API Key',
    //   isShow: (data) => {
    //     return data.is_robot == 1
    //   },
    //   rules: [
    //     // (form) => {
    //     //   const robot_limit = form.getFieldValue('robot_limit');
    //     //   console.log(robot_limit, 'robot_limit');

    //     //   return {
    //     //     required: robot_limit == 2,
    //     //     message: '请输入'
    //     //   }
    //     // }
    //     {
    //       required: true,
    //       message: '请输入'
    //     }
    //   ],
    //   eleAttr: {
    //     placeholder: '请输入API Key',
    //     style: {
    //       width
    //     }
    //   }
    // },
    // {
    //   name: 'secret',
    //   label: 'Secret Key',
    //   isShow: (data) => {
    //     return data.is_robot == 1
    //   },
    //   rules: [
    //     // (form) => {
    //     //   const robot_limit = form.getFieldValue('robot_limit');

    //     //   return {
    //     //     required: robot_limit == 2,
    //     //     message: '请输入'
    //     //   }
    //     // }
    //     {
    //       required: true,
    //       message: '请输入'
    //     }
    //   ],
    //   eleAttr: {
    //     placeholder: '请输入API Key',
    //     style: {
    //       width
    //     }
    //   }
    // },

    // {
    //   name: 'evert_money',
    //   label: ' 每单金额',
    //   type: 'number',
    //   isShow: (data) => {
    //     return data.is_robot == 1
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '请选择',
    //     }
    //   ],
    //   eleAttr: {
    //     placeholder: '请选择',
    //     style: {
    //       width
    //     }
    //   }
    // },

    {
      name: "remark",
      label: "备注用户名",
      type: "textArea",
      eleAttr: {
        placeholder: "请输入",
        style: {
          width,
        },
      },
    },
  ];

  return formData;
};
