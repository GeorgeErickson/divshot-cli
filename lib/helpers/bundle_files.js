var tarzan = require('tarzan');
var through = require('through');
var _ = require('lodash');
var ignoreGlobs = require('superstatic').ignore.globs;
var checkFileSizes = require('./check_files_sizes');

module.exports = function (appRootDir, exclude) {
  var stream = through();
  
  checkFileSizes(appRootDir, function (err) {
    if (err) return stream.emit('error', err);
    
    var packOptions = {
      directory: appRootDir,
      ignore: _.union(ignoreGlobs, exclude)
    };
    
    tarzan(packOptions).pipe(stream);
  });
  
  return stream;
};
