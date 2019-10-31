const Joi = require("joi");

module.exports = user => {
  const schema = {
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  };
  return Joi.validate(user, schema);
};
