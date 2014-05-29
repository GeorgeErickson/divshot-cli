module.exports = function (cli, api, user) {
  cli.command('auth')
    .description('authentication help')
    .task('token')
      .description('show your authentication token')
      .handler(function (done) {
        var token = user.get('token');
        
        cli.log();
        cli.log(token);
        
        done(null, token);
      });
};