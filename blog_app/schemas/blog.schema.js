import Joi from "joi";

const createBlogSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty":"Title is required",
        "string.min":"Tilte should be atleast 3 character long"
    }),
    content: Joi.string().min(3).required().messages({
        "string.empty":"Content is required",
        "string.min":"Content should be atleast 3 character long"
    }),
    categoryId: Joi.string().required().messages({
        "string.empty":"Category is required",
    }),
});

const deleteBlogSchema = Joi.object({
    id: Joi.string().min(1).required().messages({
        "string.empty":"Blog id is required",
    })
});

const updateBlogSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty":"Title is required",
        "string.min":"Tilte should be atleast 3 character long"
    }),
    content: Joi.string().min(3).required().messages({
        "string.empty":"Content is required",
        "string.min":"Content should be atleast 3 character long"
    }),
    categoryId: Joi.string().required().messages({
        "string.empty":"Category is required",
    }),
});

const toggleBlogPublishSchema = Joi.object({
    title: Joi.string().min(3).required().messages({
        "string.empty":"Title is required",
        "string.min":"Tilte should be atleast 3 character long"
    }),
    categoryId: Joi.string().required().messages({
        "string.empty":"Category is required",
    }),
});

const getBlogSchema = Joi.object({
    titleSlug : Joi.string().trim().min(1).required().messages({
        "string.empty":"Title is required",
    }),
    categorySlug: Joi.string().trim().min(1).required().messages({
        "string.empty":"category is required",
    }),
})

export {createBlogSchema,deleteBlogSchema,updateBlogSchema,toggleBlogPublishSchema,getBlogSchema};
