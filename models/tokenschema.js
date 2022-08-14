
module.exports = (sequelize, Sequelize) => {
  const tokenSchema = sequelize.define('Token', {
    email: Sequelize.STRING,
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
    used:Sequelize.INTEGER
});
  return tokenSchema;
};



