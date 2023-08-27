import { Card, Row, Col } from "antd";

import StopLoss from "./StopLoss";

import OpenOrder from "./OpenOrder";

import StopProfit from "./StopProfit";

import React from "react";
export default class App extends React.PureComponent {
  public render() {
    return (
      <div>
        <Row gutter={24}>
        <Col span={8}>
          <OpenOrder></OpenOrder>
        </Col>
        <Col span={8}>
          <StopProfit></StopProfit>
        </Col>
        <Col span={8}>
          <StopLoss></StopLoss>
        </Col>
        </Row>
      </div>
    );
  }
}
