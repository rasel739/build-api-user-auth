const db = require('../models');
const User = require("../models/user")(db.sequelize,db.Sequelize);
const config = require("../config-env/config-env");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret_jwt.secret_key;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
   
    User.findOne({ where: { email: jwt_payload.email } }).then(function (user) {
      
      
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }).catch((error) => {
      if (error) {
        return done(error, false);
      }
    })
  })
);
