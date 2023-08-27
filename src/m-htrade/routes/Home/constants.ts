
export const marginType = {
  ISOLATED: '逐仓',
  CROSSED: '全仓'
}

export const tabs = [
  {
    name: '1',
    label: '全部推送',
    query: {
      set_type: null,
      sub: null
    }
  },
  {
    name: '2',
    label: '现货信号',
    query: {
      set_type: 1,
      sub: null
    }
  },
  {
    name: '3',
    label: '合约信号',
    query: {
      set_type: 3,
      sub: null
    }
  },
  {
    name: '4',
    label: '我的关注',
    query: {
      set_type: null,
      sub: 1
    }
  }
]
