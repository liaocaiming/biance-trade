// import React from "react";

// import { Button, Tabs } from "antd";

// const { TabPane } = Tabs;

// import data from "./config";

// export default class App extends React.PureComponent {

//   public renderTabBarExtraContent = () => {
//     return (
//       <div>
//         <Button className='margin_left_10' style={{ marginRight: 20 }}>开启跟单</Button>
//         <Button danger>取消跟单</Button>
//       </div>
//     )
//   }

//   public render() {
//     return (
//       <div>
//         <Tabs tabBarExtraContent={this.renderTabBarExtraContent()} >
//           {data.map((item) => {
//             const { tab, component, key } = item;
//             return (
//               <TabPane tab={tab} key={key}>
//                 {component({})}
//               </TabPane>
//             );
//           })}
//         </Tabs>
//       </div>
//     );
//   }
// }
