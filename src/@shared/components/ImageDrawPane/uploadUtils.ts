import requset from '@utils/lib/request';

import getIn from '@utils/lib/getIn';

import { message  } from 'antd';

let localDomain = 'http://oz4q4k50q.bkt.clouddn.com';
let localToken = '';

export interface IConfig {
  domain: string;
  token: string
}

export function getQiniuUploadConfig(): Promise<IConfig> {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      domain: localDomain,
      token: 'aaaaaaaa',
    });
  }
  if (localDomain && localToken) {
    return Promise.resolve({
      domain: localDomain,
      token: localToken,
    });
  }

  return Promise.all([
    requset.get('qiniu/getDomain', {}),
    requset.get('qiniu/getUploadToken', {}),
  ]).then((values: any) => {
    const domainUrl = getIn(values, [0, 'data'], localDomain);
    const uploadToken = getIn(values, [1, 'data', 'uptoken']);
    localDomain = domainUrl;
    localToken = uploadToken;

    values.some((value: any) => {
      if (value && value.msg) {
        message.error(value.msg)
        return true;
      }
      return false;
    })

    return {
      domain: domainUrl,
      token: uploadToken,
    };
  });
}
