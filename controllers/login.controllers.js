const db = require('../models');
const User = require("../models/user")(db.sequelize, db.Sequelize);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config-env/config-env");

const loginUser = async (req, res) => {
  // #swagger.tags = ['User']
  /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User login.',
                schema: { $ref: '#/definitions/Login' }
        } */
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where:{email:email}
    });

    bcrypt.compare(password, user.password, async (err, result) => {
      if (!result) {
        res.status(401).json({
          message: "login not successfull",
          error: "User not found",
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = { loginUser };
