import Joi from "joi";

export const registerSchema = Joi.object({
      username : Joi
              .string()
              .min(3)
              .max(10)
              .required()
              .messages({"string.empty":"Username is required",
                "string.min": "Username must be at least 3 characters long",
                "string.max": "Username must be at most 10 characters long",}),
    
      email: Joi
          .string()
          .email()
          .required()
          .messages({"string.empty":"Email is required",
                "string.email": "Please provide a valid email",
                }),
      password: Joi
              .string()
              .min(6)
              .max(40)
              .required()
              .messages({"string.empty":"Password is required",
                          "string.min": "Password must be at least 6 characters long",
                          "string.max": "Password must be at most 40 characters long",}),
      
      roleId : Joi
            .string()
            .required()
            .messages({"string.empty":"roleId is required"})

});

export const loginSchema = Joi.object({
  email: Joi
        .string()
        .email()
        .required()
        .messages({"string.empty":"Email is required",
                "string.email": "Please provide a valid email",
                }),
  password: Joi
          .string()
          .min(6)
          .max(40)
          .required()
          .messages({"string.empty":"Password is required",
                          "string.min": "Password must be at least 6 characters long",
                          "string.max": "Password must be at most 40 characters long",}),
});