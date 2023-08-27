const merge = require('webpack-merge');
const _ = require('lodash')

function filterFalse(arr) {
  return arr.filter(item => !!item)
}

module.exports =  merge(
  {
    customizeArray(a, b, key) {
      if (key === 'plugins') {
        return _.uniq([...filterFalse(a), ...filterFalse(b)]);
      }

      // Fall back to default merging
      return undefined;
    },
    customizeObject() {

      // Fall back to default merging
      return undefined;
    }
  }
)
