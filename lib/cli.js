var homeDir = require('home-dir');
var nash = require('nash');
var RequestBuilder = require('request-builder');
var User = require('./user');
var Cwd = require('./cwd');
var errors = require('./errors');
var requireDir = require('./util/require-dir');
var cliConfigDirectory = homeDir('/.divshot');
var _ = require('lodash');

var user = new User(cliConfigDirectory);
var cwd = new Cwd();

var API_HOST = process.env.API_HOST || 'https://api.divshot.com';
var CLIENT_ID = process.env.CLIENT_ID || '526753cf2f55bd0002000006';

var request = new RequestBuilder()
  .origin(API_HOST)
  .header('Authorization', 'Bearer ' + user.get('token'));

  var cli = module.exports = nash({
    // TODO: Add title and data, etc. here
  });

// Load commands
_.each(requireDir(__dirname + '/commands'), function (command, filename) {
  command({
    cli: cli,
    errors: errors,
    api: request,
    user: user,
    cwd: cwd
  });
});