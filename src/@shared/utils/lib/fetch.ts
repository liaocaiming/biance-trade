import request, { IResponse } from './request';

import { filterEmptyValue } from './helpers'

import { Toast } from 'antd-mobile'

interface IOptions {
  showLoading?: boolean;
  showError?: boolean;
}
export function get(url: string, obj?: any, options?: IOptions): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    const { showLoading, showError } = options || {};
    if (showLoading !== false) {
      Toast.loading('加载中')
    }
    const data = filterEmptyValue(obj)
    request.get(url, data, options).then(res => {
      Toast.hide()
      if (res.code == 200) {
        resolve(res)
        return
      }
      if (res.code === 1004 || res.code === 1500) {
        Toast.fail(res && res.message || res.error, 1, () => {
          window.location.hash = '/'
        })
        return
      }

      if (showError !== false) {
        Toast.fail(res && res.message || res.error)
      }
      reject(res)
    }).catch((err) => {
      Toast.hide()
      reject(err)
    })
  })
}

export function post(url: string, obj?: any, options?: IOptions): Promise<IResponse> {
  return new Promise((resolve, reject) => {
    const { showLoading, showError } = options || {};
    if (showLoading !== false) {
      Toast.loading('加载中')
    }
    const data = filterEmptyValue(obj);
    request.post(url, data, options).then(res => {
      Toast.hide()
      if (res.code == 200) {
        resolve(res)
        return
      }
      if (showError !== false) {
        Toast.fail(res && res.message || res.error)
      }
      reject(res)
    }).catch((err) => {
      Toast.hide()
      reject(err)
    })
  })
}