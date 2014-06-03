var path = require('path');
var cli = require('../lib/cli');
var errors = require('../lib/errors');
var expect = require('chai').expect;

describe('cli', function () {
  
  it('initiates a cli', function () {
    expect(cli.command).to.not.equal(undefined);
  });
  
  // FIXME: test this differently
  it.skip('uses the api host on the process environment', function () {
    var p = path.resolve(__dirname, '../lib/cli.js');
    delete require.cache[p];
    process.env.API_HOST = 'http://localhost';
    var cli = require('../lib/cli');
    
    expect(cli.api.origin()).to.equal('http://localhost');
    
    // reset
    delete require.cache[p];
    cli = require('../lib/cli');
  });
  
  it('loads all commands', function () {
    var len  = Object.keys(cli.commands).length;
    expect(len).to.be.above(1);
  });
  
});
