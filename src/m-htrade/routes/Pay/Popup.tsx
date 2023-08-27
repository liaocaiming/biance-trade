import React, { memo, useCallback } from 'react';
import './Popup.less';
import { AppForm } from '@src/m-htrade/components/index';

import { FormItemOptions } from '@src/m-htrade/components/Form/interface.d';

import { Checkbox, Toast } from 'antd-mobile';

import { ISystem }from '@src/m-htrade/hooks/useSystemInfo';

import { copy, fetch } from '@utils/index';
import { api } from '@src/m-htrade/config';

interface Props {
  onClose?: () => void;
  isShow: boolean;
  system: ISystem
}

export default memo((props: Props) => {
  const { onClose, isShow, system } = props;

  const addressUrl = `${system?.host?.value}${system?.pay_address?.pictures[0]?.url?.url}`;

  const onSubmit = () => {
    const hash = (document.getElementById('hash') as any)?.value;
    if (!hash) {
      Toast.fail('请输入交易hash')
      return;
    }

    fetch.post(api.deposit_records, {
      hash,
      asset: system?.pay_asset?.value, 
      address: system?.pay_address?.value,
      amount: system?.pay_price?.value
    }).then(() => {
      Toast.success('提交成功');
      onClose && onClose();
    })
  }

  const copyFn = useCallback(
    () => {
      copy(`${system?.pay_address?.value}`, {
        success: () => {
          Toast.success('复制成功')
        },
        failed: () => {
          Toast.success('该浏览器不支持复制')
        }
      });
    },
    [system]
  )

  const onClickClose = useCallback(
    () => {
      onClose && onClose()
    },
    [isShow],
  )
  const formItems: FormItemOptions[] = [
    {
      name: 'hash',
      label: '交易哈希（Hash）',
      eleAttr: {
        placeholder: '请输入交易哈希（Hash）',
        // children: <a className='paste' onClick={onPaster}>粘贴</a>
      }
    },

    {
      name: 'agree',
      rules: [
        {
          required: true,
          message: '请先查看协议'
        }
      ],
      render: (options) => {
        const { form } = options
        const { setFieldsValue } = form;
        return (
          <div className='agree-container'>
            <Checkbox
              onChange={(e) => {
                if (setFieldsValue) {
                  setFieldsValue({
                    agree: e.target.checked
                  })
                }
              }}
            ></Checkbox>
            <span className='agree'>我已阅读且同意</span>
            <a>《智能信号服务协议》</a>
          </div>
        )
      }
    }
  ]


  return (
    <section className={`pay-popup ${isShow ? '' : 'none'}`}>
      <h3 className='title'><span>套餐选择</span> <i className='close' onClick={onClickClose}></i></h3>
      <div className="pay-content">
        <h4 className='pay-num'><span className='num'>2000</span><span>USDT / 年</span></h4>

        <div className="address">
          <div className="left">
            <div className='trx'><span>TRX地址: </span><a className='copy' onClick={copyFn}>复制</a></div>
            <span className='address-str'>{system?.pay_address?.value}</span>
          </div>

          <div className='right'>
            <img src={addressUrl} />
          </div>
        </div>

      </div>

      <div>
        <AppForm
          formItems={formItems}
          submitOptions={{
            text: '我已付款，确定提交'
          }}
          onFinish={onSubmit}
        />
      </div>
    </section>
  )
})

