import React from "react";

import { Tabs, List } from "antd";

const { TabPane } = Tabs;

import { currentList } from "./constants";

import { CurrentItem, FinishedItem, TrustItem } from "./components";

import IProps from "@typings/react.d";
export default class App extends React.PureComponent<IProps> {
  private cancelFn = (item: any) => {
    return () => {
      const { actions } = this.props;
      console.log(item);
      actions.post("cancel", item).then((res) => {
        if (res) {
        }
      });
    };
  };

  private renderCurrent() {
    return (
      <List
        itemLayout="horizontal"
        dataSource={currentList}
        renderItem={(item) => {
          return <CurrentItem {...item} cancelFn={this.cancelFn} />;
        }}
      />
    );
  }

  private renderTrust() {
    return <span>renderTrust</span>;
  }

  private renderFinished() {
    return <span>renderFinished</span>;
  }

  public render() {
    return (
      <div>
        <Tabs>
          <TabPane key="current" tab="当前持仓">
            {this.renderCurrent()}
          </TabPane>

          <TabPane key="trust" tab="当前委托">
            {this.renderTrust()}
          </TabPane>

          <TabPane key="finished" tab="已完成">
            {this.renderFinished()}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
