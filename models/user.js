var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING,
    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [8, 100]
      },
      // setter and getter serach sequelize setter for more inof
      set: function(value){
        var salt = bcrypt.genSaltSync(10);
        console.log(salt);

        var hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password',value);
        this.setDataValue('salt',salt);
        this.setDataValue('password_hash',hashedPassword);
      }
    }
  }, {
    hooks: {
      beforevalidation: function(user, option) {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase().trim();
        }

      }
    },
    // for more info http://docs.sequelizejs.com/en/2.0/docs/models-definition/
    // also can define classMethods
    instanceMethods: {
      toPublicJSON: function(){
        return _.pick(this, 'id', 'email', 'createdAt', 'updatedAt');
      }
    }
  });
};