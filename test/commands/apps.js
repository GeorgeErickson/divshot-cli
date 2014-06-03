var appsCommand = require('../../lib/commands/apps');
var errors = require('../../lib/errors');
var requestBuilder = require('request-builder');
var expect = require('chai').expect;
var nash = require('nash');

describe('apps', function () {
  var cli;
  var api;
  
  beforeEach(function () {
    cli = nash();
    api = requestBuilder();
  });
  
  it('authenticates before the command is ran');
  
  it('prints out the user apps', function () {
    api.when('GET', '/apps').respond({
      self: [
        {name: 'testapp'}
      ]
    });
    
    appsCommand({
      cli: cli,
      api: api,
      errors: errors
    });
    
    return cli.testCommand('apps').then(function (res) {
      expect(res.output.toLowerCase()).to.have.string('your apps');
      expect(res.output).to.match(/testapp$/);
    });
  });
  
  it('prints out the orgs apps', function () {
    api.when('GET', '/apps').respond({
      self: [],
      'org:testorg': [
        {name: 'testapp'}
      ]
    });
    
    appsCommand({
      cli: cli,
      api: api,
      errors: errors
    });
    
    return cli.testCommand('apps').then(function (res) {
      expect(res.output).to.have.string('testorg apps');
      expect(res.output).to.match(/testapp$/);
    });
  });
  
  it('prints out the apps architect name', function () {
    api.when('GET', '/apps').respond({
      self: [
        {architect: {
            filename: 'architectapp'
        }}
      ]
    });
    
    appsCommand({
      cli: cli,
      api: api,
      errors: errors
    });
    
    return cli.testCommand('apps').then(function (res) {
      expect(res.output).to.match(/architectapp$/);
    });
  });
  
  it('prints error for invalid token', function () {
    api.when('GET', '/apps')
      .respond({
        error: 'invalid_token'
      })
      .status(401);
      
    appsCommand({
      cli: cli,
      api: api,
      errors: errors
    });
    
    cli.testCommand('apps').then(function (err) {
      expect(err).to.equal(errors.INVALID_TOKEN);
    });
  });
  
  it('prints the error returned from the api', function () {
    api.when('GET', '/apps')
      .respond({
        error: 'api error'
      })
      .status(401);
      
    appsCommand({
      cli: cli,
      api: api,
      errors: errors
    });
    
    cli.testCommand('apps').then(function (err) {
      expect(err).to.equal('api error');
    });
  });
  
});