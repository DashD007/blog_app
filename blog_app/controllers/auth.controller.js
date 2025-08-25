import { registerSchema,loginSchema } from "../schemas/auth.schema.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/users.model.js";
import Role from "../models/role.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/AsyncHandler.js";

import hasPermission from "../utils/hasPermission.js";
import { Sequelize } from "sequelize";

const registerUser = asyncHandler(async(req,res) => {
    const {user:loggedInUser} = req.session;

    const {error, value} = registerSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }

    const permission = await hasPermission(loggedInUser?.roleId,"user.create");

    if(!permission){
        throw new ApiError(400,"Permission prohibited")
    }
    const {username,email,password,roleId} = value;

    const exists = await User.findOne({ where: { email } });

    if(exists){
        throw new ApiError(400,"User already exist with given email address");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({email,username,password:hashedPassword,roleId});

    if(!user){
        throw new ApiError(500,"Failed to create user");
    }
    const role = await Role.findOne({
        attributes:["name"],
        where:{
            id:roleId,
        }});

    return res.status(200).json(new ApiResponse(200,{id: user.id, username: user.username, email: user.email,roleId:user.roleId, roleName:role.name},"User created successfully"));
    
});

const loginUser = asyncHandler(async(req,res) => {

    const {error, value} = loginSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }

    const {email,password} = value;

    const user = await User.findOne({
        attributes:{
            include: [[Sequelize.col("Role.name"), "roleName"]]
        },
        include:{
            model:Role,
            attributes:[]
        },
        where:{email}
    });

    
    if(!user){
        throw new ApiError(400,"User doesn't exist with given email address");
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Password incorrect");
    }

    req.session.user = {id: user.id,roleName:user.dataValues.roleName, username: user.username, email: user.email,roleId:user.roleId};

    return res.status(200).json(new ApiResponse(200,req.session.user,"User logged in successfully"));
});

const logoutUser = asyncHandler(async(req,res) => {
    req.session.destroy(err => {
        if(err){
            throw new ApiError(500,"Failed to logout");
        }
        res.clearCookie("sessionId");
        return res.status(200).json(new ApiResponse(200,{},"Logged out successfully"));
    })
});

export {registerUser, loginUser,logoutUser};