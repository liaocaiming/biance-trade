"use strict";

const appConfig = require("../config/utils/getProjectConfig")();

const utils = require("../config/utils/utils");

// 服务器文件上传配置
function getSftpConfig(name, env = "release") {
  const configs = {
    develop: {},
    release: {
      projectName: appConfig.projectName,
      context: utils.resolve(`dist`),
      connectTimeout: 30000,
      host: "8.129.131.129",
      port: 22,
      username: "fesit",
      password: "Lcm123456",
      remotePath: "/usr/share/nginx/html",
    },

    production: {},
  };

  return configs[env];
}

module.exports = getSftpConfig;
