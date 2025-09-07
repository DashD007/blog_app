import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const OTP = sequelize.define("OTP",{
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email:{type:DataTypes.STRING,unique:false,allowNull:false},
    otp:{type:DataTypes.STRING,unique:false,allowNull:false},
    expiresAt: { type: DataTypes.DATE, allowNull: false },
});

export default OTP;