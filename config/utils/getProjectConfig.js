const yargs = require("yargs").argv;
const name = yargs.name || "boss";
const appJson = require(`../../src/${name}/config/app.json`);

console.log(name, "name4444");

module.exports = () => {
  return {
    projectName: name,
    version: appJson.version,
  };
};
