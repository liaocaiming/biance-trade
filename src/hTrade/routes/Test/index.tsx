import React, { useState } from "react";

import IProps from "@typings/react.d";

import { connect } from "@containers/app";

import { api } from "@src/hTrade/config";

import Select from "@components/Select";
import { Button } from "antd";


// @connect()
// export default class App extends React.PureComponent<IProps> {
//   render() {
//     return (
//       <div>
//         <Select
//           url={api.bots}
//           actions={this.props.actions}
//           searchKey="email"
//           style={{ width: 200 }}
//           fieldNames={{ value: "email", label: "name" }}
//         />
//       </div>
//     );
//   }
// }


export default  () => {
  console.log(2222)
  let [count, setCount] =  useState(0)
  const add = () => {
    setTimeout(() => setCount(count+1), 1000)
  }
  return (
    <div>
      <Button onClick={add}>新增</Button>
      <div>{count}</div>
    </div>
  )
}
