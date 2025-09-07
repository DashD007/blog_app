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

const updateRoleSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "User id is required",
    }),
    name:Joi.string().min(1).required().messages({
        "string.empty":"Role name is required",
        "string.min":"Role name should be atleast 1 character long"
    }),
    permissions: Joi.array().required().messages({
        "array.empty":"Permissions is required",
    }),
});


const deleteRoleSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "User id is required",
    }),
});

export {createRoleSchema,deleteRoleSchema,updateRoleSchema};

