import React, { memo, useState, useEffect } from 'react';
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'

import { IActions } from '@containers/index.d'

import api from '@src/hTrade/config/api';


interface IProps extends ModalProps {
  detail: any; // 
  actions: IActions;
}


export default memo((props: IProps) => {
  const { visible, actions, onCancel, detail } = props;

  const [list, setList] = useState([])
  const getList = () => {
    actions.get(api.follow_recordsShow, detail).then((res) => {
      setList(res.data)
    })
  }

  useEffect(() => {
    getList()
  }, [detail])

  return (
    <Modal visible={visible} onCancel={onCancel} width={600} title='用户操作记录' onOk={onCancel} destroyOnClose>

    </Modal>
  )
})