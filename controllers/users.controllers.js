const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const config = require("../config-env/config-env");
const db = require('../models');
const User = require('../models/user')(db.sequelize, db.Sequelize);


const createUser = async (req, res) => {
  // #swagger.tags = ['User']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User Signup.',
                schema: { $ref: '#/definitions/Signup' }
        } */
  const { email, password } = req.body;

  
  const subject = "Signup  email confirmation";
  const text =
    "Hello, Thank you for creating your Build API account.We look forward to readingyour posts and hope you will enjoy the space that we created for our customers.The  team";

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    


   await User.create({
      email: email,
      password: hash,
    }).then((user) => {
      sendEmail(user.email, subject, text);
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, config.secret_jwt.secret_key, {
        expiresIn: "1d",
      });
      res.status(200).json({
        message: "User signup successfully saved",
        token: `Bearer ${token}`,
      });

    }).catch((error) => {
      console.log(error)
      res.status(500).send({
        error: error.message,
      });
    });

      
  });
    
};


const getUser = async (req, res) => {
  // #swagger.tags = ['User']
  /* #swagger.responses[200] = {
            description: 'User get.',
            schema: { $ref: '#/definitions/User' }
    } */
  console.log('user email=',req.user.email)
  const userFind = await User.findOne({ where: { email: req.user.email } })
  
  if (userFind) {
    await User.findAll({ where: { email:req.user.email } }).then((user) => {
      
    res.status(200).json(user);
    }).catch((error) => {
       res.status(500).send(error.message);
    })
  } else {
    res.status(404).json({message:'User not found'})
  }
    
}



const updateUser = async (req, res) => {

  // #swagger.tags = ['User']
   /*  #swagger.parameters['obj'] = {
            in:'body',
              required: 'true',
            description: 'Update user data',
            schema: { $ref: '#/definitions/UpdateUser' }
           
    } */

  const { name, phone } = req.body;
  
  const userFind = await User.findOne({ where: { email: req.user.email } });

  if (userFind) {
    await User.update(
    {
      name: name,
      phone: phone,
      image:!req.file?null:req.file.path,
    },
    {
      where:{email:req.user.email}
    }
  ).then((user) => {
    res.status(200).json({id:user,message:'User update successfully'});
  }).catch((error) => {
    
    res.status(404).json({message:'User not found'})
  })
  } else {
    res.send('User not found!')
  }
  
  
}

module.exports = {createUser,updateUser,getUser};