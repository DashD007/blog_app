import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/users.model.js";
import Role from "../models/role.model.js";
import { Sequelize } from "sequelize";
import hasPermission from "../utils/hasPermission.js";
import { deleteUserSchema, updateUserSchema } from "../schemas/user.schema.js";

const getAllUsers = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"user.list"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const users = await User.findAll({attributes:["id","username","email","createdAt",[Sequelize.col("Role.name"),"role"]],include:{
        model:Role,
        attributes:[],
    }});

    return res.status(200).json(new ApiResponse(200,users,"Users list fetched successfully"));
});

const getUserAndRoleCount = asyncHandler(async(req,res) => {
    const userCount = await User.count();
    const roleCount = await Role.count();
    
    if(!userCount || !roleCount){
        throw new ApiError(500,"Failed to fetch counts");
    }

    return res.status(200).json(new ApiResponse(200,{userCount,roleCount},"Counts fetched successfully"));
});


const deleteUser = asyncHandler(async(req,res) => {

    const {error,value} = deleteUserSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.id || "Please provide valid details");
    }
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"user.delete"))){
        throw new ApiError(400,"Permission prohibited");
    }
    const {id} = value;
    
    const exist = await User.findOne({where:{
        id
    }});

    if(!exist){
        throw new ApiError(404,"User doesn't exist");
    }

    await exist.destroy();
    return res.status(200).json(new ApiResponse(200,{},"User deleted successfully"));
});

const updateUser = asyncHandler(async(req,res) => {
    const {error,value} = updateUserSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.id || "Please provide valid details");
    }
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"user.delete"))){
        throw new ApiError(400,"Permission prohibited");
    }
    const {id,username,roleId} = value;

    const exist = await User.findOne({where:{
        id
    }});

    if(!exist){
        throw new ApiError(400,"User doesn't exist");
    }

    exist.username = username;
    exist.roleId = roleId;
    await exist.save();

    return res.status(200).json(new ApiResponse(200,{},"User updated successfully"));
})
export {getAllUsers,getUserAndRoleCount,deleteUser,updateUser};