
import iconLogo from './images/icon-logo.png';

import logo_biduofeng from './images/icon-biduofeng-logo.png';

export interface ICompany {
  weixin: string;
  logo: any;
  title: string;
}

export default {
  biduofeng: {
    weixin: 'BDFZBLH',
    logo: logo_biduofeng,
    title: '币多分'
  },
  hTrade: {
    weixin: 'blockchain2046',
    logo: iconLogo,
    title: 'Hunter trades'
  }
}
