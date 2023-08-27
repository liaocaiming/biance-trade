import React, { useEffect, useCallback } from "react";
import IProps from "@typings/react.d";
import { Toast } from "antd-mobile";
import "./index.less";
import { fetch } from "@utils/index";
import api from "@src/m-htrade/config/api";
// import md5 from "md5";
import { pageUrlsMap } from "@src/m-htrade/config/routes";
import { FormItemOptions } from "@src/m-htrade/components/Form/interface";
import { AppForm, EmailCode } from "@src/m-htrade/components";
import omit from 'loadsh/omit';

// import { FormInstance } from '@src/m-htrade/components/Form/interface.d';

import { constants } from '@utils/index'

const obj: any = {
  autocomplete: "off",
}


let form: any = {};

export default (props: IProps) => {
  const getCode = () => {
    const email = form?.getFieldValue('email');
    if (!email) {
      Toast.fail('请先输入邮箱');
      return
    }
    if (!constants.pattern.email.test(email)) {
      Toast.fail('请输入正确的邮箱')
      return;
    }
    fetch
      .post(
        api.getCode,
        { email, c_type: 1 },
        { showLoading: false },
      )
      .then(res => {
        Toast.success(res.message || '已发送验证码至邮箱');
      });
  };

  const repsdOnBlur = useCallback((e: any) => {
    const psw = form.getFieldValue('password');
    if (psw !== e.target.value) {
      Toast.fail('两次密码输入不一致！');
    }
  }, [form])

  const formData: FormItemOptions[] = [
    {
      label: "邮箱",
      name: "email",
      rules: [
        {
          required: true,
          message: "请输入邮箱",
        },
        {
          pattern: constants.pattern.email,
          message: '请输入正确的邮箱'
        }
      ],
      eleAttr: {
        placeholder: '请输入邮箱',
        ...obj
      }
    },

    {
      label: "验证码",
      name: "check_token",
      type: "input",
      rules: [
        {
          required: true,
          message: "请输入验证码",
        },
      ],
      eleAttr: {
        type: "number",
        placeholder: '请输入验证码',
        children: (
          <div className="code">
            <EmailCode
              onSuccess={getCode}
              validator={() => {
                const email = form?.getFieldValue('email')
                console.log(email, 'email');

                if (!email) {
                  Toast.fail('请先输入邮箱');
                  return false;
                }

                if (!constants.pattern.email.test(email)) {
                  Toast.fail('邮箱格式不正确');
                  return false;
                }
                return true;
              }}
            />
          </div>
        ),
        ...obj
      },
    },

    {
      label: "密码",
      name: "password",
      type: "input",
      rules: [
        {
          required: true,
          message: "请输入密码",
        },
      ],
      eleAttr: {
        type: 'password',
        placeholder: '请输入验证码',
        ...obj
      },
    },

    {
      label: "密码确认",
      name: "repwd",
      type: "input",
      rules: [
        {
          required: true,
          message: "请输入密码确认",
        },
      ],
      eleAttr: {
        type: 'password',
        onBlur: repsdOnBlur,
        placeholder: '请输入再次输入密码',
        ...obj
      },
    },


    {
      label: "邀请码",
      name: "code",
      type: "input",
      eleAttr: {
        placeholder: '请输入邀请码',
        ...obj
      },
    },
  ];


  const onRegister = useCallback((values: any) => {
    if (values.password !== values.repwd) {
      Toast.fail('两次密码输入不一致！');
      return
    }

    const params = omit(values, ['rpwd']);

    fetch.post(api.users, { ...params, from: 'web'}).then((res) => {
      Toast.success(res.message || '注册成功', 1, () => {
        props.history.push(pageUrlsMap.login);
      })
    })
  }, [form])

  const goLogin = useCallback(() => {
    props.history.push(pageUrlsMap.login)
  }, [props.history])


  return (
    <div className="mb-register">
      <div className="tab-container">
        <span
          className='register'
        >
          注册
        </span>
      </div>

      <div className="form-container">

        <AppForm
          formItems={formData}
          getRef={(forms) => {
            form = forms;
          }}
          onFinish={onRegister}
          submitOptions={{
            text: "注册",
          }}
        />
        <div className="go-login" onClick={goLogin}>
          <span className='text'>已有账号，去登录</span>
        </div>
      </div>
    </div>
  );
};
