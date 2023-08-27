import IProps from '@typings/react.d';

import React, { memo, useState, useEffect } from 'react';

import Button from '@src/h-off/components/Button'

import './index.less';

import BIANCE from './images/logo-biance.png';

import HUOBI from './images/logo-huobi.png';

import FTX from './images/logo-ftx.png';

import OK from './images/logo-ouyi_03.png';

import KEFU from './images/kefu.jpg';

import H_LOGO from './images/Huntericon.png'

import QRCODE from './images/QR1.jpg'

import APK from './images/apk.png';

import nav from './images/nav-open.png';

import api from "@src/h-mobile/config/api";

import { fetch } from '@utils/index'

import { Modal } from 'antd';
import { Toast } from 'antd-mobile';

const trades = [
  {
    img: BIANCE,
    name: 'biance',
  },
  {
    img: HUOBI,
    name: 'huobi',
    disabled: true

  },
  {
    img: FTX,
    name: 'ftx',
    disabled: true

  },
  {
    img: OK,
    name: 'ok',
    disabled: true
  }
]

export default memo((props: IProps) => {
  const [info, setInfo] = useState({
    downUrl: '',
    qrUrl: ''
  })

  const [show, setShow] = useState(false);


  const downApp = async () => {
    if (!info.downUrl) {
      Toast.fail('系统故障， 请刷新后重新下载')
      return
    }
    window.location.href = info.downUrl
  }

  const getData = async () => {
    const res = await fetch.get(api.system_settings)
    console.log(res, 'res');
    const { data = [] } = res;
    let host = '';
    let apiUrl = '';
    data.forEach((it) => {
      if (it.key === "lastest_version_url") {
        apiUrl = it.url
      }
      if (it.key === "host") {
        host = it.value
      }
    })

    setInfo({
      qrUrl: '',
      downUrl: `${host}${apiUrl}`
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const renderHeader = () => {
    return (
      <header className='header'>
        <div className='container_center container_content'>
          <div className="logo">
            <img src={nav} className='img' />
          </div>
          <div className="btn-container">
            <span className="btn btn-down cursor" onClick={downApp}>App下载</span>
          </div>
        </div>
      </header>
    )
  }

  const renderHome = () => {
    return (
      <section className='home-content container_center'>
        <div>
          <div className='title-logo' >INTRODUCING HUNTER TRADES</div>

          <h3 className="title">Hunter trades智能交易策略系统</h3>

          <p className='dec'>无需盯盘，高准确率，让盈利更简单</p>
          <div className="btn-container">
            <span className="btn">购买会员</span>
            <span className="btn right_btn">免费试用</span>
          </div>
        </div>

        <div className="trades">
          <p className="text">支持交易所</p>
          <div className="trades_items">
            {
              trades.map((item) => {
                if (item.disabled) {
                  return
                }
                return <img src={item.img} key={item.name} className='item' />
              })
            }
          </div>

          <p className="text disabled_text">不支持交易所</p>
          <div className="trades_items">
            {
              trades.map((item) => {
                if (!item.disabled) {
                  return
                }
                return <img src={item.img} key={item.name} className='item' />
              })
            }
          </div>
        </div>

      </section>
    )
  }

  const renderTradeRecords = () => {
    return (
      <section className='trade_records container_center'>
        <div className='trade_list' />
      </section>
    )
  }

  const renderAdvantage = () => {
    return (
      <section className='container_center advantage'>
        <h3 className='title'>如何高效捕捉交易机会？</h3>


        <div className="advantage_container">

          <div className="advantage_item first">
            <div className="right logo_img" />
            <div className="left">
              <div className='btn_container'>
                <Button className='btn'>
                  <span className='weight'>24小时</span><span>连续推送</span>
                </Button>
              </div>

              <div className='advantage_dec'>
                <p>依靠专业、完善的交易策略,</p>

                <p>
                  <span>Hunter trades 交易系统能够</span>
                  <span className='white'>24小时</span>
                  <span>不间断地跟踪现货、合约、杠杆代币的市场走势,帮助用户发现足够多的潜在交易机会。</span>
                </p>
              </div>
              <div className='learn_more'></div>
            </div>

          </div>



          <div className="advantage_item second">
            <div className="right logo_img" />

            <div className="left margin_top_100">
              <div className='btn_container'>
                <Button className='btn'>
                  <span className='weight'>长中短线</span><span>信号全面覆盖</span>
                </Button>
              </div>

              <div className='advantage_dec'>
                <p>
                  <span>Hunter trades提供了</span>
                  <span className='white'>短线（3天内）、中线（15天内）、长线（30天）</span>
                  <span>等不同周期的信号提醒，让用户都找到适合自己的交易机会。</span>
                </p>
              </div>
              <div className='learn_more'></div>
            </div>
          </div>

          <div className="advantage_item third">
            <div className="right logo_img" />
            <div className="left margin_top_100">
              <div className='btn_container'>
                <Button className='btn'>
                  <span className="weight">
                    高准确率
                  </span>
                </Button>
              </div>

              <div className='advantage_dec'>
                <p>经过上万次的策略信号推送，Hunter trades 整体策略</p>

                <p>
                  <span>准确率维持在</span>
                  <span className='white'>80%以上</span>
                  <span>，远超行业水平，让跟单操作稳定盈利。</span>
                </p>
              </div>
              <div className='learn_more'></div>
            </div>

          </div>


        </div>

      </section >
    )
  }

  const renderBuyMember = () => {
    return (
      <section className="buy_member">

        <div className='container_center container'>
          <div className="buy item">
            <div className='member_price title'>会员 2000u / 年</div>
            <div className="line" />

            <div className="dec">
              <p className='text'>高准确率信号推送</p>
              <p className='text'>针对会员的强势币种推荐 </p>
              <p className='text'>大盘分析以及风险提示</p>
            </div>

            <div className='more'>更多其他会员权益</div>

            <div className="btn cursor" onClick={() => { setShow(true) }}>购买会员</div>
          </div>

          <div className="experience item">
            <div className='title'>10天体验 免费申请</div>
            <div className="line" />

            <div className="dec">
              <p className='text'>在官网页面下载手机APP（安卓）</p>
              <p className='text'>注册Hunter trades 账户 </p>
              <p className='text last'>完成账户注册之后，添加客服微信，咨询免费试用细节</p>
            </div>

            <div className="kefu">
              <img src={KEFU} className='img' />
            </div>

          </div>
        </div>
      </section>
    )
  }

  const renderFooter = () => {
    return (
      <section className="footer ">
        <div className="container_center">
          <div className="htrade_app">
            <div className="htrade flex">
              <img src={H_LOGO} className="logo" />
              <div className='htrade_text'>
                <h6>APP下载</h6>
                <p className='down_tip'>下载Hunter trades 移动APP    随时随地接收交易信号</p>
              </div>
            </div>

            <div className="app_down flex">
              <img src={QRCODE} />
              <p>扫码下载</p>
              <img src={APK} onClick={downApp} className='cursor' />
              <p onClick={downApp} className='cursor' >点击下载APK</p>
            </div>
          </div>


          <div className="footer_btn_container">
            <img src={nav} className='img' />
          </div>

          <p className='footer_text'>© 2020 Hunter trades App. All Rights Reserved.</p>

        </div>

      </section>
    )
  }

  const renderModal = () => {
    return (
      <Modal wrapClassName='home_modal' visible={show} title='客服微信' footer={null} onCancel={() => { setShow(false) }}>
        <div>
          <img src={KEFU} className='wechat' />
        </div>
      </Modal>
    )
  }

  return (
    <section id='home'>
      {renderHeader()}
      {renderHome()}
      {renderTradeRecords()}
      {renderAdvantage()}
      {renderBuyMember()}
      {renderFooter()}
      {renderModal()}
    </section>
  )

})