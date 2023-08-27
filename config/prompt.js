module.exports = {
  selectName: {
    type: 'list',
    name: 'name',
    message: '请选择要获取的项目',
    choices: ['hTrade', 'h-mobile', 'h-off', 'mobile', 'boss', 'm-htrade'],
  },

  selectCompany: {
    type: 'list',
    name: 'company',
    message: '请选择要获取的公司',
    choices: ['hTrade', 'biduofeng'],
  },
};
