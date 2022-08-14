const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const passport = require("passport");
const config = require("../config-env/config-env");
const db = require('../models');
const User = require("../models/user")(db.sequelize, db.Sequelize);

//google login
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_signup.google_client_id,
      clientSecret: config.google_signup.google_client_secret,
      callbackURL: `${config.server_side_url}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({where:{ socialId: profile.id }}).then(function (user) {
       
        if (!user) {
          User.create({
            email: profile.emails[0].value,
            socialId: profile.id,
          }).then((users) => {
            return cb(null, users);
          }).catch((err) => {
            return cb(null, err);
          })
        } else {
          // if we find an user just return return user
          return cb(null, user);
        }
      }).catch((error) => {
        return cb(null, error);
      })
    }
  )
);

//facebook login

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_login.fb_app_id,
      clientSecret: config.facebook_login.fb_app_secret,
      callbackURL: `${config.server_side_url}/auth/facebook/callback`,
      profileFields: ["id", "emails", "name"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({where:{ socialId: profile.id }}).then(function (user) {
       
        if (!user) {
          User.create({
            email: profile.emails[0].value,
            socialId: profile.id,
          }).then((users) => {
            return cb(null, users);
          }).catch((err) => {
            return cb(null, err);
          })
        } else {
          // if we find an user just return return user
          return cb(null, user);
        }
      }).catch((error) => {
        return cb(null, error);
      })
    }
  )
);

//linkedin login

passport.use(
  new LinkedInStrategy(
    {
      clientID: config.linkdin_login.linkedin_id,
      clientSecret: config.linkdin_login.linkedin_secret,
      callbackURL: `${config.server_side_url}/auth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    function (accessToken, refreshToken, profile, cb) {
      process.nextTick(() => {
        User.findOne({where:{ socialId: profile.id }}).then(function (user) {
       
        if (!user) {
          User.create({
            email: profile.emails[0].value,
            socialId: profile.id,
          }).then((users) => {
            return cb(null, users);
          }).catch((err) => {
            return cb(null, err);
          })
        } else {
          // if we find an user just return return user
          return cb(null, user);
        }
      }).catch((error) => {
        return cb(null, error);
      })
      });
    }
  )
);


passport.use(new GitHubStrategy({
    clientID:config.github_login.github_id,
    clientSecret:config.github_login.github_secret,
  callbackURL: `${config.server_side_url}/auth/github/callback`,
    scope: ["user:email"],
  },
  function(accessToken, refreshToken, profile, cb) {
   User.findOne({where:{ socialId: profile.id }}).then(function (user) {
       
        if (!user) {
          User.create({
            email: profile.emails[0].value,
            socialId: profile.id,
          }).then((users) => {
            return cb(null, users);
          }).catch((err) => {
            return cb(null, err);
          })
        } else {
          // if we find an user just return return user
          return cb(null, user);
        }
      }).catch((error) => {
        return cb(null, error);
      })
  }
));




passport.serializeUser((user, done) => {
  done(null, user.id);
});

// find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
