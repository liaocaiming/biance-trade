import React, { useState, useCallback } from "react";
import { copy } from "@utils/index";
import IProps from "@typings/react.d";
import "./index.less";
import { fetch } from '@utils/index'
import { api } from '@src/m-htrade/config';
import { pageUrlsMap } from "@src/m-htrade/config/routes";
import buy from './images/img-buy.png';
// import wxchat from './images/icon-wxchat.png'
import Popup from './Popup';
import useSystemInfo from '@src/m-htrade/hooks/useSystemInfo';

import { Toast } from "antd-mobile";

export default (props: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [system] = useSystemInfo();
  const copyFn = useCallback(
    () => {
      copy(`${system?.customer_service_qrcode?.value}`, {
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
    <section className='m-pay'>
      <section className="pay-introduce">
        <h2>基本介绍</h2>
        <p>Hunder Teadrs智能信号是一套智能化的交易策略系统，依靠专业、完善的交易策略，Hunder Teadrs智能信号系统能够24小时不间断的跟踪现货、合约的市场走势，帮助用户发现短线、中线、长线的潜在交易机会。同时，系统也会在风险出现的时候，给用户及时的风险提醒。</p>
        <div className='icon-buy-container'><img className='icon-buy' src={buy} /></div>
        <h2>功能优势</h2>
        <h3>1.极致方便</h3>
        <p>简单高效的推送方式，方便用户第一时间获取信号，并进行交易操作；</p>
        <h3 className='margin_top_20'>2.简单操作</h3>
        <p>开单之后，在信号对应位置设置止盈止损，无需盯盘，利润&风险完全可控；</p>
        <h2 className='margin_top_40'>套餐类型</h2>
        <p className='margin_top_20'>2000 USDT/年</p>
        <h2 className='margin_top_20'>如何开通智能信号</h2>
        <p>请点击「立即开通」按钮，按照提示操作填写相关信息后并「确认提交」，系统审核通过后即可正常使用智能信号VIP会员服务，如有疑问请联系微信客服。</p>
        <h3 className='margin_top_20 margin_bottom_8'>请联系客服微信号：</h3>
        <p className='wxchat-container'><img className='icon-wxchat' src={`${system?.host?.value}${system?.customer_service_qrcode?.pictures[0]?.url?.url}`} /><span className='wxchat-txt' id='wxchat'>{system?.customer_service_qrcode?.value}</span> <a className='copy' onClick={copyFn}>点击复制</a></p>
        <h3 className='margin_top_20 margin_bottom_8'>客服在线时间：</h3>
        <p>工作日：上午 09:00-12:30 / 下午 14:00-19:00</p>
      </section>
      <div className='btn-container' onClick={() => { setShow(true) }}>立即开通</div>

      <div><Popup isShow={show} onClose={() => { setShow(false) }} system={system} /></div>
    </section>
  );
};
