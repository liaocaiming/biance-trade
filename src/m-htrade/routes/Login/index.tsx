import React, { useEffect, useCallback, useMemo, useState } from "react";
import IProps from "@typings/react.d";
import { Toast } from "antd-mobile";
import "./index.less";
import { fetch } from "@utils/index";
import api from "@src/m-htrade/config/api";
// import md5 from "md5";
import { pageUrlsMap } from "@src/m-htrade/config/routes";
import { FormItemOptions } from "@src/m-htrade/components/Form/interface";
import { AppForm } from "@src/m-htrade/components";
import close from './images/close_eye.png'
import open from './images/open_eye.png'
import { constants } from '@utils/index'
import { User } from "@utils/index";

const obj: any = {
  autocomplete: "off",
}

const eyeMap = {
  open,
  close
}

let form: any = {};

type EyeStatus = 'open' | 'close';

export default (props: IProps) => {
  const [eyeStatus, setEyeStatus] = useState<EyeStatus>('open')


  const eyeOnchange = useCallback(() => {
    const status = eyeStatus === 'close' ? 'open' : 'close';
    setEyeStatus(status)
  }, [eyeStatus])

  const formData: FormItemOptions[] = useMemo(() => {
    return [
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
          type: eyeStatus ==='open' ? 'password' : 'text',
          placeholder: '请输入验证码',
          children: (
            <img src={eyeMap[eyeStatus]} className='eye' onClick={eyeOnchange} />
          ),
          ...obj
        },
      },
    ];
  }, [eyeStatus, eyeOnchange])


  const onLogin = useCallback((values: any) => {
    // const params = { ...values, password: md5(values.password) }
    fetch.post(api.authentication, { ...values }).then((res) => {
      User.saveUserInfo(res.data);
      Toast.success(res.message || '注册成功', 1, () => {
        props.history.push(pageUrlsMap.home);
      })
    })
  }, [form])

  const goPassword = useCallback(() => {
    props.history.push(pageUrlsMap.resetPassword)
}, [pageUrlsMap])


  const goRegister = useCallback(() => {
      props.history.push(pageUrlsMap.register)
  }, [props.history])

  useEffect(() => {
    document.title = "登录";
  }, []);

  return (
    <div className="mb-login">
      <div className="tab-container">
        <span
          className='register'
        >
          登录
        </span>
      </div>

      <div className="form-container">

        <AppForm
          formItems={formData}
          getRef={(forms) => {
            form = forms;
          }}
          onFinish={onLogin}
          submitOptions={{
            text: "登录",
          }}
        />
        <div className="go-login">
          <span className='text register-btn' onClick={goRegister}>立即注册</span>
          <span className='text' onClick={goPassword}>忘记密码</span>
        </div>
      </div>
    </div>
  );
};
