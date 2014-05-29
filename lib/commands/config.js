var util = require('util');
var format = require('chalk');

module.exports = function (imports) {
  var cli = imports.cli;
  var config = imports.cwd.getConfig();
  
  var configCommand = cli.command('config')
    .before('isApp')
    .description('edit keys and values from your app config file')
    .handler(function (key, done) {
      cli.log();
      
      if (key) {
        var val = config[key];
        
        try {
          val = JSON.stringify(val, null, 2);
        }
        catch (e) {}
        
        cli.log(format.yellow(key) + ': ' + val);
      }
      else {
        cli.log(format.yellow('app config\n'));
        cli.log(JSON.stringify(config, null, 2));
      }
      
      done(null, config);
    });
  
  configCommand.task('add <key> <value>')
    .description('add a value to the config file')
    .handler(function (key, value, done) {
      imports.cwd.setConfigValue(key, value);
      
      cli.log('\nConfig value added');    
      
      done(null, imports.cwd.getConfig());
    });
  
  configCommand.task('remove <key>')
    .description('remove a value from the config file')
    .handler(function (key, done) {
      if (!key) return done(cli.errors.MISSING_CONFIG_KEY);
      
      imports.cwd.removeConfigValue(key);
      cli.log('\n' + format.bold(key) + ' removed');
      
      done(null, imports.cwd.getConfig());
    });
};