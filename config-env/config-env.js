require("dotenv").config();

const dev = {
  app: {
    port: process.env.PORT || 5000,
  },
  db: {
    url: process.env.DB_URL,
  },
  pgdb: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database:process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    dialect:process.env.PG_DIALECT,
  },
  nodeMailer: {
    service: process.env.NODE_MAILER_SERVICE,
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
    from: process.env.NODE_MAILER_FROM ,
  },
  secret_jwt: {
    secret_key: process.env.SECRET_KEY,
  },
  google_signup: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  facebook_login: {
    fb_app_id: process.env.FACEBOOK_APP_ID,
    fb_app_secret: process.env.FACEBOOK_APP_SECRET,
  },

  linkdin_login: {
    linkedin_id: process.env.LINKEDIN_KEY,
    linkedin_secret: process.env.LINKEDIN_SECRET,
  },
  github_login: {
    github_id: process.env.GITHUB_CLIENT_ID,
    github_secret:process.env.GITHUB_CLIENT_SECRET,
  },
  client_side_url: process.env.CLIENT_SIDE_URL,
  server_side_url:process.env.SERVER_SIDE_URL,
  cookie_secret: process.env.COOKIE_SECRET,
};

module.exports = dev;
