import { DataTypes } from "sequelize";
import  sequelize from "../db/sequelize.js";

const Category = sequelize.define("Category",{
    id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true},
    name:{type:DataTypes.STRING,allowNull:false,unique:true},
    slug:{type:DataTypes.STRING,allowNull:false,unique:true},
},{timestamps:true});

export default Category;

