import React, { memo, useCallback } from 'react';
import './index.less';
import noPermission from './icon-no-permission.png';
import history from '@utils/lib/history';
// 1:新注册会员,2:体验会员,3:vip会员,4:体验到期,5:会员到期

interface Props {
  userType: 1 | 2 | 3 | 4 | 5;
}

export default memo((props: Props) => {
  // const { userType } = props;
  const onBtnClick = useCallback(
    () => {
      history.push('/m-htrade/pay')
    },
    [history],
  )
  return (
    <div className='m-no-permission'>
      <img src={noPermission} className='img' />
      <div className='text'>暂无权限，您可以：</div>
      <div className="btn" onClick={onBtnClick}>开通会员</div>
    </div>
  )
})