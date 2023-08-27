import React, { memo, useState, useCallback } from 'react';

import ListItem from './listItem';

import './index.less';

import useSystemInfo from '@src/m-htrade/hooks/useSystemInfo';

import Order from '../Order';

interface Props {
  list: any[];
  onSuccess?: (item: any) => void;
}

export default memo((props: Props) => {
  const { list, onSuccess } = props;
  const [system] = useSystemInfo();
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>({});

  const onDrawerClose = useCallback(() => {
    setShowDrawer(false)
    setDetail({});
  }, [])

  const onDrawerShow = useCallback((item) => {
    return () => {
      setDetail(item);
      setShowDrawer(true)
    }
  }, [showDrawer])
  return (
    <section className="home-list" id='scroll'>
      {
        list.map((item, index) => {
          return (
            <div className='item' key={item.id || index}>
              <ListItem item={{ ...item, index }} onSuccess={onSuccess} host={system?.host?.value} onDrawerToggle={onDrawerShow} />
            </div>
          )
        })
      }


      <Order visibility={showDrawer} detail={detail} onClose={onDrawerClose}></Order>
    </section>
  )
})