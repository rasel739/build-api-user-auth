const jwt = require("jsonwebtoken");
const config = require("../config-env/config-env");

const userLoginData = (req, res) => {
  
  if (req.user.name === 'SequelizeUniqueConstraintError') {
    res.redirect(`${config.client_side_url}/login`);
  } else {
    const { id, email } = req.user;
    const payload = {
      id: id,
      email: email,
    };

    const token = jwt.sign(payload, config.secret_jwt.secret_key, {
      expiresIn: "1d",
    });

    res.redirect(`${config.client_side_url}/v1/${token}`);
  }
  
};
module.exports = userLoginData;
