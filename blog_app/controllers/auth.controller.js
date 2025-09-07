import { registerSchema,loginSchema, forgetPasswordSchema, validateOTPSchema } from "../schemas/auth.schema.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/users.model.js";
import Role from "../models/role.model.js";
import OTP from "../models/otp.model.js"
import bcrypt from "bcrypt";
import asyncHandler from "../utils/AsyncHandler.js";
import transporter from "../config/nodemailer.js";
import hasPermission from "../utils/hasPermission.js";
import { Sequelize } from "sequelize";
import Permission from "../models/permission.model.js";

const registerUser = asyncHandler(async(req,res) => {
    const {user:loggedInUser} = req.session;

    const {error, value} = registerSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error.message || "Please provide all details");
    }


    if(!(await hasPermission(loggedInUser?.roleId,"user.create"))){
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
    
    const permissions = await Permission.findAll({
        attributes:["name"],
        where:{
            roleId
        }
    });

    return res.status(200).json(new ApiResponse(200,{id: user.id, username: user.username, email: user.email,roleId:user.roleId, roleName:role.name, permissions: permissions.map(perm => perm.name)},"User created successfully"));
    
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

    const permissions = await Permission.findAll({
        attributes:["name"],
        where:{
            roleId:user.roleId,
        }
    });

    req.session.user = {id: user.id,roleName:user.dataValues.roleName, username: user.username, email: user.email,roleId:user.roleId, permissions: permissions.map(perm => perm.name)};

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

const forgotPassword = asyncHandler(async(req,res) => {
    const {error, value} = forgetPasswordSchema.validate(req.body);
    if(error){
        throw new ApiError(400,error?.message || "Please provide all details");
    }
    const {email} = value;

    const exist = await User.findOne({where:{
        email,
    }});

    if(!exist){
        throw new ApiError(404,"User doesn't exist with given email");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp,10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, otp: hashedOTP, expiresAt });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.status(200).json(new ApiResponse(200,{},"OTP sent successfully"));
});

const validateOTP = asyncHandler(async(req,res) => {

    const {error,value} = validateOTPSchema.validate(req.body);

    if(error){
        throw new ApiError(400,error?.message || "Please provide valid details");
    }

    const { email,otp, newPassword } = value;

    const hashedOTP = await bcrypt.hash(otp,10);
    // find OTP entry
    const otpEntry = await OTP.findOne({ where: { otp:hashedOTP, email } });
    if (!otpEntry) throw new ApiError(404,"OTP incorrect");

    // check expiry
    if (new Date() > otpEntry.expiresAt) {
        await otpEntry.destroy();
        throw new ApiError(404,"OTP expired");
    }

    // find user
    const user = await User.findOne({ where: { email: otpEntry.email } });
    if (!user) throw new ApiError(404,"User doesn't exist");

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // delete OTP
    await otpEntry.destroy();

    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"));
})

export {registerUser, loginUser,logoutUser,forgotPassword,validateOTP};