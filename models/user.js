module.exports = (sequelize, Sequelize) => {
  const UserSchema = sequelize.define('User', {

    name: {
      type: Sequelize.STRING,
       defaultValue:null
    },
    phone: {
      type: Sequelize.STRING,
       defaultValue:null,
      validate: {
        
        notEmpty: true,
        
      }
    },
    image: {
    type: Sequelize.STRING,
    defaultValue:null
  },
  socialId: {
        type: Sequelize.STRING,
        
      required: true,
        defaultValue:null,
      },
  email: {
    type: Sequelize.STRING,
    unique:true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty:true,
    },
    
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue:null,
      validate: {
         notEmpty: false, 
   },
  }
});
  return UserSchema;
};
