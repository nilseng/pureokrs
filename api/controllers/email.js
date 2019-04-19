var express = require('express');
const sgMail = require('@sendgrid/mail');

const msg = {
  from: 'teodor.nilseng@gmail.com',
  text: 'Welcome to PureOKRs.com. Invite your colleagues and add your first Objective and Key Results to get started.',
  html: '<strong>Welcome to PureOKRs.com. Invite your colleagues and add your first Objective and Key Results to get started.</strong>',
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