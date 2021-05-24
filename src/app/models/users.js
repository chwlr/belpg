'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({articles}) {
      this.hasMany(articles, { foreignKey: 'user_id', as: 'articles' })
    }

    toJSON() {
      return { ...this.get(), id: undefined, password: undefined }
    }
  };
  users.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'User must have a name'},
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'User must have a name'},
        isEmail: {msg: 'User must have a valid email'},
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: 'User must have a password'} ,
        len: { args: [6, 10], msg: 'Password length minimum 6' }
      },
    },
  }, {
    sequelize,
    modelName: 'users',
  });

  users.beforeSave(async (users) => {
    const salt = await bcrypt.genSalt()
    users.password = await bcrypt.hash(users.password, salt)
  });

  users.login = async (email, password) => {
    const user = await users.findOne({ where: { email } })
    if(user){
      const auth = await bcrypt.compare(password, user.password)
      if(auth){
        return user
      }
      throw Error('incorrect password')
    }
    throw Error('incorrect email') 
  }
  return users;
};

