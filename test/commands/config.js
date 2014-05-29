var configCommand = require('../../lib/commands/config');
var expect = require('chai').expect;
var nash = require('nash');
var errors = require('../../lib/errors');
var requestBuilder = require('request-builder');

describe('config command', function () {
  
  it('tests if the current directory is an app before the command runs');
  
  it('lists the contents of the app config file', function () {
    var cli = createCliAndExecuteConfigCommand();
    return cli.testCommand('config').then(function (res) {
      expect(res.output).to.contain.string(JSON.stringify({key: 'value'}, null, 2));
    });
  });
  
  it('shows a single config key and value', function () {
    var cli = createCliAndExecuteConfigCommand();
    return cli.testCommand('config', 'key').then(function (res) {
      expect(res.output).to.contain.string('key');
      expect(res.output).to.contain.string('value');
      expect(res.data).to.eql({key: 'value'});
    });
  });
  
  it('adds a new value to the config file', function () {
    var config = {};
    var cli = createCliAndExecuteConfigCommand(config);
    return cli.testCommand('config:add', 'key', 'value').then(function (res) {
      expect(config).to.eql({key: 'value'});
    });
  });
  
  it('removes a key and value from config file', function () {
    var config = {};
    var cli = createCliAndExecuteConfigCommand(config);
    return cli.testCommand('config:add', 'key', 'value').then(function (res) {
      return cli.testCommand('config:remove', 'key').then(function (res) {
        expect(config).to.eql({});
      });
    });
  });
  
  it('throws error if no key is provided when removing from config');
  
  function createCliAndExecuteConfigCommand (config) {
    config = config || {};
    
    var cli = nash({
      errors: errors
    });
    var api = requestBuilder();
    
    configCommand({
      cli: cli,
      cwd: {
        getConfig: function () {
          return {key: 'value'};
        },
        setConfigValue: function (key, value) {
          config[key] = value;
        },
        removeConfigValue: function (key) {
          delete config[key];
        }
      }
    });
    
    return cli;
  }
  
});