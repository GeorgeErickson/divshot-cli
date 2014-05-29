module.exports = function (imports) {
  var cli = imports.cli;
  
  var authCommand = cli.command('auth')
    .description('authentication help');
    
  authCommand.task('token')
      .description('show your authentication token')
      .handler(function (done) {
        var token = imports.user.get('token');
        
        cli.log();
        cli.log(token);
        
        done(null, token);
      });
};