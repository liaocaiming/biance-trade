import React, { memo, useCallback, useState, useEffect } from 'react';

import { Icon } from 'antd-mobile';

import ReactDOM from 'react-dom';

import './index.less';
import classNames from 'classnames';

interface DrawerProps {
  className?: string;
  visibility: boolean;
  onClose?: () => void;
  children?: JSX.Element | JSX.Element[];
}

export default memo((props: DrawerProps) => {
  const { visibility, onClose, children, className = '' } = props;
  const [show, setShow] = useState<boolean>(false)

  const onDrawerClose = useCallback(
    () => {
      setShow(false)
      if (typeof onClose === 'function') {
        onClose();
      }
    },
    [],
  )

  useEffect(() => {
    if (visibility !== show) {
      setShow(visibility)
    }
  }, [visibility])

  if (!visibility) {
    return null;
  }

  console.log(visibility, 'visibility');

  return (
    ReactDOM.createPortal(
      (
        <section className={classNames(className, 'm-drawer')} >
          <div className="m-drawer__master"></div>
          <div className="m-drawer__wrapper">
            <div className="m-drawer__close" onClick={onDrawerClose}><Icon type='cross' size='md'></Icon></div>
            <div className="m-drawer__content">
              {children}
            </div>
          </div>
        </section>
      ),
      document.body
    )
  )
})