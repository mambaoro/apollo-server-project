const message = (sequelize, Datatypes) => {
  const Message = sequelize.define('message', {
    text: {
      type: Datatypes.String,
      validate: {
        notEmpty: {
          args: true,
          msg: 'A message has to have a text',
        },
      },
    },
  });
  Message.associate = models => {
    Message.belongsTo(models.User);
  };
  return Message;
};

module.exports = message;
