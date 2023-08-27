import React from "react";

import { Button } from "antd";

import OrderSet from './orderMange';

import OrderList from './OrderList';

import { connect } from '@containers/appScreen'

import IProps from '@typings/react.d'

import './index.less'

@connect()
export default class App extends React.PureComponent<IProps> {

  private onCancelAllOrder = () => {
    const { actions } = this.props;
    actions.post('order/cancelAllFollow').then((res) => {
      console.log(res)
    })
  }

  private onOpenAllOrder = () => {
    const { actions } = this.props;
    actions.post('order/openAllFollow').then((res) => {
      console.log(res)
    })
  }


  public renderTabBarExtraContent = () => {
    
    return (
      <div className='btn-content boundary'>
        <Button className='margin_left_10' style={{ marginRight: 20 }} onClick={this.onOpenAllOrder}>开启跟单</Button>
        <Button danger onClick={this.onCancelAllOrder}>取消跟单</Button>
      </div>
    )
  }

  public render() {
    return (
      <div className='follow-order-set'>
        {this.renderTabBarExtraContent()}
        <div className='order-set boundary'>
          <OrderSet />
        </div>
        <div>
          <OrderList {...this.props} />
        </div>
      </div>
    );
  }
}
