import sequelize  from "../db/sequelize.js";
import { DataTypes } from "sequelize";

const Comment = sequelize.define("Comment",{
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    content:{type:DataTypes.TEXT,allowNull:false},
    blogId:{type: DataTypes.UUID,allowNull:false},
    commentedBy:{type: DataTypes.UUID,allowNull:false},
},{timestamps:true});

export default Comment;