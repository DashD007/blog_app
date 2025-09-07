import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Role from "../models/role.model.js";
import hasPermission from "../utils/hasPermission.js";
import { createRoleSchema, deleteRoleSchema, updateRoleSchema } from "../schemas/role.schema.js";
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
});


const deleteRole = asyncHandler(async(req,res) => {

    const {error,value} = deleteRoleSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"role.delete"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {id} = value;

    const exist = await Role.findOne({where:{
        id,
    }});

    if(!exist){
        throw new ApiError(400,"Role doesn't exist");
    }

    await exist.destroy();

    return res.status(200).json(new ApiResponse(200,{},"Role deleted successfully"));
});

const updateRole = asyncHandler(async(req,res) => {
    const {error,value} = updateRoleSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"role.delete"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {id,name,permissions} = value;

    const exist = await Role.findOne({where:{
        id,
    }});

    if(!exist){
        throw new ApiError(400,"Role doesn't exist");
    }

    const existWithName = await Role.findOne({
        where:{
            name
        }
    });

    if(existWithName){
        throw new ApiError(400,"Role with name exist already");
    }

    exist.name = name;
    await exist.save();

    // delete all the existing permissions and add new
    await Permission.destroy({where:{
        id
    }});

    const permissionInDb = await Promise.all(permissions.map(permission =>  Permission.create({name:permission,roleId:exist?.id})));

    return res.status(200).json(new ApiResponse(200,{},"Role updated successfully"));

})


export {getRolesList, createRole,deleteRole,updateRole};