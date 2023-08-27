export const payType = [
  {
    value: '1',
    label: '年付费'
  }
]

export const orderStatus = [
  {
    value: '1',
    label: '新信号'
  },
  {
    value: '2',
    label: '止盈信号'
  },
  {
    value: '3',
    label: '止损信号'
  },
  {
    value: '4',
    label: '超时信号'
  },
  {
    value: '7',
    label: '止盈信号'
  },
]






// 1:新注册会员,2:体验会员,3:vip会员,4:体验到期,5:会员到期

export const userType = [
  {
    value: '1',
    label: '新用户'
  },
  {
    value: '2',
    label: '体验会员'
  },
  {
    value: '3',
    label: 'vip会员'
  },
  {
    value: '4',
    label: '体验到期'
  },
  {
    value: '5',
    label: '会员到期'
  },

]


export const transferStatus = [
  {
    value: 0,
    label: '已发送确认Email'
  },
  {
    value: 1,
    label: '已被用户取消'
  },
  {
    value: 2,
    label: '等待确认'
  },
  {
    value: 3,
    label: '被拒绝'
  },
  {
    value: 4,
    label: '处理中'
  },

  {
    value: 5,
    label: '交易失败'
  },
  {
    value: 6,
    label: '完成'
  },
]

// 现货:1,杠杆:2,合约:3,熊牛币:4
export const orderType = {
  1: '现货',
  2: '杠杆',
  3: '合约',
  4: '熊牛币'
}


export const s_type = {
  1: '自动推单',
  2: '手动推单'
}


export const period_type = {
  1: '短线',
  2: '中线',
  3: '长线'
}

export const set_type = {
  1: '现货',
  3: '合约'
}


export const bot_status = {
  1: '启用',
  2: '停用'
}