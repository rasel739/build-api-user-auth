const db = require('../models');
const User = require("../models/user")(db.sequelize, db.Sequelize);
const Token = require("../models/tokenschema")(db.sequelize,db.Sequelize);
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../config-env/config-env');


const PasswordReset = async (req, res) => {
  // #swagger.tags = ['reset password']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Send reset password email.',
                schema: { $ref: '#/definitions/ResetPasswordSendEmail' }
        } */
 
  
  const email = await User.findOne({where: { email: req.body.email }});
  if (email) {


    await Token.update(
      {
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
      }
    );
 //Create a random reset token
    let fpSalt = crypto.randomBytes(64).toString('hex');
    
    
 
  //token expires after one hour
  let expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))
 
  //insert token data into DB
    await Token.create({
      email:req.body.email,
     token: fpSalt,
    expiration: expireDate,
    used: 0
  }).then((token) => {
    const link = `${config.client_side_url}/resetPassword/${token.token}`;
    if (config.nodeMailer.pass) {
      sendEmail(token.email, "Your password reset email", link);
    res.status(200).json({ message: 'password reset email sent' });
    } else {
      res.status(404).json({ message: 'node mailer engine not available' });
    }
   
   
    
  }).catch((err) => {
    
    console.log(err)
  })
    
  } else {
    res.status(404).json({status: 'Your email is not found. Please input your valid email.'});
  }
     
};

const passwordResetConfirmation = async (req, res) => {
  // #swagger.tags = ['reset password']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Set new password.',
                schema: { $ref: '#/definitions/ResetPasswordSet' }
        } */
  
  
 
  const record = await Token.findOne({
    where: {
      token: req.params.token,
      used: 0
    }
  }).then((user) => {

    let upd =  Token.update({
      used: 1
    },
    {
      where: {
        token: req.params.token
      }
    }).then((user) => {
    
     
  })
 
 bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    User.update({
    password:hash,
    
  },
  {
    where: {
      email:user.email,
    }
  }).then((pass)=>{
res.status(201).json({message: 'Password reset. Please login with your new password.'});
  }).catch((error)=>{
    res.status(500).json({message:'Password reset not successfully.Please try again'})
  })
});

  }).catch((error) => {
    
res.status(404).json({message: 'Token not found. Please try the reset password process again.'});
  })
 
  
};

module.exports = { PasswordReset, passwordResetConfirmation };



