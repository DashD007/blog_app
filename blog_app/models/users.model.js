import sequelize  from "../db/sequelize.js";
import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    roleId: {type: DataTypes.UUID,allowNull:false},
},{timestamps:true});


// Helper to set password
User.prototype.setPassword = async function(plain) {
    this.password = await bcrypt.hash(plain, 10);
};


// Helper to check password
User.prototype.validatePassword = function(plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

export default User;