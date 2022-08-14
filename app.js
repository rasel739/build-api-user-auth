const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerDocument = require("./swagger-outputfile.json");
const passport = require("passport");
const singupUser = require("./routes/users.route");
const loginUser = require("./routes/login.route");
const resetPassword = require("./routes/passwordreset.route");
const config = require("./config-env/config-env");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const userLoginData = require("./service/userauth.service");
const path = require('path');
const app = express();
require("./middleware/passport");
if (config.google_signup.google_client_id) {
  require("./middleware/passport.middleware");
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(
  session({
    secret: config.cookie_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.set('view engine', 'ejs');


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


//google login
 // #swagger.ignore = true
app.get(
  "/auth/google",
  // #swagger.ignore = true
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  // #swagger.ignore = true
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.client_side_url}/login`,
  }),
  (req, res) => {
   
    userLoginData(req, res);
  }
);

//facebook login

app.get(
  "/auth/facebook",
  // #swagger.ignore = true
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  // #swagger.ignore = true
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${config.client_side_url}/login`,
  }),
  function (req, res) {
    // Successful authentication, redirect home.

    userLoginData(req, res);
  }
);

//linkedin login

app.get(
  "/auth/linkedin",
  // #swagger.ignore = true
  passport.authenticate("linkedin", {
    session: false,
    state: "",
  })
);

app.get(
  "/auth/linkedin/callback",
  // #swagger.ignore = true
  passport.authenticate("linkedin", {
    failureRedirect: `${config.client_side_url}/login`,
  }),
  (req, res) => {
    userLoginData(req, res);
  }
);


app.get('/auth/github',
  // #swagger.ignore = true
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  // #swagger.ignore = true
  passport.authenticate('github', { failureRedirect: `${config.client_side_url}/login`,}),
  function(req, res) {
    // Successful authentication, redirect home.
    userLoginData(req, res);
  });
 



app.use("/v1/user", singupUser);
app.use("/v1/login-user", loginUser);
app.use("/v1/reset-password", resetPassword);
//get server home page
app.get("/", (req, res) => {
  // #swagger.ignore = true
   
  res.sendFile(__dirname + "/./views/index.html");
 
});

//routes not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found Routes" });
});

//default error handler

app.use((error, req, res, next) => {
  res.status(500).json({ message: "Sumthing wrong Not Found File!" });
});

module.exports = app;
