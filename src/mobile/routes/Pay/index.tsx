import React from "react";
import { copy } from "@utils/index";
import IProps from "@typings/react.d";
import "./index.less";
import { AppForm } from '@src/mobile/components/index';
import { fetch } from '@utils/index'
import { api } from '@src/mobile/config';
import { pageUrlsMap } from "@src/mobile/config/routes";

export default (props: IProps) => {
  const copyFn = () => {
    copy("account");
  };

  const goTo = (url: string) => {
    const { history } = props;
    return () => {
      history.push(url);
    };
  };

  const onFinish = (params) => {
    fetch.post(api.checkTXid, params).then(() => {
      goTo(pageUrlsMap.home)()
    })
  }

  return (
    <div className='mb-pay'>

      <div className='skip-btn-container'><span className='skip-btn' onClick={goTo(pageUrlsMap.home)}>跳过</span></div>

      <div className='receive-code'>
        <img className='qrcode' src="" alt="usdt收款码" />
      </div>

      <div>
        <input type="text" style={{ display: "none" }} id="input" />
        <div className='address' id="account">4343434</div>
        <div className='copy-btn-container'> <span className='copy-btn' onClick={copyFn}>复制</span></div>
      </div>

      <div className='form-container'>
        <AppForm
          formItems={
            [
              {
                name: 'txid',
                rules: [
                  {
                    required: true,
                    message: '请输入txid'
                  }
                ],
                eleAttr: {
                  placeholder: '请输入充值txid'
                }
              }
            ]
          }
          submitOptions={{
            text: '下一步',
            containerClassName: 'margin_top_30'
          }}
          onFinish={onFinish}
        />
      </div>
    </div>
  );
};
