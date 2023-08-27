import React from "react";

import { Tabs } from "antd";

const { TabPane } = Tabs;

import data from "./config";

export default class App extends React.PureComponent {
  public render() {
    return (
      <div>
        <Tabs>
          {data.map((item) => {
            const { tab, component, key } = item;
            return (
              <TabPane tab={tab} key={key}>
                {component({})}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
