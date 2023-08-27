import { api } from '@src/m-htrade/config'
import { fetch } from '@utils/index'
import React, { memo, useEffect, useState, useCallback } from 'react'
import './index.less';
import top from './images/icon-arrow-top.png'
import bottom from './images/icon-arrow-bottom.png'


interface IList {
  answer: string;
  question: string;
}

export default memo(() => {
  const [list, setList] = useState<IList[]>([]);
  const [index, setIndex] = useState<number>(-1);

  const getList = useCallback((page: number = 1) => {
    fetch.get(api.question_answers, { page }).then((res) => {
      setList(res.data || [])
    })
  }, [])


  useEffect(() => {
    getList()
  }, [])

  const onChange = useCallback((idx) => {
    if (index === idx) {
      setIndex(-1)
      return;
    }
    setIndex(idx);
   
  }, [index])

  return (
    <div
      className="m-questions"
    >
      {
        list.map((item, idx) => {
          const img = index === idx ? top : bottom;
          const none = index === idx ? 'block' : 'none';

          return (
            <div key={`${idx}`}>
              <div className='header' onClick={() => onChange(idx)}>
                <span className='header-q'> {`Q${idx + 1}`}</span>
                <span>{item.question}</span>
                <img src={img}  className='img' />
              </div>

              <div className={`answer ${none}`}>
                <pre>
                  {item.answer}
                </pre>
              </div>
            </div>
          )
        })
      }
    </div>
  )
})