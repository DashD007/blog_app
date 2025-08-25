import asyncHandler from "../utils/AsyncHandler.js";
import {categorySchema, updateCategorySchema} from "../schemas/category.schema.js"
import ApiError from "../utils/ApiError.js";
import Category from "../models/category.model.js";
import slugifyTitle from "../utils/slugify.js";
import ApiResponse from "../utils/ApiResponse.js";
import hasPermission from "../utils/hasPermission.js";

const createCategory = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = categorySchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"category.create"))){
        throw new ApiError(400,"Permission prohibited");
    } 
    const {name} = value;

    const exist = await Category.findOne({where:{
        slug:slugifyTitle(name),
    }});

    if(exist){
        throw new ApiError(400,"Category with same name already exist");
    }

    const category = await Category.create({
        name,
        slug:slugifyTitle(name),
    });

    if(!category){
        throw new ApiError(500,"Failed to create category");
    }

    return res.status(200).json(new ApiResponse(200,category,"Category created successfully"));
});

const updateCategory = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = updateCategorySchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"category.update"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {newName,oldName} = value;

    const exist = await Category.findOne({where:{
        slug:slugifyTitle(oldName),
    }});

    if(!exist){
        throw new ApiError(400,"Category doesn't exist");
    }

    const category = await Category.update({
        name:newName,
        slug:slugifyTitle(newName),
    },{where:{
        id:exist?.id,
    }});

    if(!category){
        throw new ApiError(500,"Failed to update category");
    }

    return res.status(200).json(new ApiResponse(200,category,"Category updated successfully"));
});

const deleteCategory = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = categorySchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"category.delete"))){
        throw new ApiError(400,"Permission prohibited");
    } 

    const {name} = value;

    const exist = await Category.findOne({where:{
        slug:slugifyTitle(name),
    }});

    if(!exist){
        throw new ApiError(400,"Category doesn't exist");
    }

    const category = await Category.destroy({where:{
        id:exist?.id,
    }});


    return res.status(200).json(new ApiResponse(200,category,"Category deleted successfully"));
});

const listCategory = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"category.list"))){
        throw new ApiError(400,"Permission prohibited");
    } 

    const categories = await Category.findAll();

    return res.status(200).json(new ApiResponse(200,categories,"Categories list fetched successfully"));
})


export {createCategory,updateCategory,deleteCategory,listCategory};