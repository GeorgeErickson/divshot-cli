var _ = require('lodash');
var format = require('chalk');
var moment = require('moment');
var request = require('request');
var formatUserEmails = require('../util/format-user-emails');

module.exports = function (cli, api) {
  var account = cli.command('account')
    .description('display basic account details')
    .before('authenticate')
    .handler(function (done) {
      var getUser = api.get('self');
      
      getUser().then(function (res) {
        var user = res.body;
        
        var balance = (user.account.balance/100 < 0) ? 0 : user.account.balance;
        var output = {};
        
        cli.log();
        
        output['Account Balance'] = '$' + balance;
        
        // Account credit
        if (user.account.credit > 0) output['Account Credit'] = '$' + user.account.credit/100;
        
        output['Account Created'] = moment(user.created_at).format('MMMM Do, YYYY');
        
        // Emails
        if (user.emails.length) output['Emails'] = formatUserEmails(user.emails);
        
        // Organizations
        if (user.organizations.length > 0) output['Organizations'] = _.pluck(user.organizations, 'name');
        
        // Output to stdout
        cli.logObject(output);
        
        done(null, res.body);
      }, function (res) {
        done(cli.errors.DEFAULT);
      });
      
    });
    
  account.task('redeem')
    .description('reedem a voucher and credit it to your account')
    .handler(function (code, done) {
      if (!code) return done(cli.errors.INVALID_VOUCHER);
      
      var redeemVoucher = api.put('vouchers', code, 'redeem');
      
      redeemVoucher().then(function (res) {
        var body = res.body;
        
        cli.log();
        cli.log(format.bold('$' + body.amount/100) + ' has been applied to your account.', {success:true});
        
        done(null, res.body);
      }, function (res) {
        done();
      });
      
          
      // cli.api.vouchers.redeem(code, function (err, response, body) {
      //   if (err) return done(cli.errors.DEFAULT);
      //   if (response.statusCode == 304) return done(cli.errors.VOUCHER_USED_BY_YOU);
      //   if (response.statusCode == 404) return done(cli.errors.INVALID_VOUCHER);
      //   if (response.statusCode == 403) return done(cli.errors.VOUCHER_USED);
        
      //   cli.log();
      //   cli.log(format.bold('$' + body.amount/100) + ' has been applied to your account.', {success:true});
      // });
    });
};

// module.exports = function (cli) {
//   account.task('redeem <voucher code>')
//     .description('reedem a voucher and credit it to your account')
//     .handler(redeem);
  
//   function redeem (code, done) {
//     if (!code) return done(cli.errors.INVALID_VOUCHER);
    
//     cli.api.vouchers.redeem(code, function (err, response, body) {
//       if (err) return done(cli.errors.DEFAULT);
//       if (response.statusCode == 304) return done(cli.errors.VOUCHER_USED_BY_YOU);
//       if (response.statusCode == 404) return done(cli.errors.INVALID_VOUCHER);
//       if (response.statusCode == 403) return done(cli.errors.VOUCHER_USED);
      
//       cli.log();
//       cli.log(format.bold('$' + body.amount/100) + ' has been applied to your account.', {success:true});
//     });
//   }
  
// };