var homeDir = require('home-dir');
var nash = require('nash');
var RequestBuilder = require('request-builder');
var User = require('../lib/user');
var errors = require('./errors');
var requireDir = require('./util/require-dir');
var cliConfigDirectory = homeDir('/.divshot');
var user = new User(cliConfigDirectory);
var _ = require('lodash');

var API_HOST = process.env.API_HOST || 'https://api.divshot.com';
var CLIENT_ID = process.env.CLIENT_ID || '526753cf2f55bd0002000006';

var request = new RequestBuilder()
  .origin(API_HOST)
  .header('Authorization', 'Bearer ' + user.get('token'));

  var cli = module.exports = nash({
    errors: errors,
    api: request
  });

// Load commands
_.each(requireDir(__dirname + '/commands'), function (command, name) {
  command(cli, request, user);
});