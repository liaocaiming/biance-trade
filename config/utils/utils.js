const path = require("path");
const fs = require("fs");
const rootDir = fs.realpathSync(process.cwd());
const os = require("os");

function resolve(url) {
  return path.resolve(rootDir, url);
}

///获取本机ip///
function getIPAddress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  resolve,
  getIPAddress
};
