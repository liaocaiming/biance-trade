import React, { useEffect, useState, useReducer } from 'react';
import IProps from '@typings/react.d';
import './index.less';
import reducer, { init, initValue } from './reducer';
import { fetch, helpers } from '@utils/index';
import api from '@src/h-mobile/config/api';
import { ExclamationCircleOutlined, AndroidOutlined } from '@ant-design/icons';

import { Button } from 'antd';

import omit from 'loadsh/omit';

import { constants, query } from '@utils/index';

import register from './images/icon-register.png';

import iconDown from './images/icon-register.png';

import iconWechat from './images/icon-wechat.png';

import iconLogo from './images/icon-logo.png';

import logo_biduofeng from './images/icon-biduofeng-logo.png';

import bar from './images/bar.png';

import rate from './images/rate.png';

import h24 from './images/h-24.png';

import Input, { InputProps } from './Input';

import { IRule } from '@utils/lib/validator';

import { Toggle } from '@shared/components';

import validator from './validator';

import { Toast } from 'antd-mobile';

import EmailCode from './EmailCode';

import AgreeModal from './AgreeModal';

import config, { ICompany } from './config';

const obj: any = {
  autocomplete: 'new-password',
};

interface AppFormItemOptions extends InputProps {
  rules?: IRule[];
  name: string;
  trigger?: 'blur' | 'change';
}

export default (props: IProps) => {
  const { companyConfig } = props;
  const { name = 'hTrade' } = companyConfig || {};
  const companyInfo: ICompany = config[name];
  const [state, dispatch] = useReducer(reducer, initValue, init);
  const [error, setError] = useState({});
  const [show, setShow] = useState(false);

  const params = query.getUrlQuery();

  useEffect(() => {
    document.title = '首页';
    if (params.code) {
      dispatch({
        payload: {
          code: params.code,
        },
      });
    }
  }, [params.code]);

  const renderTitle = () => {
    return (
      <div className="header">
        <div className="logo">
          <img src={companyInfo.logo} className="img" />
        </div>

        <div className="title">
          <div className="line" />
          <div className="text">
            <p>{companyInfo.title} </p>
            <p>智能交易策略系统 </p>
            <div className="tip">无需盯盘，高准确率，让盈利更简单 </div>
          </div>
        </div>

        <div className="step">
          <h6 className="step-title">三步领好礼</h6>

          <div className="step-num">
            <div className="step-num-item">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>

            <div className="step-num-line" />
          </div>

          <div className="step-detail">
            <div className="step-detail-item step-detail-first">
              <img src={register} className="img" />
              <p className="text">注册账号</p>
            </div>

            <div className="step-detail-item step-detail-second">
              <img src={iconDown} className="img" />
              <p>下载APP</p>
            </div>

            <div className="step-detail-item step-detail-third">
              <img src={iconWechat} className="img" />
              <p className="text">加客服微信</p>
              <p className="text"> 免费试用</p>
              <p className="text wechat">微信（{companyInfo.weixin}）</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onInputChange = (item: AppFormItemOptions) => {
    return e => {
      if (error) {
        setError({});
      }
      dispatch({
        payload: {
          [item.name]: e.target.value,
        },
      });
    };
  };

  const onCheckClick = () => {
    const { check } = state;
    // console.log(check)
    dispatch({
      payload: {
        check: check === 1 ? 2 : 1,
      },
    });

    if (check === 2) {
      setError({
        ...error,
        check: null,
      });
    }
  };

  const onBlur = () => {
    if (state.password !== state.checkword) {
      setError({
        ...error,
        checkword: {
          message: '两次输入不一致',
        },
      });
      return;
    }
    if (error) {
      setError({});
    }
  };

  const downApp = async () => {
    const res = await fetch.get(api.system_settings);
    console.log(res, 'res');
    const { data = [] } = res;
    let host = '';
    let apiUrl = '';
    data.forEach(it => {
      if (it.key === 'lastest_version_url') {
        apiUrl = it.url;
      }
      if (it.key === 'host') {
        host = it.value;
      }
    });
    window.location.href = `${host}${apiUrl}?name=hTrades`;
  };

  const renderForm = () => {
    const formItems: AppFormItemOptions[] = [
      {
        name: 'email',
        placeholder: '邮箱',
        rules: [
          {
            pattern: constants.pattern.email,
            message: '邮箱格式不正确',
          },
          {
            required: true,
            message: '邮箱必填',
          },
        ],
      },

      {
        name: 'check_token',
        placeholder: '邮箱验证码',
        rules: [
          {
            required: true,
            message: '邮箱验证码必填',
          },
        ],
      },
      {
        name: 'password',
        placeholder: '登录密码',
        type: 'password',
        rules: [
          {
            required: true,
            message: '登录密码必填',
          },
        ],
      },
      {
        name: 'checkword',
        placeholder: '确认登录密码',
        type: 'password',
        onBlur: onBlur,
        rules: [
          {
            required: true,
            message: '确认登录密码必填',
          },
        ],
      },

      {
        name: 'code',
        placeholder: '邀请码',
        disabled: params.code,
        // rules: [
        //   {
        //     required: true,
        //     message: '邀请码必填'
        //   }
        // ]
      },
    ];

    const getCode = () => {
      fetch
        .post(
          api.users_get_code,
          { email: state.email, c_type: 1 },
          { showLoading: false },
        )
        .then(res => {
          Toast.success(res.message || '已发送验证码至邮箱');
        });
    };

    const onFinish = () => {
      validator(state, formItems).then(err => {
        if (err) {
          setError(err);
          return;
        }
        if (state.check === 2) {
          setError({
            check: {
              message: '请勾选用户协议',
            },
          });
          return;
        }

        let query = omit(state, ['check', 'checkword']);

        fetch
          .post(api.users, helpers.filterEmptyValue({ ...query, from: 'web' }))
          .then(res => {
            Toast.success(res.message || '注册成功', 1, () => {
              downApp();
            });
          });
      });
    };

    return (
      <div className="form">
        {formItems.map(item => {
          const err = error[item.name];

          return (
            <Input
              containerClassName="input-container"
              {...item}
              value={state[item.name]}
              onChange={onInputChange(item)}
            >
              <div className="input-children">
                <Toggle isShow={err}>
                  <span className="tip">
                    {' '}
                    <ExclamationCircleOutlined className="tip-icon" />
                    {err && err.message}
                  </span>
                </Toggle>
                <Toggle isShow={item.name === 'check_token'}>
                  <EmailCode
                    onSuccess={getCode}
                    validator={() => {
                      if (!state.email) {
                        Toast.fail('请先输入邮箱');
                        return false;
                      }

                      if (!constants.pattern.email.test(state.email)) {
                        Toast.fail('邮箱格式不正确');
                        return false;
                      }
                      return true;
                    }}
                  />
                </Toggle>
              </div>
            </Input>
          );
        })}

        <div className="checkbox-container">
          <div className="see-checkbox" onClick={onCheckClick}>
            <input
              type="checkbox"
              className="checkbox"
              style={{ visibility: 'hidden' }}
            />
            <div className={`show-box ${state.check === 1 ? 'checked' : ''}`} />
            <span className="see-tip">我已阅读并同意</span>
          </div>
          <span
            className="see-text"
            onClick={() => {
              setShow(true);
            }}
          >
            《用户协议》
          </span>
        </div>

        <Toggle isShow={(error as any).check}>
          <div className="tip" style={{ marginTop: 20 }}>
            {' '}
            <ExclamationCircleOutlined className="tip-icon" />
            请勾选用户协议
          </div>
        </Toggle>

        <div className="btn" onClick={onFinish}>
          注册
        </div>

        <div className="qrcode">
          {/* <p className='tip-text'>识别二维码，下载APP文件</p>
          <img src={qrcode} className='img' /> */}
          <Button type="primary" size="large" onClick={downApp}>
            <AndroidOutlined />
            <span>下载</span>
          </Button>
        </div>
      </div>
    );
  };

  const renderDetailContent = () => {
    return (
      <div className="detail-content">
        <div className="h-24">
          <div className="img-container">
            <img src={h24} className="h-24-img" />
          </div>
          <div className="detail-show-container">
            <span className="btn">
              <span className="weight">24小时</span>
              <span>连续推送</span>
            </span>
          </div>
          <p>依靠专业、完善的交易策略,</p>
          <p>
            <span>{companyInfo.title} 交易系统能够</span>
            <span className="white">24小时</span>
            <span>
              不间断地跟踪现货、合约、杠杆代币的市场走势,帮助用户发现足够多的潜在交易机会。
            </span>
          </p>
        </div>

        <div className="h-24">
          <div className="img-container">
            <img src={bar} className="h-24-img" />
          </div>
          <div className="detail-show-container">
            <span className="btn">
              <span className="weight">长中短线</span>
              <span>信号全面覆盖</span>
            </span>
          </div>
          <p>
            <span>{companyInfo.title}提供了</span>
            <span className="white">
              短线（3天内）、中线（15天内）、长线（30天）
            </span>
            <span>等不同周期的信号提醒，让用户都找到适合自己的交易机会。</span>
          </p>
        </div>

        <div className="h-24">
          <div className="img-container">
            <img src={rate} className="h-24-img" />
          </div>
          <div className="detail-show-container">
            <span className="btn">
              <span className="weight">高准确率</span>
            </span>
          </div>
          <p>
            <span>
              经过上万次的策略信号推送，{companyInfo.title} 整体策略准确率维持在
            </span>
            <span className="white">80%以上</span>
            <span>，远超行业水平，让跟单操作稳定盈利。</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div id="register">
      {renderTitle()}
      {renderForm()}
      {renderDetailContent()}
      <div className="footer">
        © 2020 {companyInfo.title} App. All Rights Reserved.
      </div>
      <AgreeModal
        visible={show}
        companyTitle={companyInfo.title}
        onOk={() => {
          setShow(false);
        }}
      />
    </div>
  );
};
