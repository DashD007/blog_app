import asyncHandler from "../utils/AsyncHandler.js";
import { createCommentSchema, deleteCommentSchema, updateCommentSchema } from "../schemas/comment.schema.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import hasPermission from "../utils/hasPermission.js";

const createComment = asyncHandler(async(req,res) => {

    const {user} = req.session;

    const {error,value} = createCommentSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"comment.create"))){
        throw new ApiError(400,"Permission prohibited");
    } 

    const {content,blogId} = value;

    const exist = await Blog.findOne({where:{id:blogId}});

    if(!exist){
        throw new ApiError(404,"Blog doesn't exist");
    }

    const comment = await Comment.create({content,blogId:blogId,commentedBy:user?.id});

    if(!comment){
        throw new ApiError(500,"Failed to create comment");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment created successfully"));
});

const updateComment = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = updateCommentSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"comment.update"))){
        throw new ApiError(400,"Permission prohibited");
    } 

    const {content,blogId,commentId} = value;

    const exist = await Comment.findOne({where:{id:commentId,blogId,commentedBy:user?.id}});

    if(!exist){
        throw new ApiError(404,"comment doesn't exist");
    }

    const comment = await Comment.update({content},{where:{
        blogId,commentedBy:user?.id,id:commentId
    }});

    if(!comment){
        throw new ApiError(500,"Failed to update comment");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment update successfully"));
});

const deleteComment = asyncHandler(async(req,res) => {
    const {user} = req.session;

    const {error,value} = deleteCommentSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }

    if(!(await hasPermission(user?.roleId,"comment.delete"))){
        throw new ApiError(400,"Permission prohibited");
    } 

    const {commentId,blogId} = value;

    const exist = await Comment.findOne({where:{blogId,commentedBy:user?.id,id:commentId}});


    if(!exist){
        throw new ApiError(404,"Comment doesn't exist");
    }

    await Comment.destroy({where:{
        id:commentId,
    }});

    return res.status(200).json(new ApiResponse(200,{},"Comment deleted successfully"));
});

export {createComment,updateComment,deleteComment};