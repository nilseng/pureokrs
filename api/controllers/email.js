var express = require('express');
const sgMail = require('@sendgrid/mail');

const msg = {
  from: 'teodor.nilseng@gmail.com',
  text: 'Welcome to www.pureokrs.com. Add your first Objective and Key Results to get started.',
  html: 'Welcome to www.pureokrs.com. Add your first Objective and Key Results to get started.',
};

module.exports.sendEmail = (email, companyName) => {
  msg.subject = companyName + ' is registered. Welcome!';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{
    if(err){
      console.log(err);
    }else{
      console.log('email sent');
    }
  });
  return;
}

module.exports.sendNewUserEmail = (email, companyName) => {
  msg.subject = 'You now have a user at pureOKRs. Welcome!';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{
    if(err){
      console.log(err);
    }else{
      console.log('email sent');
    }
  });
  return;
}

module.exports.sendResetEmail = (email, token) => {
  let msg = {
    from: 'teodor.nilseng@gmail.com',
    text: 'Follow the following link to reset your password. https://www.pureokrs.com/resetpassword/'+ email + '/' + token,
    html: 'Follow the link below to reset your password. <a href="https://www.pureokrs.com/resetpassword/'+ email + '/' + token +'">Reset</a>',
  };
  msg.subject = 'You can now reset your password at pureOKRs.';
  msg.to = email;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(msg, (err, doc) =>{
    if(err){
      console.log(err);
    }else{
      console.log('email sent');
    }
  });
  return;
}