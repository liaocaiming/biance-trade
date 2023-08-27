import React, { memo } from 'react';

import { Link, LinkProps } from 'react-router-dom';

import { query } from '@utils/index';


const filterAttr = (obj: object, attrs: string[]): any => {
  const res = {};
  Object.keys(obj).forEach((key) => {
    if (attrs.indexOf(key) < 0) {
      res[key] = obj[key]
    }
  })

  return res
}

interface IProps extends LinkProps {
  search?: object;
}

export default memo((props: IProps) => {
  const { search, to } = props;
  const obj = filterAttr(props, ['search'])
  if (typeof search === 'object' && typeof to === 'object') {
    Object.assign(obj, { to: { ...to, search: query.queryToParamsStr(search) } })
  }
  return <Link {...obj} />
})