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