const db = require('../models');
const User = require("../models/user")(db.sequelize, db.Sequelize);
const Token = require("../models/tokenschema")(db.sequelize,db.Sequelize);
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const saltRounds = 10;



const PasswordReset = async (req, res) => {
  // #swagger.tags = ['Reset password']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Send reset password email.',
                schema: { $ref: '#/definitions/ResetPasswordSendEmail' }
        } */
 
  
  let email = await User.findOne({where: { email: req.body.email }});
  if (email == null) {
 
    return res.json({status: 'ok'});
  }
  
  await Token.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
  //Create a random reset token
  let fpSalt = crypto.randomBytes(64).toString('hex');
 
  //token expires after one hour
  let expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))
 
  //insert token data into DB
  await Token.create({
    email: req.body.email,
    expiration: expireDate,
    token: fpSalt,
    used: 0
  }).then((token) => {
    
    const link = `http://localhost:3000/resetPassword/${token.token}`;
   sendEmail(token.email, "Your password has been reset", link);

  }).catch((err) => {
    
    console.log(err)
  })
 
   
 
  return res.json({status: 'ok'});
  
  
     

    
};

const passwordResetConfirmation = async (req, res) => {
  // #swagger.tags = ['Reset password']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Set new password.',
                schema: { $ref: '#/definitions/ResetPasswordSet' }
        } */
  
  
 
  let record = await Token.findOne({
    where: {
      token: req.params.token,
      used: 0
    }
  });
 
  if (record == null) {
    res.json({status: 'error', message: 'Token not found. Please try the reset password process again.'});
  }
 
  let upd = await Token.update({
      used: 1
    },
    {
      where: {
        token: req.params.token
      }
  });
 
 bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    User.update({
    password:hash,
    
  },
  {
    where: {
      email: req.body.email
    }
  }).then((pass)=>{
   console.log('password reset')
res.json({status: 'ok', message: 'Password reset. Please login with your new password.'});
  }).catch((error)=>{
    console.log('password not reset')
  })
});

 
 
  
  
};

module.exports = { PasswordReset, passwordResetConfirmation };



