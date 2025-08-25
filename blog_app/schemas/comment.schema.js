import Joi from "joi";

const createCommentSchema = Joi.object({
    content:Joi.string().min(1).required().messages({
        "string.empty":"Comment content is required",
        "string.min":"Comment content should be atleast 1 character long"
    }),
    blogId: Joi.string().required().messages({
        "string.empty":"Blog Id is required",
    }),
});

const updateCommentSchema = Joi.object({
    content:Joi.string().min(1).required().messages({
        "string.empty":"Comment content is required",
        "string.min":"Comment content should be atleast 1 character long"
    }),
    blogId: Joi.string().required().messages({
        "string.empty":"Blog Id is required",
    }),
    commentId:Joi.string().required().messages({
        "string.empty":"Comment Id is required",
    }),
});

const deleteCommentSchema = Joi.object({
    commentId:Joi.string().required().messages({
        "string.empty":"Comment Id is required",
    }),
    blogId: Joi.string().required().messages({
        "string.empty":"Blog Id is required",
    }),
});

export {createCommentSchema,updateCommentSchema,deleteCommentSchema};