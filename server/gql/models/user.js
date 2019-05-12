const bcrypt = require('bcrypt');

const user = (sequelize, Datatypes) => {
  const User = sequelize.define('user', {
    username: {
      type: Datatypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: Datatypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 42],
      },
    },
  });
  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async login => {
    // eslint-disable-next-line no-shadow
    let user = await User.findOne({
      where: {
        username: login,
      },
    });
    if (!user) {
      user = await User.findOne({
        where: {
          email: login,
        },
      });
    }
    return user;
  };

  User.beforeCreate(async user => {
    // eslint-disable-next-line no-param-reassign
    user.password = await user.generatePasswordHash();
  });
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return bcrypt.hash(this.password, saltRounds);
  };
  return User;
};

module.exports = user;
