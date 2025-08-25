import sequelize from "../db/sequelize.js";
import {DataTypes} from "sequelize";

const Permission = sequelize.define("Permission",{    
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name:{type:DataTypes.STRING,unique:false,allowNull:false},
    roleId:{type: DataTypes.UUID,allowNull:false}
},{timestamps:true});

export default Permission;