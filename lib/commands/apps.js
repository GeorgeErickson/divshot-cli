var format = require('chalk');
var _ = require('lodash');

module.exports = function (imports) {
  var cli = imports.cli;
  var api = imports.api;
  var getApps = api.get('apps');
  
  cli.command('apps')
    .description('list your Divshot apps')
    .before('authenticate')
    .handler(function (done) {
      getApps().then(function (res) {
        var apps = res.body;
        
        cli.log();
        
        if (!apps || !apps.self) return done(imports.errors.DEFAULT);
        
        cli.log(format.yellow('  Your apps\n'));
        
        printApps(apps.self);
        printOrgApps(apps);
        
        done(null, apps);
      }, function (res) {
        var body = res.body;
        
        if (body.error === 'invalid_token')  return done(imports.errors.INVALID_TOKEN);
        if (body.error) return done(body.error);
        
        done(imports.errors.DEFAULT);
      });
    });
  
  function printOrgApps (apps) {
    _(apps).keys().filter(isOrg).each(printOrgTitle);
    
    function isOrg (name) {
      return name.split(':')[0] === 'org';
    }
    
    function printOrgTitle (name) {
      var type = name.split(':')[0]
      var orgName = name.split(':')[1]
      
      cli.log();
      cli.log(format.yellow('  ' + orgName + ' apps'));
      cli.log();
      
      printEachOrgApp(apps[name]);
    }
  }
  
  function printEachOrgApp (orgApps) {
    if (!orgApps.length) return cli.log('  (no apps)');
    printApps(orgApps);
  }
  
  function printApps (apps) {
    _(apps).map(filename).sortBy().each(cli.log.bind(cli));
    
    function filename (app) {
      return '  ' + (app.name || app.architect.filename);
    }
  }
};