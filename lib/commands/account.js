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
        
        if (res.statusCode == 304) return done(cli.errors.VOUCHER_USED_BY_YOU);
        
        cli.log();
        cli.log(format.bold('$' + body.amount/100) + ' has been applied to your account.', {success:true});
        
        done(null, res.body);
      }, function (res) {
        if (res.statusCode == 404) return done(cli.errors.INVALID_VOUCHER);
        if (res.statusCode == 403) return done(cli.errors.VOUCHER_USED);
        
        done(cli.errors.DEFAULT);
      });
    });
};