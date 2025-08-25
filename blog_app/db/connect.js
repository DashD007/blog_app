import { createAssociations } from "../models/associations.js";
import sequelize from "./sequelize.js";

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully');
    await sequelize.sync({ alter: true }); // auto-create tables
    console.log('models created');
    createAssociations();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};

export {connectDB};