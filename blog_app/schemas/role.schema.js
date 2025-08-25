import Joi from "joi";

const createRoleSchema = Joi.object({
    name:Joi.string().min(1).required().messages({
        "string.empty":"Role name is required",
        "string.min":"Role name should be atleast 1 character long"
    }),
    permissions: Joi.array().required().messages({
        "array.empty":"Permissions is required",
    }),
});

export {createRoleSchema};

