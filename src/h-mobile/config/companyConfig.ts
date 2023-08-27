
type CompanyKey = 'biduofeng' | 'hTrade';


import { ICompany } from '@typings/react.d';

const getConfig = (name: CompanyKey): ICompany => {
  const map = {
    biduofeng: {
      title: '币多分',
      name: 'biduofeng',

    },
    hTrade: {
      title: 'Hunter trades',
      name: 'hTrade',
    }
  }

  return map[name] || map.hTrade;
}


export default getConfig(COMPANY)
