var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING
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
      set: function(value) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    }
  }, {
    hooks: {
      beforeValidate: function(user, option) {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        }
      }
    },
    classMethods: {
      authenticate: function(body) {
        return new Promise(function(resolve, reject) {
          if (typeof body.email !== 'string' || typeof body.password !== 'string') {
            return reject();
          }
          user.findOne({
            where: {
              email: body.email
            }
          }).then(function(user) {
            if (!user || !bcrypt.compareSync(body.password, user.password_hash)) {
              reject();
            } else {
              resolve(user);
            }

          }, function(e) {
            return reject();
          });
        });
      },
      findbyToken: function(token) {
        return new Promise(function(resolve, reject) {
          try {
            var decodedJWT = jwt.verify(token, 'anotherkey');
            var btyes = cryptojs.AES.decrypt(decodedJWT.token, 'key');
            var tokenData = JSON.parse(btyes.toString(cryptojs.enc.Utf8));
            user.findById(tokenData.id).then(function(user) {
              if (user) {
                resolve(user);
              } else {
                reject();
              }

            }, function(e) {
              console.log(e)
              reject();
            });
          } catch (e) {
            reject();
          }
        });
      }
    },
    // for more info http://docs.sequelizejs.com/en/2.0/docs/models-definition/
    // also can define classMethods
    instanceMethods: {
      toPublicJSON: function() {
        return _.pick(this, 'id', 'email', 'createdAt', 'updatedAt');
      },
      generateToken: function(type) {
        if (!type) {
          return undefined;
        }
        try {
          var stringData = JSON.stringify({
            id: this.id,
            type: type
          });
          var encryptData = cryptojs.AES.encrypt(stringData, 'key').toString();
          var token = jwt.sign({
            token: encryptData
          }, 'anotherkey');
          return token;
        } catch (e) {
          console.error(e)
          return undefined;
        }
      }
    }
  });
  return user;
};