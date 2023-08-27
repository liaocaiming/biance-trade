import { Button } from 'antd';

import React, { useCallback, useState, useEffect, useRef } from 'react';

import usePrev from '@shared/hooks/usePrevesions';

export default () => {
  const [ number, setNumber ] = useState<number>(0)

  const ref = useRef(number)

  ref.current = number;

  const [b, setB] = useState(1)

  const a = usePrev(number);

  console.log(a, 'aaa');
  
  const onAddClick = useCallback(() => {
    setNumber(number + 1);
  }, [number])

  const onBAddClick = () => {
    setB(b+1)
  }

  useEffect(() => {
    console.log(number, 'numbernumbernumber');
    console.log(ref.current, 'ef.current');
    
    return () => {
      
    }
  }, [b])
  return (
    <div>
      <Button onClick={onAddClick}>add</Button>
      <Button onClick={onBAddClick}>add + </Button>
      <div>{number}</div>
      <div>{b}</div>
    </div>
  )
}