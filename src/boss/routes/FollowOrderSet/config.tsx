import React from 'react';

import Order from './orderMange';

import OrderList from './OrderList';


export default [
  {
    tab: '开单设置',
    key: 'order',
    component: (props: any) =>  <Order {...props}/>
  },
  // {
  //   tab: '已开的单',
  //   key: 'orderList',
  //   component: (props: any) =>  <OrderList {...props}/>
  // }
]