export const intervals = [
  '1m',
  '5m',
  '15m',
  '30m',
  '1h',
  '2h',
  '4h',
  '6h',
  '1d',
  '1w',
]


export const types = [
  {
    value: 'future',
    label: '合约'
  },
  {
    value: 'xianhuo',
    label: '现货'
  }
]

export const filterTypes = {
  1: "上穿",
  2: "下穿",
}

export const indicators = [
 'ema_7',
 'ema_30',
 'ema_100',
 'ema_144',
 'ema_169',
 'ema_200',
 'ema_300',
]

export const  defaultTableRows = [
  {
    title: '币名称',
    dataIndex: 'symbol'
  },
  {
    title: '收盘价',
    dataIndex: 'close'
  }
]


export const searchRows = [
  {
    title: "校验对",
    dataIndex: "coinType",
    eleAttr: {
      allowClear: false
    }
  },

  {
    title: "交易类型",
    dataIndex: "type",
  },

  {
    title: "周期",
    dataIndex: "interval",
  },

  {
    title: "指标",
    dataIndex: "indicators",
    eleAttr: {
      mode: "tags",
      placeholder: "请输入指标, 如 ema_7, am_30",
      style: {
        width: 300
      }
    }
  },
  
  {
    title: "上穿或下穿",
    dataIndex: "filterType",
  },
];

export const coinTypes = [ 'USDT', 'BTC']