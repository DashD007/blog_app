import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/users.model.js";
import Role from "../models/role.model.js";
import { Sequelize } from "sequelize";
import hasPermission from "../utils/hasPermission.js";

const getAllUsers = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"user.list"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const users = await User.findAll({attributes:["username","email","createdAt",[Sequelize.col("Role.name"),"role"]],include:{
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
})
export {getAllUsers,getUserAndRoleCount};