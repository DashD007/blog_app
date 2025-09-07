import Joi from "joi";

const deleteUserSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "User id is required",
  }),
});

const updateUserSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.empty": "User id is required",
  }),
  username: Joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be at most 10 characters long",
    }),
  roleId: Joi.string()
    .required()
    .messages({ "string.empty": "roleId is required" }),
});

export { deleteUserSchema,updateUserSchema };
