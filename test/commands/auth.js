var authCommand = require('../../lib/commands/auth');
var expect = require('chai').expect;
var nash = require('nash');

describe('auth command', function () {
  
  it('gets the user auth token', function () {
    var cli = nash();
    var user = {
      get: function (str) {
        return str;
      }
    };
    
    authCommand({
      cli: cli,
      user: user
    });
    
    return cli.testCommand('auth:token').then(function (res) {
      expect(res.output).to.contain.string('token');
    });
  });
  
});