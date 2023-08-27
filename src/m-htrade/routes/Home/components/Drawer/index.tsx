import React, { memo, useCallback } from 'react';

import { Drawer } from 'antd-mobile';

import { DrawerWebProps } from 'antd-mobile/lib/drawer/PropsType.d';

import './index.less';

import { sideRowData } from './utils';

import { helpers } from '@utils/index'

import history from '@utils/lib/history';

import omit from 'loadsh/omit';


interface Props extends DrawerWebProps {
  drawerWebProps?: DrawerWebProps;
}

interface SidebarProps {

}


const Sidebar = memo((props: SidebarProps) => {

  const goTo = useCallback(
    (url) => {
      return () => {
        history.push(url)
      }
    },
    [history]
  )

  return (
    <section className="siderBar">
      <section className='header'>
        <div className="email">5000000@qq.com</div>
        <div className="user">
          <span className="id">ID:11516678</span><span className="vip">VIP</span><span className="member">会员</span>
        </div>
      </section>

      <section className='content'>
        <ul className='padding_30'>
          {
            sideRowData.map((item) => {
              return (
                <li
                  className={helpers.reactClassNameJoin(['content-item', item.showBorder ? 'border-bottom' : ''])}
                  key={item.url}
                  onClick={goTo(item.url)}
                >
                  <img src={item.icon} />
                  <span>{item.title}</span>
                </li>
              )
            })
          }
        </ul>
      </section>
    </section>
  )
})


export default memo((props: Props) => {
  const { drawerWebProps, open: show } = props;
  const { open } = drawerWebProps || {};
  if (!open && !show) {
    return null
  }

  const drawerProps = omit(props, [drawerWebProps])

  return (
    <section className="m-drawer">
      <Drawer
        sidebar={<Sidebar />}
        enableDragHandle
        {...drawerProps}
        {...drawerWebProps}
      ><span></span></Drawer>
    </section>
  )
})