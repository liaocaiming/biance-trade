import React, { useState, memo } from 'react';

import './index.less';

interface EmailCodeProps {
  onSuccess: () => void;
  disabled?: boolean;
  countNum?: number;
  validator?: (() => boolean) | boolean;
}

let timer;

export default memo((props: EmailCodeProps) => {
  const { onSuccess, countNum = 60, validator } = props;
  let [count, setCount] = useState(countNum);
  const [start, setstart] = useState(false);

  const onClick = () => {
    let disabled = validator;
    if (typeof disabled === 'function') {
      disabled = disabled();
    }

    if (disabled === false) {
      return
    }

    if (start || timer) {
      return
    }
    onSuccess();
    setstart(true)

    timer = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(timer)
        timer = null
        setstart(false)
        setCount(countNum)
        return
      }
      setCount(count)

    }, 1000)
  }

  return <div className={`email-code ${start ? 'start' : ''}`} onClick={onClick}>{start ? `${count} s` : '验证码'}</div>
})