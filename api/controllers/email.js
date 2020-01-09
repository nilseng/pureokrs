var express = require('express');
const sgMail = require('@sendgrid/mail');

const msg = {
  from: 'teodor.nilseng@gmail.com',
  text: 'Welcome to www.pureokrs.com - the simplest OKR tool on the web. Add your first Objective and Key Results to get started.',
  html: '<strong>Welcome to www.pureokrs.com - the simplest OKR tool on the web. Add your first Objective and Key Results to get started.</strong>',
};

module.exports.sendEmail = (email, companyName) => {
  msg.subject = companyName + ' is registered. Welcome!';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{});
  return;
}

module.exports.sendNewUserEmail = (email, companyName, token) => {
  let msg = {
    from: 'teodor.nilseng@gmail.com',
    text: 'Click the following link or paste it in your browser to set a password and activate your user. https://www.pureokrs.com/resetpassword/'+ email + '/' + token,
    html: 'Click the following link to set a password and activate your user. <a href="https://www.pureokrs.com/resetpassword/'+ email + '/' + token +'">Reset</a>',
  };
  msg.subject = 'You now have a user at pureOKRs. Welcome!';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{});
  return;
}

module.exports.sendResetEmail = (email, token) => {
  let msg = {
    from: 'teodor.nilseng@gmail.com',
    text: 'Click the following link or paste it in your browser to reset your password. https://www.pureokrs.com/resetpassword/'+ email + '/' + token,
    html: 'Click the following link to reset your password. <a href="https://www.pureokrs.com/resetpassword/'+ email + '/' + token +'">Reset</a>',
  };
  msg.subject = 'You can now reset your password at pureOKRs.';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{});
  return;
}