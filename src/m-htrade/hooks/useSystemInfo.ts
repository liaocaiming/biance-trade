import { useState, useEffect, useCallback } from 'react';

import { fetch } from '@utils/index';

import { api } from '../config';


export interface IList {
  desc: string;
  is_picture: boolean;
  key: string;
  pictures: any[]
  value: string| number;
}


export interface ISystem {
  [key: string]: IList
}

export default () => {
  const [system, setSystem] = useState<ISystem>({})
  const [ is, setIs ] = useState<boolean>(false)
  const getSystemInfo = useCallback(() => {
    fetch.get(api.system_settings, { }, { showLoading: false }).then((res) => {
      setIs(true)
      const { data = [] } = res;
      const obj = {}
      data.forEach((item) => {
        obj[item.key] = item;
      })

      setSystem(obj)
    })
  }, [])

  useEffect(() => {
    if (is) return;
    getSystemInfo();
  }, [is])

  return [system]
}