var accountCommand = require('../../lib/commands/account');
var errors = require('../../lib/errors');
var requestBuilder = require('request-builder');
var expect = require('chai').expect;
var nash = require('nash');

describe('account command', function () {
  var cli;
  var api;
  
  beforeEach(function () {
    cli = nash({
      errors: errors
    });
    api = requestBuilder();
    
    api.when('GET', '/self')
      .respond(userObject());
    
    accountCommand(cli, api);
  });
  
  it('prints out the account balance', function () {
    var balance;
    
    cli.logObject = function (output) {
      balance = output['Account Balance'];
    };
    
    return cli.testCommand('account').then(function (res) {
      expect(balance).to.equal('$0');
    });
  });
  
  it('prints out the account credit', function () {
    var credit;
    
    cli.logObject = function (output) {
      credit = output['Account Credit'];
    };
    
    return cli.testCommand('account').then(function (res) {
      expect(credit).to.equal('$1');
    });
  });
  
  it('prints out the account created', function () {
    var created;
    
    cli.logObject = function (output) {
      created = output['Account Created'];
    };
    
    return cli.testCommand('account').then(function (res) {
      expect(created).to.equal('March 13th, 2013');
    });
  });
  
  it('prints out the account emails', function () {
    var emails;
    
    cli.logObject = function (output) {
      emails = output['Emails'];
    };
    
    return cli.testCommand('account').then(function (res) {
      expect(emails).to.eql(['test@test.com (primary)']);
    });
  });
  
  it('prints out the organizations', function () {
    var orgs;
    
    cli.logObject = function (output) {
      orgs = output['Organizations'];
    };
    
    return cli.testCommand('account').then(function (res) {
      expect(orgs).to.eql(['testorg']);
    });
  });
  
  it('prints default error on any error', function () {
    cli = nash({errors: errors});
    api = requestBuilder();
    api.when('GET', '/self').status(401);
    accountCommand(cli, api);
    
    return cli.testCommand('account').then(function (err) {
      expect(err).to.equal(cli.errors.DEFAULT);
    });
  });
  
});

describe('account:redeem <code>', function () {
  var cli;
  var api;
  
  beforeEach(function () {
    cli = nash({
      errors: errors
    });
    api = requestBuilder();
    
    api.when('PUT', '/vouchers/123/redeem')
      .respond(redeemObject());
    
    accountCommand(cli, api);
  });
  
  it.skip('errors when node code is given', function (done) {
    cli.testCommand('account:redeem').then(function (res) {}, function (err) {
      console.log(err);
      // expect(err).to.equal(cli.errors.INVALID_VOUCHER);
      done();
    }).done();
  });
  
  
  it.skip('something', function () {
    return cli.testCommand('account:redeem', 123).then(function (res) {
      
    });
  });
  
  
  
});

function userObject () {
  return {
    name: 'Scott Corgan',
    nick: 'scottcorgan',
    created_at: '2013-03-13T14:32:51Z',
    updated_at: '2014-05-23T17:35:21Z',
    state: 'active',
    experiments: [],
    email: 'test@divshot.com',
    emails: [{
      address: 'test@test.com',
      confirmed: true,
      primary: true
    }],
    welcomed: true,
    card: null,
    subscription: null,
    account: {
      balance: -100,
      credit: 100,
      active_card: false,
      cards: []
    },
    organizations: [{name: 'testorg'}],
    type: 'user'
  };
}

function redeemObject() {
  return {
    
  };
}