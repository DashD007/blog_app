import asyncHandler from "../utils/AsyncHandler.js";
import {createBlogSchema,updateBlogSchema,deleteBlogSchema, toggleBlogPublishSchema, getBlogSchema} from "../schemas/blog.schema.js"
import ApiError from "../utils/ApiError.js";
import Blog from "../models/blog.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import Category from "../models/category.model.js";
import slugifyTitle from "../utils/slugify.js";
import { Sequelize, Op } from "sequelize";
import Comment from "../models/comment.model.js";
import User from "../models/users.model.js";
import hasPermission from "../utils/hasPermission.js";

const createBlog = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = createBlogSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all valid details");
    }

    if(!(await hasPermission(user?.roleId,"blog.create"))){
        throw new ApiError(400,"Permission prohibited");
    }
    const {title,content,categoryId} = value;

    const exist = await Blog.findOne({where:{slug:slugifyTitle(title),categoryId}});
    
    if(exist){
        throw new ApiError(400,"Blog with same title is already present");
    }

    const blog = await Blog.create({
        title,
        content,
        categoryId,
        slug: slugifyTitle(title),
        coverImageUrl: "/images/"+req.file?.filename,
        publishedBy : user?.id,
    })

    if(!blog){
        throw new ApiError(500,"Failed to create blog");
    }

    return res.status(200).json(new ApiResponse(200,blog,"Blog created successfully"));
});


const updateBlog = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = updateBlogSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all valid details");
    }

    if(!(await hasPermission(user?.roleId,"blog.update"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {title,content,categoryId} = value;

    const exist = await Blog.findOne({where:{slug:slugifyTitle(title),categoryId,publishedBy:user?.id}});

    if(!exist){
        throw new ApiError(400,"Blog doesn't exist");
    }

    const updatedBlog = await Blog.update({title,content,categoryId,slug:slugifyTitle(title)},{where:{id:exist?.id}});
    
    if(!updatedBlog){
        throw new ApiError(500,"Failed to update blog");
    }

    return res.status(200).json(new ApiResponse(200,updatedBlog,"Blog updated successfully"));
});

const deleteBlog = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = deleteBlogSchema.validate(req.body);

    if(error){
        throw new ApiError(400,"Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"blog.delete"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {id} = value;

    const exist = await Blog.findOne({where:{id,publishedBy:user?.id}});

    if(!exist){
        throw new ApiError(404,"Blog does not exist");
    }

    await Blog.destroy({where : {id:exist?.id}});

    return res.status(200).json(new ApiResponse(200,{},"Blog deleted successfully"));
});

const toggleBlogPublish = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = toggleBlogPublishSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all valid details");
    }

    const {title,categoryId} = value;

    const exist = await Blog.findOne({where:{slug:slugifyTitle(title),categoryId,publishedBy:user?.id}});

    if(!exist){
        throw new ApiError(400,"Blog doesn't exist");
    }

    const updatedBlog = await Blog.update({isPublished:!exist?.isPublished},{where:{id:exist?.id}});
    
    if(!updatedBlog){
        throw new ApiError(500,"Failed to update blog");
    }

    return res.status(200).json(new ApiResponse(200,updatedBlog,!exist?.isPublished ? "Blog published successfully":"Blog unpublished successfully"));
});

const getBlog = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"blog.get"))){
        throw new ApiError(400,"Permission prohibited");
    }

    const {error,value} = getBlogSchema.validate(req.params);
    if(error){
        throw new ApiError(new ApiError(400,"Invalid credentials"));
    }

    const {categorySlug,titleSlug} = req.params;

    const category = await Category.findOne({where:{
        slug : categorySlug
    }});

    if(!category){
        throw new ApiError(404,"Category doesn't exist");
    }

    const blog = await Blog.findOne({
        include:[{
            model:User,
            attributes:["username"]
        },{
            model:Comment,
            attributes:["content"],
            include:{
                model:User,
                attributes:["username"],
            }
        }],
        where:{
            categoryId:category?.id,
            slug:titleSlug,
            isPublished:true,
        }
    });

    if(!blog){
        throw new ApiError(404,"Blog doesn't exist");
    }
    
    return res.status(200).json(new ApiResponse(200,blog,"Blog fetched successfully"));
});

const listBlogs = asyncHandler(async(req,res) => {
    const {user} = req.session;

    if(!(await hasPermission(user?.roleId,"blog.list"))){
        throw new ApiError(400,"Permission prohibited");
    }
    const {query} = req.body;

    const blogs = await Blog.findAll({
        attributes:["id","title",["slug","titleSlug"],"publishedBy","coverImageUrl",[Sequelize.col("User.username"), "author"],[Sequelize.col("Category.slug"), "categorySlug"],[Sequelize.col("Category.name"), "category"]],
        include:[{
            model:Category,
            attributes:[],  
        },{
            model:User,
            attributes:[]
        }],
        where:{isPublished:true, title: {
            [Op.iLike]: `%${query}%`,
    },}});

    return res.status(200).json(new ApiResponse(200,blogs,"Blogs fetched successfully"));
});

const getCount = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const blogsPublishedByYou = await Blog.count({where:{
        publishedBy:user?.id,
    }});

    const totalBlogs = await Blog.count();

    return res.status(200).json(new ApiResponse(200,{blogsPublishedByYou, totalBlogs},"Count fetched successfully"));
})

export {createBlog,updateBlog,deleteBlog,toggleBlogPublish,getBlog,listBlogs,getCount};