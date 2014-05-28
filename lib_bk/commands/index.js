var commands = function (cli) {
  Object.keys(commands.list).forEach(function (commandName) {
    commands.list[commandName](cli);
  });
};

module.exports = commands;

commands.list = {
  account: require('./account'),
  apps: require('./apps'),
  auth: require('./auth'),
  changelog: require('./changelog'),
  config: require('./config'),
  create: require('./create'),
  destroy: require('./destroy'),
  domains: require('./domains'),
  emails: require('./emails'),
  env: require('./env'),
  files: require('./files'),
  init: require('./init'),
  login: require('./login'),
  logout: require('./logout'),
  open: require('./open'),
  promote: require('./promote'),
  protect: require('./protect'),
  pull: require('./pull'),
  push: require('./push'),
  rename: require('./rename'),
  rollback: require('./rollback'),
  server: require('./server'),
  status: require('./status'),
  unprotect: require('./unprotect')
};

commands.get = function (name) {
  return commands.list[name];
};

