const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const config = require("../config-env/config-env");
const db = require('../models');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const passport = require('passport');

const createUser = async (req, res) => {
  // #swagger.tags = ['user authentication']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User Signup.',
                schema: { $ref: '#/definitions/Signup' }
        } */
  
 const { email, password } = req.body;
   
  const subject = "Signup  email confirmation";
  const text =
    "Hello, Thank you for creating your Build API account.We look forward to readingyour posts and hope you will enjoy the space that we created for our customers.The  team";

  if (password ==="") {
    res.status(422).send({message:'Please input your password'})
  } else {
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
      res.status(201).json({
        message: "User signup successfully saved",
        token: `Bearer ${token}`,
      });

    }).catch((error) => {
      
      if (error.name === 'SequelizeUniqueConstraintError') {
           res.status(409).send({
        message:'Your email already exists. Please login your account',
      });
      } else if(error.errors[0].validatorName==='isEmail') {
         res.status(422).send({
        message:"It's not email.Please enter a valid email address",
      });
      } else if(error.errors[0].validatorName=== 'len'){
        res.status(4022).send({
        message:'The password length should be between 1 and 8 characters',
      });
      } else if (error.errors[1].validatorName==='notEmpty') {
        res.status(400).send({
          message: 'Email is not empty. Please provide a email'
        });
      }
         
    });

      
  });
  }
    
};


const loginUser = async (req, res) => {
  // #swagger.tags = ['user authentication']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User login.',
                schema: { $ref: '#/definitions/Login' }
        } */
  const { email, password } = req.body;

  const userFind = await User.findOne({where:{email:email}})
 
  if (userFind) {
      const user = await User.findOne({
      where:{email:email}
    }).then((user) => {
      bcrypt.compare(password, user.password, async (err, result) => {
      
      if (!result) {
        res.status(403).json({
          message: "Your password is wrong. Plesae input your valid password",
        });
      } else {
        const payload = {
          id: user._id,
          email: user.email,
        };

        const token = jwt.sign(payload, config.secret_jwt.secret_key, {
          expiresIn: "1d",
        });

        res.status(200).json({
          message: "successfully logged in",
          user: user?.email,
          token: `Bearer ${token}`,
        });
      }
    });

    }).catch((error) => {
      console.log('error=',error)

    })
  } else {
    res.status(403).json({message:'Your email is not registration. Please try again valid email'})
   }

    
 
};


const getUser = async (req, res) => {
  // #swagger.tags = ['user authentication']
  /* #swagger.responses[200] = {
            description: 'User get.',
            schema: { $ref: '#/definitions/User' }
    } */
  
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

  // #swagger.tags = ['user authentication']
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
  ).then((users) => {
    res.status(200).json({message:'User update successfully'});
  }).catch((error) => {
    
    res.status(404).json({message:'User not found'})
  })
  } else {
    res.status(404).json({message:'User not found'})
  }
  
  
}

const userDelete = async (req, res) => {
  // #swagger.tags = ['user authentication']

  const findUser = await User.findOne({where:{email:req.user.email}});

  if(findUser){
    await User.destroy({ where: { email: req.user.email } }).then((user) => {
    if(user=== 1){
      res.status(202).json({ message: "User deleted successfully"})
    }
    
  }).catch((error) => {
    res.status(500).json({message:'User not delete user'})
  })
  }else{
    res.status(404).json({message:'User not found!'})
  }

 
 
};


module.exports = {createUser,loginUser,updateUser,getUser,userDelete};