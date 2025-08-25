import  sequelize  from "../db/sequelize.js";
import { DataTypes } from "sequelize";

const Blog = sequelize.define("Blog",{
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    coverImageUrl: { type: DataTypes.STRING },
    publishedBy : { type: DataTypes.UUID, allowNull: false },
    categoryId: { type: DataTypes.UUID, allowNull: true },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
},{timestamps:true});

export default Blog;
