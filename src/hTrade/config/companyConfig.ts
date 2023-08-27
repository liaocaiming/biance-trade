
type CompanyKey = 'biduofeng' | 'hTrade';


import { ICompany } from '@typings/react.d';

const getConfig = (name: CompanyKey): ICompany => {
  const map = {
    biduofeng: {
      title: '币多分',
      menuKeys: ['user', 'rechargeList'],
    }
  }

  return map[name] || {};
}


export default getConfig(COMPANY)
