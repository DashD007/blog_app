import Joi from "joi";

const categorySchema = Joi.object({
    name:Joi.string().min(3).max(30).required().messages({
        "string.empty":"Category name is required",
        "string.min":"Category name should be atleast 3 character long",
        "string.max":"Category name should be atmost 30 character long"
    })
});

const updateCategorySchema = Joi.object({
    id:Joi.string().required().messages({
        "string.empty":"Category id is required",
    }),
    newName:Joi.string().min(3).max(30).required().messages({
        "string.empty":"Category name is required",
        "string.min":"Category name should be atleast 3 character long",
        "string.max":"Category name should be atmost 30 character long"
    }),
});

const deleteCategorySchema = Joi.object({
    id:Joi.string().required().messages({
        "string.empty":"Category id is required",
    }),
});


export {categorySchema,updateCategorySchema,deleteCategorySchema};