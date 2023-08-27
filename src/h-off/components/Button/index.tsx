import React, { memo } from 'react';

import './index.less';

interface IProps {
  children: any;
  className?: string
}

export default memo((props: IProps) => {
  return <span className={`h-off_btn ${props.className || ''}`}>{props.children}</span>
})