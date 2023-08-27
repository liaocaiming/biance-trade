import { IValue } from '@utils/lib/validator'

const rules: IValue[] = [
  {
    name: 'binance_user_id',
    rules: [
      {
        required: true,
        message: '请输入uid'
      }
    ]
  },
  {
    name: 'username',
    rules: [
      {
        required: true,
        message: '请输入账户名'
      }
    ]
  },
  {
    name: 'password',
    rules: [
      {
        required: true,
        message: '请输入密码'
      }
    ]
  }
]

export default rules;