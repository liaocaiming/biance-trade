import React, { memo } from 'react';

import { Breadcrumb } from 'antd';

import { Link } from 'react-router-dom'

const { Item } = Breadcrumb;

interface IList {
  title: string;
  url?: string;
}

interface IProps {
  list: IList[]
}


export default memo((props: IProps) => {
  const { list } = props;
  return (
    <Breadcrumb>
      {
        list.map((item) => {
          return (
            <Item>
              {item.url ? <Link to={{ pathname: item.url }}></Link> : item.title}
            </Item>
          )
        })
      }
    </Breadcrumb>
  )
})