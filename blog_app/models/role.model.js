import sequelize from "../db/sequelize.js";
import { DataTypes } from "sequelize";

const Role = sequelize.define("Role",{
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false,unique: true },
},{timestamps:true});

export default Role;