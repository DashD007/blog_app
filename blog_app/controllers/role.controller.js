import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Role from "../models/role.model.js";
import hasPermission from "../utils/hasPermission.js";
import { createRoleSchema } from "../schemas/role.schema.js";
import Permission from "../models/permission.model.js";
const getRolesList = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"role.list"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const roles = await Role.findAll({attributes:["id","name","createdAt"]});
    if(!roles){
        throw new ApiError(400,"Failed to fetch roles");
    }
    return res.status(200).json(new ApiResponse(200,roles,"Roles list fetched successfully"));
});

const createRole = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"role.create"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {error,value} = createRoleSchema.validate(req.body);

    console.log(value);


    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    const {name,permissions} = value;

    const exist = await Role.findOne({where:{
        name,
    }});

    if(exist){
        throw new ApiError(400,"Role with same name already exist");
    }

    const role = await Role.create({name});

    const permissionInDb = await Promise.all(permissions.map(permission =>  Permission.create({name:permission,roleId:role?.id})));

    if(!permissionInDb || !role){
        throw new ApiError(500,"Failed to create role");
    }

    return res.status(200).json(new ApiResponse(200,{},"Role created successfully"));
})


export {getRolesList, createRole};