var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function (directoryPath) {
  return _(fs.readdirSync(directoryPath))
    .map(requireWithName)
    .zipObject()
    .value();
  
  function requireWithName (filename) {
    return [filename, require(path.join(directoryPath, filename))];
  }
};